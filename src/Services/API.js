import { baseUrl } from './config'
const fetchUrl = (action, options = {}) => fetch(baseUrl + action, {
    ...options,
    headers: {
        'Authorization': 'joseph-is-cool',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }
}).then(res => {
    return res.json()
})

/**
 * Categories API
 */
export const fetchCategories = () => fetchUrl('/categories')

/**
 * Posts API
 */
export const fetchPostsByCategory = (category) => fetchUrl(`/${category}/posts`)
export const fetchPosts = () => fetchUrl('/posts')
export const votePost = (postId, type = 'upVote') => fetchUrl(`/posts/${postId}`, {
    method: 'POST',
    body: JSON.stringify({
        option: type === 'downVote' ? 'downVote' : 'upVote'
    })
})
export const newPost = (data) => fetchUrl(`/posts/`, {
    method: 'POST',
    body: JSON.stringify(data)
})
export const editPost = (data, id) => fetchUrl(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
})
export const delPost = (data) => fetchUrl(`/posts/${data.id}`, {
    method: 'DELETE'
})

/**
 * Comments API
 */
export const fetchCommentsByPostId = (postId) => fetchUrl(`/posts/${postId}/comments`)
export const fetchCommentById = (commentId) => fetchUrl(`/comments/${commentId}`)
export const voteComment = (commentId, type = 'upVote') => fetchUrl(`/comments/${commentId}`, {
    method: 'POST',
    body: JSON.stringify({
        option: type === 'downVote' ? 'downVote' : 'upVote'
    })
})
export const newComment = (data) => fetchUrl(`/comments/`, {
    method: 'POST',
    body: JSON.stringify(data)
})
export const editComment = (data, id) => fetchUrl(`/comments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
})
export const delComment = (data) => fetchUrl(`/comments/${data.id}`, {
    method: 'DELETE'
})