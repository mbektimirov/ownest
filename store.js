import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer, { initialState } from './reducer'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()

const bindMiddleware = (middleware) => {
  // if (process.env.NODE_ENV !== 'production') {
  //   const { composeWithDevTools } = require('redux-devtools-extension')
  //   return composeWithDevTools(applyMiddleware(...middleware))
  // }
  return applyMiddleware(...middleware)
}

function configureStore(_initialState = initialState) {
  const store = createStore(
    rootReducer,
    _initialState,
    bindMiddleware([sagaMiddleware])
  )

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga)
  }

  store.runSagaTask()

  return store
}

export default configureStore
