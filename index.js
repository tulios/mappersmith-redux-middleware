let store = null

export const setStore = (reduxStore) => store = reduxStore

const typeFor = (phase, name, method) =>
  `mappersmith/${[phase, name, method].map((n) => n.toUpperCase()).join('_')}`

const requestPayload = (request) => ({
  params: request.params(),
  headers: request.headers(),
  body: request.body()
})

const responsePayload = (response) => ({
  status: response.status(),
  headers: response.headers(),
  data: response.data()
})

const createDispatch = ({ resourceName, resourceMethod, mockRequest = false }) => {
  if (!store) {
    throw new Error(
      '[MappersmithReduxMiddleware] no redux store configured'
    )
  }

  return (phase, requestOrResponse) => {
    if (mockRequest) {
      return
    }

    const payload = phase === 'request'
      ? requestPayload(requestOrResponse)
      : responsePayload(requestOrResponse)

    store.dispatch({
      type: typeFor(phase, resourceName, resourceMethod),
      payload
    })
  }
}

const MappersmithReduxMiddleware = (args) => {
  const dispatch = createDispatch(args)

  return {
    request(request) {
      dispatch('request', request)
      return request
    },

    response(next) {
      return new Promise((resolve, reject) => {
        next()
          .then((response) => {
            dispatch('response', response)
            resolve(response)
          })
          .catch((response) => {
            dispatch('failure', response)
            reject(response)
          })
      })
    }
  }
}

export default MappersmithReduxMiddleware
