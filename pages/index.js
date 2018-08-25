import React from 'react'
import { connect } from 'react-redux'

// libs
import Cookies from 'universal-cookie'
import Router from 'next/router'

// components

class Index extends React.Component {
  static getInitialProps = ({ req, res }) => {
    const cookies = new Cookies()
    const token = req ? req.cookies.nest_token : cookies.get('nest_token')

    // console.log('TOKEN', token)

    if (!token) {
      if (res) {
        res.writeHead(303, { Location: '/login' })
        res.end()
      } else {
        Router.push('/login')
      }
    }

    return {}
  }

  render() {
    return <div>Index</div>
  }
}

export default connect()(Index)
