import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Icon, message } from 'antd'
import uuidv4 from 'uuid/v4'
import { editComment, newComment } from '@/Services/API'

const FormItem = Form.Item
const { TextArea } = Input

export default class CommentEdit extends Component {
    static propTypes = {
        parentId: PropTypes.string,
        onSubmitSuccess: PropTypes.func,
        data: PropTypes.object
    }
    state = {
        comment: {
            author: '',
            body: ''
        }
    }
    mapPropsToData = (data) => {
        const {author, body} = data
        this.setState({
            comment: {
                author: author,
                body
            }
        })
    }
    updateInput = (name, val) => {
        this.setState(prev => ({
            comment: {
                ...prev.comment,
                [name]: val
            }
        }))
    }
    resetData = () => {
        const { comment } = this.state
        this.setState({
            comment: Object.keys(comment).reduce((data, key) => ({
                ...data,
                [key]: ''
            }), {})
        })
    }
    formSubmitHandler = e => {
        e.preventDefault()
        const { author, body } = this.state.comment
        const { parentId, onSubmitSuccess, data } = this.props
        let postData, _submitFn, _successText, _type
        let _id
        if (data && data.id) {
            postData = {
                timestamp: Date.now(),
                body
            }
            _submitFn = editComment
            _successText = `you have successfully modified comment`
            _id = data.id
            _type = 'edit'
        } else {
            postData = {
                id: uuidv4(),
                timestamp: Date.now(),
                author,
                body,
                parentId
            }
            _submitFn = newComment
            _successText = 'you have created a new comment!'
            _type = 'add'
        }
        _submitFn(postData, _id).then(res => {
            if (!res.error) {
                console.warn(postData)
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
    componentWillMount() {
        const { data } = this.props
        if (data && data.id) {
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
        let { author, body } = this.state.comment
        let { data } = this.props        
        return (
            <Form onSubmit={this.formSubmitHandler}>
                <FormItem style={{marginBottom: 10}}>
                    <Input
                        disabled={!!(data && data.id)}
                        placeholder="Enter Author Name"
                        prefix={<Icon type="user" />}
                        suffix={(author && !(data && data.id)) ? <Icon type="close-circle" onClick={e => this.updateInput('author', '')} /> : null}
                        value={author}
                        onChange={e => this.updateInput('author', e.target.value)}
                        ref={node => this.authorEl = node} />
                </FormItem>
                <FormItem style={{marginBottom: 10}}>
                <TextArea
                    maxLength="5000"
                    placeholder="Please text your comment here"
                    autosize={{ minRows: 2, maxRows: 8 }}
                    onChange={e => this.updateInput('body', e.target.value)}
                    value={body} />
                </FormItem>
                <FormItem style={{textAlign: 'right', marginBottom: 10}}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        )
    }
}
