[![Build Status](https://travis-ci.org/tulios/mappersmith-redux-middleware.svg?branch=master)](https://travis-ci.org/tulios/mappersmith-redux-middleware)
# Mappersmith Redux Middleware

__MappersmithReduxMiddleware__ is a middleware for [mappersmith](https://github.com/tulios/mappersmith) which dispatches your request lifecycle to a redux store

## Installation

#### NPM

```sh
npm install mappersmith-redux-middleware --save
# yarn add mappersmith-redux-middleware
```

#### Browser

Download the tag/latest version from the dist folder.

## Usage

Configure the middleware with your redux store and add it to your manifest, like:

```javascript
import forge from 'mappersmith'
import ReduxMiddleware, { setStore } from 'mappersmith-redux-middleware'

import store from 'my-store'
setStore(store)

const client = forge({
  middlewares: [ReduxMiddleware],
  resources: {
    User: {
      all: { path: '/users' },
      byId: { path: '/users/{id}' }
    }
  }
})
```

The events will follow the pattern:

```javascript
{
  type: 'mappersmith/<phase>/<resource-name>/<resource-method>',
  payload: { /* */ }
}
```

where `phase` can be: `request`, `response` or `failure`. Examples:

```javascript
client.User.all({ admin: 'true' })

// request event
// {
//   type: 'mappersmith/request/User/all',
//   payload: {
//     params: { admin: true },
//     headers: {},
//     body: null
//   }
// }
//
// response event
// {
//   type: 'mappersmith/response/User/all',
//   payload: {
//     status: 200,
//     headers: { 'content-type': 'application/json' },
//     data: [
//       { id: 1, name: 'John Doe' },
//       /* ... */
//     ]
//   }
// }
```

In case of failure:

```javascript
client.User.all({ admin: 'true' })

// request event
// {
//   type: 'mappersmith/request/User/all',
//   payload: {
//     params: { admin: true },
//     headers: {},
//     body: null
//   }
// }
//
// response event
// {
//   type: 'mappersmith/failure/User/all',
//   payload: {
//     status: 503,
//     headers: { 'content-type': 'application/json' },
//     data: {
//       error: 'Critical error!'
//     }
//   }
// }
```

### Running all tests

```sh
yarn test
```

## Compile and release

```sh
NODE_ENV=production yarn build
```

## License

See [LICENSE](https://github.com/tulios/mappersmith-redux-middleware/blob/master/LICENSE) for more details.
