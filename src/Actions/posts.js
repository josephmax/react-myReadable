import * as API from '../Services/API'
import { 
    UPDATE_POST_LIST,
    UPDATE_POST_LOADING_STATUS,
    UPDATE_POST_LIST_ORDER,
    UPDATE_POST_BY_ID,
    UPDATE_TARGET_POST
} from '../Utils/consts'

/**
 * 
 * @param {array} list - list content
 * @param {number} pageIndex - reserved for pagination handle
 */
const postListAction = (list = [], pageIndex = 0) => ({
    type: UPDATE_POST_LIST,
    payload: list,
    pageIndex: pageIndex
})

/**
 * 
 * @param {bool} status - loading status control
 */
const updateLoading = status => ({
    type: UPDATE_POST_LOADING_STATUS,
    payload: status === true
})

export const updateListOrder = order => ({
    type: UPDATE_POST_LIST_ORDER,
    payload: order
})

export const updatePostById = content => ({
    type: UPDATE_POST_BY_ID,
    payload: content
})

export const updateTargetPost = (post = {}) => ({
    type: UPDATE_TARGET_POST,
    payload: Object.assign({}, post)
})
/**
 * 
 * @param {*} category - target category to fetch post list
 * @param {*} pageIndex - reserved for pagination handle
 */
export const fetchPostsListByCategory = (category, pageIndex = 0) => dispatch => {
    dispatch(updateLoading(true))
    return API.fetchPostsByCategory(category).then((res) => {
        dispatch(postListAction(res, pageIndex))
        dispatch(updateLoading(false))
    })
}
/**
 * 
 * @param {*} pageIndex - reserved for pagination handle
 */
export const fetchPostsList = (pageIndex = 0) => dispatch => {
    dispatch(updateLoading(true))
    return API.fetchPosts().then((res) => {
        dispatch(postListAction(res, pageIndex))
        dispatch(updateLoading(false))
    })
}
