import nprogress from 'nprogress'

const stub = {
  start() {},
  done() {},
}

const progress = process.browser ? nprogress : stub

export default progress
