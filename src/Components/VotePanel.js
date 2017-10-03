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
        voted: false
    }
    handleVote = (e) => {
        e.stopPropagation()
        const { voted } = this.state
        const { onVoteUp, onVoteDown } = this.props
        if (voted === false) {
            this.setState({voted: true})
            onVoteUp()
        } else {
            this.setState({voted: false})
            onVoteDown()
        }
    }
    handleDel = (e) => {
        e.stopPropagation()
        const { onDel } = this.props
        onDel()
    }
    render() {
        const { voted } = this.state
        const { voteCount, onCountClick } = this.props
        return (
            <Button.Group>
                <Button icon={voted ? 'like' : 'like-o'} size="large"
                    onClick={this.handleVote}/>
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
