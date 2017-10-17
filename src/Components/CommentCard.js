import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, message, Icon } from 'antd'
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
                extra={
                <span>
                    <VotePanel 
                        onVoteUp={onVoteUp}
                        onVoteDown={onVoteDown}
                        onCountClick={e => message.info(`I am voted by ${data.voteScore} people!`)}
                        onDel={onDel}
                        voteCount={data.voteScore} />
                    <span className="post_txt" onClick={onClick} >
                        <Icon type="edit"
                        style={{verticalAlign: 'middle', marginLeft: 10, fontSize: 24, color: '#108ee9'}}/>
                    </span>
                </span>
            }
            style={{ width: 'calc(100% - 20px)', margin: '10px auto 0', position: 'relative', cursor: 'pointer' }}>
                <p>{data.body}</p>
            </Card>
        )
    }
}
