import superagent from 'superagent'
import nprogress from './nprogress'

function request(_method, uri, data, options = {}) {
  const method = _method.toLowerCase()
  const headers = {
    // credentials: 'same-origin',
    ...options.headers,
  }

  let requestPromise = superagent[method](uri).set(headers)

  if (options.withCredentials) {
    requestPromise = requestPromise.withCredentials()
  }

  if (!options.silent) {
    nprogress.start()
  }

  if (data) {
    if (method === 'get') {
      requestPromise.query(data)
    } else {
      requestPromise.send(data)
    }
  }

  return requestPromise.then(
    (response) => {
      nprogress.done()
      return response.body || response
    },
    (err) => {
      nprogress.done()
      throw err
    }
  )
}

class Api {
  constructor(baseUrl, { token, withCredentials = true } = {}) {
    this.baseUrl = baseUrl
    this.token = token
    this.withCredentials = withCredentials
  }

  request(method, uri, data, options) {
    if (this.token) {
      options = {
        ...options,
        headers: {
          // "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.token}`,
        },
      }
    }

    return request(method, `${this.baseUrl}${uri}`, data, {
      ...options,
      withCredentials: this.withCredentials,
    })
  }

  setToken(token) {
    this.token = token
  }

  get(...args) {
    return this.request('get', ...args)
  }

  post(...args) {
    return this.request('post', ...args)
  }

  put(...args) {
    return this.request('put', ...args)
  }

  patch(...args) {
    return this.request('patch', ...args)
  }

  delete(...args) {
    return this.request('delete', ...args)
  }

  url(relative) {
    return `${this.baseUrl}${relative}`
  }
}

export default Api
