import React from 'react'
// import { connect } from 'react-redux'

// libs
import Cookies from 'universal-cookie'
import Router from 'next/router'
import { withStyles } from '@material-ui/core/styles'

// material
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'

// icons
import AddIcon from '@material-ui/icons/Add'

// components
import Thermostat from '../components/Thermostat'

const styles = (theme) => ({
  main: {
    fontFamily: 'Roboto',
  },
  list: {
    padding: 10,
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    // display: 'block',
  },
  item: {
    display: 'inline-block',
  },
  addButton: {
    position: 'absolute',
    top: 'calc(100% - 75px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  listWrapper: {
    position: 'relative',
    paddingLeft: 10,
  },
  planList: {
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '86%',
    overflowX: 'auto',
  },
  addTimeRuleButton: {
    position: 'absolute',
    left: 'calc(100% - 50px)',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  paper: {
    width: 60,
    height: 60,
    borderRadius: '100%',
    marginRight: 10,
  },
})

class Index extends React.Component {
  static getInitialProps = ({ req, res }) => {
    const cookies = new Cookies()
    const token = req ? req.cookies.nest_token : cookies.get('nest_token')

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
    const { classes } = this.props
    const thermostats = [
      ['Basement', 23.5],
      ['Bath', 28],
      ['Main room', 25],
    ].map(([name, temp]) => (
      <Grid key={name} item className={classes.item}>
        <Thermostat name={name} temp={temp} leaf />
      </Grid>
    ))

    const thermostatsPlanned = [
      ['7:30', 27],
      ['10:00', 25.5],
      ['18:00', 28],
      ['7:30', 27],
      ['10:00', 25.5],
      ['18:00', 28],
    ].map(([name, temp]) => (
      <div style={{ marginTop: 5 }}>
        <Thermostat name={name} temp={temp} paper small />
      </div>
    ))

    return (
      <div className={classes.main}>
        <Grid container className={classes.list} justify="center" spacing={0}>
          {thermostats}
        </Grid>
        <Divider />

        <div>
          {[0, 1, 2].map(() => (
            <div className={classes.listWrapper}>
              <div className={classes.planList}>{thermostatsPlanned}</div>
              <Button
                variant="fab"
                mini
                color="secondary"
                aria-label="Add"
                className={classes.addTimeRuleButton}
              >
                <AddIcon />
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          className={classes.addButton}
        >
          <AddIcon />
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(Index)
