import React from 'react'

// components
import Button from '@material-ui/core/Button'

class Index extends React.Component {
  render() {
    return (
      <div>
        <Button variant="contained" color="primary" href="/auth/nest">
          Login
        </Button>
      </div>
    )
  }
}

export default Index
