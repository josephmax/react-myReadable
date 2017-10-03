import {
    UPDATE_COMMENT_LIST,
    UPDATE_COMMENT_LOADING_STATUS,
    UPDATE_COMMENT_BY_ID,
    UPDATE_TARGET_COMMENT
} from '../Utils/consts'

const initState = {
    list: [],
    commentsLoading: false,
    targetComment: {}
}

const ACTION_HANDLER = {
    [UPDATE_COMMENT_LIST]: (state, action) => ({
        ...state,
        list: action.payload
        // todo: reserved for pagination handle
        // list: action.pageIndex === 0 ? action.payload : state.list.concat(action.payload)
    }),
    [UPDATE_COMMENT_LOADING_STATUS]: (state, action) => ({
        ...state,
        postLoading: action.payload
    }),
    [UPDATE_COMMENT_BY_ID]: (state, action) => ({
        ...state,
        list: state.list.map(item => item.id === action.payload.id ? action.payload : item)
    }),
    [UPDATE_TARGET_COMMENT]: (state, action) => ({
        ...state,
        targetComment: action.payload
    })
}

export default (state = initState, action) => {
    return ACTION_HANDLER[action.type] ? ACTION_HANDLER[action.type](state, action) : state
}