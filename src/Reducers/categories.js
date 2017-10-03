import { UPDATE_CATEGORY_LIST, UPDATE_TARGET_CATEGORY } from '../Utils/consts'

const initState = {
    list: [],
    targetCategory: ''
}

const ACTION_HANDLER = {
    [UPDATE_CATEGORY_LIST]: (state, action) => ({
        ...state,
        list: action.payload
    }),
    [UPDATE_TARGET_CATEGORY]: (state, action) => ({
        ...state,
        targetCategory: action.payload
    })
}

export default (state = initState, action) => {
    return ACTION_HANDLER[action.type] ? ACTION_HANDLER[action.type](state, action) : state
}