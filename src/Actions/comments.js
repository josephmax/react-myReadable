import * as API from '../Services/API'
import { 
    UPDATE_COMMENT_LIST,
    UPDATE_COMMENT_LOADING_STATUS,
    UPDATE_COMMENT_BY_ID,
    UPDATE_TARGET_COMMENT
} from '../Utils/consts'

/**
 * 
 * @param {array} list - list content
 * @param {number} pageIndex - reserved for pagination handle
 */
const commentListAction = (list = [], pageIndex = 0) => ({
    type: UPDATE_COMMENT_LIST,
    payload: list,
    pageIndex: pageIndex
})

/**
 * 
 * @param {bool} status - loading status control
 */
const updateLoading = status => ({
    type: UPDATE_COMMENT_LOADING_STATUS,
    payload: status === true
})

export const updateCommentById = content => ({
    type: UPDATE_COMMENT_BY_ID,
    payload: content
})

export const updateTargetComment = (comment = {}) => ({
    type: UPDATE_TARGET_COMMENT,
    payload: Object.assign(comment)
})
/**
 * 
 * @param {*} category - target category to fetch post list
 * @param {*} pageIndex - reserved for pagination handle
 */
export const fetchCommentsListByPostId = (postId, pageIndex = 0) => dispatch => {
    dispatch(updateLoading(true))
    return API.fetchCommentsByPostId(postId).then((res) => {
        dispatch(commentListAction(res, pageIndex))
        dispatch(updateLoading(false))
    })
}
