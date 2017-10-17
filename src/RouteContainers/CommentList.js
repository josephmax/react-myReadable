import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'

import { fetchPostsListByCategory, fetchPostsList } from '@/Actions/posts'

class CommentList extends Component {
    static propTypes = {
        dataList: PropTypes.array.isRequired,
        childrenItem: PropTypes.func,
        orderBy: PropTypes.string,
        onDetailOpen: PropTypes.func.isRequired,
        onPostEdit: PropTypes.func
    }

    listOrder = {
        'voteScore': (a, b) => (b.voteScore - a.voteScore),
        'timestamp': (a, b) => (b.timestamp - a.timestamp)
    }

    updateList = category => {
        const { fetchPostsListByCategory, fetchPostsList } = this.props
        category ? fetchPostsListByCategory(category) : fetchPostsList()
    }

    componentWillMount () {
        const { match } = this.props
        const { category } = match.params
        this.updateList(category)
    }
    
    componentWillReceiveProps(nextProps) {
        const { match } = nextProps
        const { category } = match.params
        if (category !== this.props.match.params.category) {
            this.updateList(category)
        }
    }
    
    render() {
        const { dataList, childrenItem, orderBy, onDetailOpen, onPostEdit } = this.props
        const ChildrenItem = childrenItem
        return (
            <div>
                {
                    dataList.filter(item => !item.deleted).sort(this.listOrder[orderBy]).map(item => (
                        <ChildrenItem data={item}
                            onCardOpen={e => onDetailOpen({
                                category: item.category,
                                post: item
                            })}
                            onPostEdit={onPostEdit} key={item.id} />
                    ))
                }
            </div>
        )
    }
}

export default withRouter(connect(null, dispatch => bindActionCreators({
    fetchPostsListByCategory,
    fetchPostsList,
}, dispatch))(CommentList))