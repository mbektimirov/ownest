import React from 'react'

// material
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontFamily: 'Roboto',
    color: '#cecece',
    marginTop: 60,
  },
  logo: {
    background: '#444444',
    width: 200,
    height: 200,
    borderRadius: '100%',
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: 34,
    color: '#9bce4f',
  },
}

class Index extends React.Component {
  render() {
    console.log(Paper)

    const { classes } = this.props

    return (
      <div className={classes.main}>
        <Paper className={classes.logo}>Ownest</Paper>
        <h2>Your own thermostat planner</h2>

        <Button variant="contained" color="primary" href="/auth/nest">
          Login
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(Index)
