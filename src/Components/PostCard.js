import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { updatePostById } from '@/Actions/posts'
import { Card, message } from 'antd'
import { VotePanel } from '@/Components'
import { votePost, delPost } from '@/Services/API'

class Post extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        onCardOpen: PropTypes.func
    }

    voteHandler = (type = 'upVote') => {
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

    delHandler = () => {
        const { updatePostById, data } = this.props
        delPost(data).then(res => {
            if (!res.error) {
                updatePostById(res)
                message.success('delete succeed')
            } else {
                message.error(res.error)
            }
        }).catch( err => message.error('Oops, network error please try again later.'))
    }

    render() {
        const { data, onCardOpen } = this.props
        return (
            <Card title={data.title} 
                onClick={e => onCardOpen(data)}
                extra={
                <span>
                    <VotePanel 
                        onVoteUp={e => this.voteHandler('upVote')}
                        onVoteDown={e => this.voteHandler('downVote')}
                        onCountClick={e => message.info(`I am voted by ${data.voteScore} people!`)}
                        onDel={this.delHandler}
                        voteCount={data.voteScore} />
                </span>
                }
                style={{ width: 'calc(100% - 70px)', marginBottom: 15, position: 'relative', cursor: 'pointer' }}>
                <p>{data.author}</p>
                <p>{data.body}</p>
            </Card>
        )
    }
}

export default connect(null, dispatch => bindActionCreators({
    updatePostById,

}, dispatch))(Post)