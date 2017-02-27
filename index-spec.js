import 'babel-polyfill'
import forge from 'mappersmith'
import { install, uninstall, mockClient } from 'mappersmith/test'
import 'redux'
import configureMockStore from 'redux-mock-store'

import MappersmithRedux, { setStore } from './index'

const client = forge({
  middlewares: [MappersmithRedux],
  resources: {
    Blog: {
      post: { method: 'post', path: '/create'}
    }
  }
})

const mockStore = configureMockStore()

describe('MappersmithReduxMiddleware', () => {
  let store
  beforeEach(() => {
    install()
    store = setStore(mockStore({}))
  })

  afterEach(() => {
    uninstall()
  })

  it('dispatches the request event', (done) => {
    mockClient(client)
      .resource('Blog')
      .method('post')
      .with({ title: 'my title', body: { text: 'lorem' } })

    const requestParams = {
      title: 'my title',
      headers: { 'x-header': 'value' },
      body: { text: 'lorem' }
    }

    client.Blog.post(requestParams)
      .then((response) => {
        const actions = store.getActions()
        expect(actions[0]).toEqual({
          type: 'mappersmith/REQUEST_BLOG_POST',
          payload: {
            params: { title: 'my title' },
            headers: { 'x-header': 'value' },
            body: { text: 'lorem' }
          }
        })
        done()
      })
      .catch(done.fail)
  })

  describe('when it succeeds', () => {
    it('dispatches the response event', (done) => {
      mockClient(client)
        .resource('Blog')
        .method('post')
        .response({ id: 1 })

      client.Blog.post()
        .then((response) => {
          const actions = store.getActions()
          expect(actions[0]).toEqual(jasmine.objectContaining({ type: 'mappersmith/REQUEST_BLOG_POST' }))
          expect(actions[1]).toEqual({
            type: 'mappersmith/RESPONSE_BLOG_POST',
            payload: {
              status: 200,
              headers: { 'content-type': 'application/json' },
              data: { id: 1 }
            }
          })
          done()
        })
        .catch(done.fail)
    })
  })

  describe('when it fails', () => {
    it('dispatches the failure event', (done) => {
      mockClient(client)
        .resource('Blog')
        .method('post')
        .status(503)
        .response({ error: 'boom' })

      client.Blog.post()
        .then((response) => {
          done.fail('this should fail')
        })
        .catch((response) => {
          const actions = store.getActions()
          expect(actions[0]).toEqual(jasmine.objectContaining({ type: 'mappersmith/REQUEST_BLOG_POST' }))
          expect(actions[1]).toEqual({
            type: 'mappersmith/FAILURE_BLOG_POST',
            payload: {
              status: 503,
              headers: { 'content-type': 'application/json' },
              data: { error: 'boom' }
            }
          })
          done()
        })
    })
  })
})
