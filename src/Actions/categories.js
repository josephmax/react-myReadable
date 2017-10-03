import * as API from '../Services/API'
import { UPDATE_CATEGORY_LIST, UPDATE_TARGET_CATEGORY } from '../Utils/consts'

export const categoryListAction = (list = []) => ({
    type: UPDATE_CATEGORY_LIST,
    payload: list
})

export const updateTargetCategory = (category) => ({
    type: UPDATE_TARGET_CATEGORY,
    payload: category === 'all' ? '' : category
})

export const fetchCategoryList = () => dispatch => API.fetchCategories().then(({categories}) => dispatch(categoryListAction(categories)))
