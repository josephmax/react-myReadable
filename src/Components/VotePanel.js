import React, { Component } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'

export default class VotePanel extends Component {
    static propTypes = {
        voteCount: PropTypes.number,
        onVoteUp: PropTypes.func.isRequired,
        onVoteDown: PropTypes.func.isRequired,
        onDel: PropTypes.func.isRequired,
        onCountClick: PropTypes.func
    }
    static defaultProps = {
        voteCount: 0
    }
    // todo: voted status should be managed from backend, this is only for frontend display demo
    state = {
        like: false,
        dislike: false
    }
    handleVote = (e, type) => {
        e.stopPropagation()
        const { like, dislike } = this.state
        const { onVoteUp, onVoteDown } = this.props
        const voted = type === 'like' ? like : dislike
        if (type === 'like') {
            this.setState({like: !voted})
            voted === false ? onVoteUp() : onVoteDown()
        } else {
            this.setState({dislike: !voted})
            voted === false ? onVoteDown() : onVoteUp()
        }
    }
    handleDel = (e) => {
        e.stopPropagation()
        const { onDel } = this.props
        onDel()
    }
    render() {
        const { like, dislike } = this.state
        const { voteCount, onCountClick } = this.props
        return (
            <Button.Group>
                <Button icon={like ? 'like' : 'like-o'} size="large"
                    onClick={e => this.handleVote(e, 'like')}/>
                <Button icon={dislike ? 'dislike' : 'dislike-o'} size="large"
                    onClick={e => this.handleVote(e, 'dislike')}/>
                <Button size="large" style={{padding: '0 15px'}}
                    onClick={e => {
                        e.stopPropagation()
                        onCountClick()
                    }}>
                    {voteCount}
                </Button>
                <Button icon={'delete'} size="large"
                        onClick={this.handleDel}/>
            </Button.Group>
        )
    }
}
