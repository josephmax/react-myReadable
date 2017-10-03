import {
    UPDATE_POST_LIST,
    UPDATE_POST_LOADING_STATUS,
    UPDATE_POST_LIST_ORDER,
    UPDATE_POST_BY_ID,
    UPDATE_TARGET_POST
} from '../Utils/consts'

const initState = {
    list: [],
    postLoading: false,
    orderBy: 'voteScore',
    targetPost: {}
}

const ACTION_HANDLER = {
    [UPDATE_POST_LIST]: (state, action) => ({
        ...state,
        list: action.payload
        // todo: reserved for pagination handle
        // list: action.pageIndex === 0 ? action.payload : state.list.concat(action.payload)
    }),
    [UPDATE_POST_LOADING_STATUS]: (state, action) => ({
        ...state,
        postLoading: action.payload
    }),
    [UPDATE_POST_LIST_ORDER]: (state, action) => ({
        ...state,
        orderBy: action.payload
    }),
    [UPDATE_POST_BY_ID]: (state, action) => ({
        ...state,
        list: state.list.map(item => item.id === action.payload.id ? action.payload : item)
    }),
    [UPDATE_TARGET_POST]: (state, action) => ({
        ...state,
        targetPost: action.payload
    })
}

export default (state = initState, action) => {
    return ACTION_HANDLER[action.type] ? ACTION_HANDLER[action.type](state, action) : state
}