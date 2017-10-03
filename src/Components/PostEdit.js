import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Input, Button, Icon, message, Select } from 'antd'
import uuidv4 from 'uuid/v4'
import { newPost, editPost } from '@/Services/API'

const FormItem = Form.Item
const { TextArea } = Input

class PostEdit extends Component {
    static propTypes = {
        onSubmitSuccess: PropTypes.func,
        data: PropTypes.object
    }
    state = {
        post: {
            author: '',
            body: '',
            title: ''
        },
        category: ''
    }
    mapPropsToData = (data) => {
        const { author, body, title, category } = data
        this.setState({
            post: {
                author,
                body,
                title
            },
            category: category
        })
    }
    updateInput = (name, val) => {
        this.setState(prev => ({
            post: {
                ...prev.post,
                [name]: val
            }
        }))
    }
    resetData = () => {
        const { post } = this.state
        this.setState({
            post: Object.keys(post).reduce((data, key) => ({
                ...data,
                [key]: ''
            }), {}),
            category: ''
        })
    }
    valid = () => {
        const { category, post = {} } = this.state
        const { author, body, title } = post        
        if (!title) return ValidResponse({info: 'Please input post title', focus: 'titleEl'})
        if (!category) return ValidResponse({info: 'Please select a category'})
        if (!author) return ValidResponse({info: 'Please input author', focus: 'authorEl'})
        if (!body) return ValidResponse({info: 'Please input post content', focus: 'bodyEl'})
        return ValidResponse()
    }
    formSubmitHandler = e => {
        e.preventDefault()
        let _valid = this.valid()
        if (_valid.result !== true) {
            message.error(_valid.info)
            this[_valid.focus] && this[_valid.focus].focus()
            return
        }
        const { author, body, title } = this.state.post
        const { onSubmitSuccess, data } = this.props
        const { category } = this.state
        const isEdit = !!(data && data.id)
        let postData, _submitFn, _successText, _type
        let _id
        if (isEdit) {
            postData = {
                title,
                body
            }
            _submitFn = editPost
            _successText = `you have modified post: ${title}`
            _id = data.id
            _type = 'edit'
        } else {
            postData = {
                id: uuidv4(),
                timestamp: Date.now(),
                title,
                author,
                body,
                category
            }
            _submitFn = newPost
            _successText = 'you have created a new post!'
            _type = 'add'
        }
        _submitFn(postData, _id).then(res => {
            if (!res.error) {
                message.success(_successText)
                this.resetData()
                onSubmitSuccess && onSubmitSuccess(res, _type)
            } else {
                message.error(res.error)
            }
        }).catch(_ => {
            message.error('Oops, network error please try again later.')
        })
    }
    onCategoryChange = category => {
        this.setState({category})
    }
    componentWillMount() {
        const { data } = this.props
        const isEdit = !!(data && data.id)
        if (isEdit) {
            this.mapPropsToData(data)
        } else {
            this.resetData()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data.id) {
            this.mapPropsToData(nextProps.data)
        } else {
            this.resetData()
        }
    }
    render() {
        const { author, title, body } = this.state.post
        const displayCategory = this.state.category
        const { data, categories } = this.props
        const { list } = categories
        const isEdit = !!(data && data.id)
        return (
            <Form onSubmit={this.formSubmitHandler}>
                <FormItem>
                    <Select
                        disabled={isEdit}
                        value={displayCategory}
                        style={{ width: 120 }} onChange={this.onCategoryChange}>
                        {
                            list.map(item => (
                                <Select.Option value={item.name} key={item.name}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>
                </FormItem>
                <FormItem>
                    <Input
                        placeholder="Enter your Title"
                        prefix={<Icon type="edit" />}
                        suffix={title ? <Icon type="close-circle" onClick={e => this.updateInput('title', '')} /> : null}
                        value={title}
                        onChange={e => this.updateInput('title', e.target.value)}
                        ref={node => this.titleEl = node} />
                </FormItem>
                <FormItem>
                    <Input
                        disabled={isEdit}
                        placeholder="Enter Author Name"
                        prefix={<Icon type="user" />}
                        suffix={(author && !isEdit) ? <Icon type="close-circle" onClick={e => this.updateInput('author', '')} /> : null}
                        value={author}
                        onChange={e => this.updateInput('author', e.target.value)}
                        ref={node => this.authorEl = node} />
                </FormItem>
                <FormItem>
                    <TextArea
                        maxLength="5000"
                        placeholder="Please text your post content here"
                        autosize={{ minRows: 2, maxRows: 8 }}
                        ref={node => this.bodyEl = node}
                        onChange={e => this.updateInput('body', e.target.value)}
                        value={body} />
                </FormItem>
                <FormItem style={{textAlign: 'right'}}>
                    <Button style={{marginRight: 15}} onClick={this.resetData}>Clear</Button>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        )
    }
}
export default connect(state => ({
    categories: state.categories
}))(PostEdit)

function ValidResponse(options) {
    if (options && options instanceof Object) {
        const { info, focus } = options
        return {
            result: false,
            info,
            focus
        }
    } else {
        return {
            result: true
        }
    }
}