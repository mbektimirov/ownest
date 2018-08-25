/* global fetch */

import { delay } from 'redux-saga'
import { all, call, put, take, takeLatest } from 'redux-saga/effects'

function* rootSaga() {
  yield all([])
}

export default rootSaga
