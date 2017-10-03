import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, message } from 'antd'
import { VotePanel } from '@/Components'

export default class Comment extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        onVoteUp: PropTypes.func,
        onVoteDown: PropTypes.func,
        onDel: PropTypes.func,
        onClick: PropTypes.func
    }

    render() {
        const { data, onVoteUp, onVoteDown, onDel, onClick } = this.props
        return (
            <Card title={data.author}
                onClick={onClick}
                extra={
                <span>
                    <VotePanel 
                        onVoteUp={onVoteUp}
                        onVoteDown={onVoteDown}
                        onCountClick={e => message.info(`I am voted by ${data.voteScore} people!`)}
                        onDel={onDel}
                        voteCount={data.voteScore} />
                </span>
            }
            style={{ width: 'calc(100% - 20px)', margin: '10px auto 0', position: 'relative', cursor: 'pointer' }}>
                <p>{data.body}</p>
            </Card>
        )
    }
}
