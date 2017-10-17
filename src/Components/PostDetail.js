import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Layout, Spin, message, Modal, Icon } from 'antd'
import { fetchCommentsListByPostId, updateCommentById, updateTargetComment } from '@/Actions/comments'
import { CommentCard, CommentEdit } from '@/Components'
import { voteComment, delComment } from '@/Services/API'

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
    
    voteHandler = (id, type = 'upVote') => {
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
        const { author, body } = this.props.data
        const { targetPost, onCardOpen } = this.props
        const { list, commentsLoading, targetComment } = this.props.comments
        const { showCommentEditmodal } = this.state
        return (
            <Layout id="post_detail_box">
                <div className="post_content_box">
                    <h3>Author: {author}
                        <span className="post_txt" onClick={onCardOpen} >
                            EDIT POST!!!
                            <Icon type="edit"
                            style={{float: 'right', fontSize: 24, color: '#108ee9'}}/>
                        </span>
                    </h3>
                    <p>{body}</p>
                    <p style={{marginTop: 10, color: '#108ee9'}}>{`${list.length} comment${list.length > 1 ? 's' : ''}`}</p>
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
                                    onVoteUp={e => this.voteHandler(item.id, 'upVote')}
                                    onVoteDown={e => this.voteHandler(item.id, 'downVote')}
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

export default connect(state => ({
    comments: state.comments,
    targetPost: state.posts.targetPost
}), dispatch => bindActionCreators({
    fetchCommentsListByPostId,
    updateCommentById,
    updateTargetComment
}, dispatch))(PostDetail)
