import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchCategoryList, updateTargetCategory } from '@/Actions/categories'
import { fetchPostsListByCategory, fetchPostsList, updateListOrder, updateTargetPost, updatePostById } from '@/Actions/posts'
import { Layout, Menu, Icon, Spin, Select, Affix, Modal } from 'antd'
import { PostCard, PostEdit, PostDetail } from '@/Components'
import FAPaperPlane from 'react-icons/lib/fa/paper-plane'
// import store from './store'
import './App.css'

const { Header, Sider, Content } = Layout

class App extends Component {
  state = {
    collapsed: false,
    showPostEditModal: false,
    showPostDetailModal: false
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  listOrder = {
    'voteScore': (a, b) => (b.voteScore - a.voteScore),
    'timestamp': (a, b) => (b.timestamp - a.timestamp)
  }

  handleCategoryChange = ({item, key, selectedKeys}) => {
    const { updateContentLst, updateTargetCategory, fetchAllContentLst } = this.props
    updateTargetCategory(selectedKeys[0])
    selectedKeys[0] === 'all' ? fetchAllContentLst() : updateContentLst(selectedKeys[0])
  }

  handleNewPostClick = () => {
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
    this.setState({showPostDetailModal: true})
  }

  postEditmodalCancelHandler = (e) => {
    this.setState({showPostEditModal: false})
  }
  postDetailmodalCancelHandler = (e) => {
    const { updateTargetPost } = this.props    
    this.setState({showPostDetailModal: false})
    setTimeout(() => {
      updateTargetPost({})
    }, 300)
  }
  componentWillMount () {
    const { updateNavLst, fetchAllContentLst } = this.props
    updateNavLst()
    fetchAllContentLst()
  }
  render() {
    const { categories, posts } = this.props
    const { updatePostLstOrder } = this.props
    const { showPostEditModal, showPostDetailModal } = this.state
    const categoryList = categories.list
    const { targetCategory } = categories

    const postList = posts.list
    const { postLoading, orderBy, targetPost } = posts
    return (
        <div className="App">
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
                  <Icon type="book" />
                  <span>Show All</span>
                </Menu.Item>
                {
                  categoryList.map(item => (
                    <Menu.Item key={item.name}>
                      <Icon type="book" />
                      <span>{item.name}</span>
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
                  {
                    postList.filter(item => !item.deleted).sort(this.listOrder[orderBy]).map(item => (
                      <PostCard data={item}
                        onCardOpen={this.postDetailHandler} key={item.id} />
                    ))
                  }
                  <Affix offsetTop={60} 
                    target={() => {return document.getElementById('content_box')}}
                    onClick={this.handleNewPostClick}
                    style={{position:'absolute', top: 15, right: -5, textAlign: 'center', width: 60, height: 60, cursor: 'pointer'}}>
                    <FAPaperPlane className="main_action_btn" /><br/>
                    New Post!
                  </Affix>
                </Spin>
              </Content>
            </Layout>
          </Layout>
          <Modal
            zIndex={1}
            visible={showPostDetailModal}
            title={targetPost.title}
            maskClosable={true}
            footer={null}
            onCancel={this.postDetailmodalCancelHandler}
            style={{width: 800, top: '5vh' }}>
            <PostDetail
              category={targetCategory}
              data={targetPost} 
              onCardOpen={e => this.setState({showPostEditModal: true})}/>
          </Modal>
          <Modal
            zIndex={3}
            visible={showPostEditModal}
            title={targetPost.id ? 'Edit Post' : 'New Post'}
            maskClosable={true}
            footer={null}
            onCancel={this.postEditmodalCancelHandler}>
            <PostEdit
              category={targetCategory}
              data={targetPost}
              onSubmitSuccess={this.postEditSuccessCallback} />
          </Modal>
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
