import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { fetchCategoryList, updateTargetCategory } from '@/Actions/categories'
import { fetchPostsListByCategory, fetchPostsList, updateListOrder, updateTargetPost, updatePostById } from '@/Actions/posts'
import { Layout, Menu, Icon, Spin, Select, Affix, Modal } from 'antd'
import { PostCard, PostEdit } from '@/Components'
import { CommentList, PostDetailModal } from '@/RouteContainers'

import FAPaperPlane from 'react-icons/lib/fa/paper-plane'
// import store from './store'
import './App.css'

const { Header, Sider, Content } = Layout

class App extends Component {
  state = {
    collapsed: false,
    showPostEditModal: false
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  handleCategoryChange = ({item, key, selectedKeys}) => {
    const { updateTargetCategory } = this.props
    updateTargetCategory(selectedKeys[0])
    // selectedKeys[0] === 'all' ? fetchAllContentLst() : updateContentLst(selectedKeys[0])
  }

  handleNewPostClick = () => {
    const { updateTargetPost } = this.props
    updateTargetPost({})    
    this.setState({showPostEditModal: true})
  }
  postEditSuccessCallback = (res, type) => {
    const { updateContentLst, fetchAllContentLst, categories, updateTargetPost, updatePostById } = this.props    
    const { targetCategory } = categories
    if (type === 'add') {
      if (targetCategory) {
        updateContentLst(targetCategory)
      } else {
        fetchAllContentLst()
      }
      setTimeout(() => {
        updateTargetPost({})
      }, 300)
    } else {
      updatePostById(res)
      updateTargetPost(res)
    }
    this.setState({showPostEditModal: false})
  }
  postDetailHandler = (post) => {
    const { updateTargetPost } = this.props
    updateTargetPost(post)
  }

  postEditmodalCancelHandler = (e) => {
    this.setState({showPostEditModal: false})
  }
  postDetailmodalCancelHandler = (e) => {
    const { updateTargetPost } = this.props    
    setTimeout(() => {
      updateTargetPost({})
    }, 300)
  }
  componentWillMount () {
    const { updateNavLst } = this.props
    updateNavLst()
  }
  render() {
    const { categories, posts } = this.props
    const { updatePostLstOrder, updateTargetPost } = this.props
    const { showPostEditModal } = this.state
    const categoryList = categories.list

    const postList = posts.list
    const { postLoading, orderBy, targetPost } = posts
    return (
        <div className="App">
          <Router>
            <Layout id="app-layout">
              <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline"
                  defaultSelectedKeys={['all']}
                  onSelect={this.handleCategoryChange}>
                  <Menu.Item key="all">
                    <Link to="/">
                      <Icon type="book" />
                      <span>Show All</span>
                    </Link>
                  </Menu.Item>
                  {
                    categoryList.map(item => (
                      <Menu.Item key={item.name}>
                        <Link to={`/${item.path}`}>
                          <Icon type="book" />
                          <span>{item.name}</span>
                        </Link>
                      </Menu.Item>
                    ))
                  }
                </Menu>
              </Sider>
              <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                  <Select defaultValue="voteScore" style={{ width: 120 }} onChange={updatePostLstOrder}>
                    <Select.Option value="voteScore">Top Rated</Select.Option>
                    <Select.Option value="timestamp">Newest</Select.Option>
                  </Select>
                </Header>
                <Content id="content_box" style={{ margin: '24px 16px', padding: 24, background: '#fff', height: 'calc(100vh - 112px)', position: 'relative', overflow: 'scroll' }}>
                  <Spin spinning={postLoading}>
                    <Route path="/" render={({ match, history }) => {
                      const { category } = match.params
                      const goDetailHandler = ({category, post}) => {
                        history.push(`/${category}/${post.id}`)
                      }
                      return (
                        <div>
                          <Route path="/" exact>
                            <div>
                              <CommentList dataList={postList}
                                orderBy={orderBy}
                                category={category}
                                childrenItem={PostCard}
                                onDetailOpen={goDetailHandler}
                                onPostEdit={post => {
                                  updateTargetPost(post)
                                  this.setState({showPostEditModal: true})
                                }} />
                            </div>
                          </Route>
                          <Route path="/:category">
                            <div>
                              <CommentList dataList={postList}
                                orderBy={orderBy}
                                category={category}
                                childrenItem={PostCard}
                                onDetailOpen={goDetailHandler}
                                onPostEdit={post => {
                                  updateTargetPost(post)
                                  this.setState({showPostEditModal: true})
                                }} />
                            </div>
                          </Route>
                          <Route path="/:category/:post_id" render={() => (
                            <PostDetailModal
                              onPostEdit={e => this.setState({showPostEditModal: true})} 
                              onPostEditSuccess={this.postEditSuccessCallback}/>
                          )} />
                          <Affix offsetTop={60} 
                            target={() => {return document.getElementById('content_box')}}
                            onClick={this.handleNewPostClick}
                            style={{position:'absolute', top: 15, right: -5, textAlign: 'center', width: 60, height: 60, cursor: 'pointer'}}>
                            <FAPaperPlane className="main_action_btn" /><br/>
                            New Post!
                          </Affix>
                          <Modal
                            zIndex={3}
                            visible={showPostEditModal}
                            title={targetPost.id ? 'Edit Post' : 'New Post'}
                            maskClosable={true}
                            footer={null}
                            onCancel={this.postEditmodalCancelHandler}>
                            <PostEdit
                              category={category}
                              data={targetPost}
                              onSubmitSuccess={this.postEditSuccessCallback} />
                          </Modal>
                        </div>
                      )
                    }} />
                  </Spin>
                </Content>
              </Layout>
            </Layout>
          </Router>
        </div>
    )
  }
}

export default connect(state => state,
dispatch => bindActionCreators({
  updateNavLst: fetchCategoryList,
  updateContentLst: fetchPostsListByCategory,
  fetchAllContentLst: fetchPostsList,
  updatePostLstOrder: updateListOrder,
  updateTargetCategory,
  updateTargetPost,
  updatePostById
}, dispatch))(App)
