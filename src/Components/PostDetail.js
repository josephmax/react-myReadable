import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import { Layout, Spin, message, Modal, Icon } from 'antd'
import { updatePostById } from '@/Actions/posts'
import { fetchCommentsListByPostId, updateCommentById, updateTargetComment } from '@/Actions/comments'
import { CommentCard, CommentEdit, VotePanel } from '@/Components'
import { voteComment, delComment, votePost, delPost } from '@/Services/API'

const { Footer, Content } = Layout

class PostDetail extends Component {
    static propTypes = {
        category: PropTypes.string.isRequired,
        data: PropTypes.object,
        onCardOpen: PropTypes.func
    }

    state = {
        showCommentEditmodal: false
    }

    componentWillMount () {
        const { fetchCommentsListByPostId, data } = this.props
        if (data && data.id) {
            fetchCommentsListByPostId(data.id)
        }
    }
    
    componentWillReceiveProps(nextProps) {
        const prevData = this.props.data
        const { fetchCommentsListByPostId, data } = nextProps
        if (data && data.id && data.id!== prevData.id) {            
            fetchCommentsListByPostId(data.id)
        }
    }
    votePostHandler = (type = 'upVote') => {
        const { updatePostById, data } = this.props
        const { id } = data
        votePost(id, type).then(res => {
            if (!res.error) {
                updatePostById(res)
                message.success('thanks for your voting!')
            } else {
                message.error(res.error)
            }
        }).catch( err => message.error('Oops, network error please try again later.'))
    }
    voteCommentHandler = (id, type = 'upVote') => {
        const { updateCommentById } = this.props
        voteComment(id, type).then(res => {
            if (!res.error) {
                updateCommentById(res)
                message.success('thanks for your voting!')
            } else {
                message.error(res.error)                
            }
        }).catch(_ => message.error('Oops, network error please try again later.'))
    }

    commentEditmodalCancelHandler = () => {
        const { updateTargetComment } = this.props
        this.setState({
            showCommentEditmodal: false
        })
        setTimeout(() => {
            updateTargetComment()
        }, 300)
    }
    commentEditmodalOpenHandler = data => {
        const { updateTargetComment } = this.props
        updateTargetComment(data)
        this.setState({showCommentEditmodal: true})
    }
    commentEditSuccessCallback = (res, type) => {
        const { fetchCommentsListByPostId, data, updateTargetComment, updateCommentById } = this.props
        if (type === 'add') {
            fetchCommentsListByPostId(data.id)
        } else {
            updateCommentById(res)
        }
        this.setState({
            showCommentEditmodal: false
        })
        setTimeout(() => {
            updateTargetComment()
        }, 300)
    }
    delHandler = () => {
        const { updatePostById, data, history } = this.props
        delPost(data).then(res => {
            if (!res.error) {
                updatePostById(res)
                message.success('delete succeed')
                history.go(-1)
            } else {
                message.error(res.error)
            }
        }).catch( err => message.error('Oops, network error please try again later.'))
    }
    commentDelHandler = (comment) => {
        const { updateCommentById } = this.props
        delComment(comment).then(res => {
            if (!res.error) {
                updateCommentById(res)
                message.success('delete succeed')
            } else {
                message.error(res.error)                
            }
        }).catch(_ => message.error('Oops, network error please try again later.'))
    }
    render() {
        const { author, body, voteScore } = this.props.data
        const { targetPost, onCardOpen } = this.props
        const { list, commentsLoading, targetComment } = this.props.comments
        const { showCommentEditmodal } = this.state
        let countableComments = list.filter(item => !item.deleted && !item.parentDeleted)        
        return (
            <Layout id="post_detail_box">
                <div className="post_content_box">
                    <p>
                        <span className="post_txt" onClick={onCardOpen} >
                            EDIT POST!!!
                        <Icon type="edit"
                            style={{float: 'right', fontSize: 24, color: '#108ee9'}}/>
                        </span>
                        <VotePanel 
                            onVoteUp={e => this.votePostHandler('upVote')}
                            onVoteDown={e => this.votePostHandler('downVote')}
                            onCountClick={e => message.info(`I am voted by ${voteScore} people!`)}
                            onDel={this.delHandler}
                            voteCount={voteScore} />
                    </p>
                    <p><span className="blue_txt">author</span>: {author}</p>
                    <p><span className="blue_txt">content</span>: {body}</p>
                    <p style={{marginTop: 10, color: '#108ee9'}}>{`${countableComments.length} comment${countableComments.length > 1 ? 's' : ''}`}</p>
                </div>
                <Content style={{overflow: 'scroll',
                    display: 'flex',
                    justifyContent: 'center'}}>
                    <Spin spinning={commentsLoading}>
                        {
                            list && list.length > 0
                            ? list.filter(item => !item.deleted).map(item => (
                                <CommentCard key={item.id}
                                    data={item}
                                    onClick={e => this.commentEditmodalOpenHandler(item)}
                                    onVoteUp={e => this.voteCommentHandler(item.id, 'upVote')}
                                    onVoteDown={e => this.voteCommentHandler(item.id, 'downVote')}
                                    onDel={e => this.commentDelHandler(item)}/>
                            ))
                            : <p style={{textAlign: 'center', marginTop: '30%'}}>No Comments Yet!</p>
                        }
                    </Spin>
                </Content>
                <Footer style={{padding: '10px'}}>
                    <CommentEdit
                        parentId={targetPost.id}
                        onSubmitSuccess={this.commentEditSuccessCallback} />
                </Footer>
                <Modal
                    zIndex={2}
                    visible={showCommentEditmodal}
                    title="Edit Comment"
                    maskClosable={true}
                    footer={null}
                    onCancel={this.commentEditmodalCancelHandler}>
                    <CommentEdit data={targetComment}
                        parentId={targetPost.id}
                        onSubmitSuccess={this.commentEditSuccessCallback} />
                </Modal>
            </Layout>
        )
    }
}

export default withRouter(connect(state => ({
    comments: state.comments,
    targetPost: state.posts.targetPost
}), dispatch => bindActionCreators({
    fetchCommentsListByPostId,
    updatePostById,
    updateCommentById,
    updateTargetComment
}, dispatch))(PostDetail))
