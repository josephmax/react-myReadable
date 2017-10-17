import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import { PostDetail } from '@/Components'
import { Modal } from 'antd'

import { updateTargetPost, updatePostById } from '@/Actions/posts'
class PostDetailModal extends Component {
    static propTypes = {
        onPostEdit: PropTypes.func,
        onPostEditSuccess: PropTypes.func
    }

    componentDidMount() {
        const { match, updateTargetPost, postList } = this.props
        const { post_id } = match.params
        let targetPost
        postList.forEach(item => {
            if (item.id === post_id) {
                targetPost = item
            }
        })
        updateTargetPost(targetPost || {}) 
    }
    
    
    render() {
        const { match, history } = this.props
        const { post_id, category } = match.params
        const { postList, onPostEdit } = this.props
        let targetPost
        postList.forEach(item => {
            if (item.id === post_id) {
                targetPost = item
            }
        })
        return (
            <Modal
                zIndex={1}
                visible={true}
                title={targetPost.title}
                maskClosable={true}
                footer={null}
                style={{ width: 800, top: '5vh'}}
                onCancel={e => history.go(-1)}>
                <PostDetail
                    category={category}
                    data={targetPost}
                    onCardOpen={onPostEdit}/>
            </Modal>
        )
    }
}

export default withRouter(connect(state => ({
    postList: state.posts.list
}), dispatch => bindActionCreators({
    updateTargetPost,
    updatePostById
}, dispatch))(PostDetailModal))
