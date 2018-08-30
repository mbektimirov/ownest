import React from 'react'
// import { connect } from 'react-redux'

// libs
import Cookies from 'universal-cookie'
import Router from 'next/router'
import { withStyles } from '@material-ui/core/styles'
import cx from 'classnames'
import autobind from 'autobind-decorator'
import get from 'lodash/get'
import set from 'lodash/set'
import values from 'lodash/values'
import omitBy from 'lodash/omitBy'

// material
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

// icons
import AddIcon from '@material-ui/icons/Add'

// components
import Thermostat from '../components/Thermostat'
import EditDialog from '../components/EditDialog'

// styles
import 'nprogress/nprogress.css'

import Api from '../src/api'
import guid from '../src/guid'

const styles = (theme) => ({
  main: {
    fontFamily: 'Roboto',
    '-webkit-overflow-scrolling': 'touch',
    maxWidth: 800,
    margin: '0 auto',
  },
  list: {
    padding: 10,
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
  },
  item: {
    marginRight: 7,
  },
  addButton: {
    position: 'absolute',
    top: 'calc(100% - 75px)',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  listWrapper: {
    position: 'relative',
    margin: '12px',
    padding: '0 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  planList: {
    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '86%',
    overflowX: 'auto',
  },
  planActions: {
    position: 'absolute',
    left: 'calc(100% - 52px)',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  addTimeRuleButton: {},
  weekDays: {
    display: 'flex',
    flexDirection: 'row',
    color: 'white',
    marginTop: 8,
    marginBottom: 10,
  },
  weekDay: {
    width: 30,
    height: 30,
    color: 'white',
    borderRadius: '100%',
    padding: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    fontWeight: 500,
  },
  weekDayActive: {
    background: 'white',
    color: 'black',
  },
  repeatTitle: {
    color: 'white',
    fontSize: 12,
  },
})

const getTemp = (thermostat) =>
  thermostat.temperature_scale === 'F'
    ? thermostat.ambient_temperature_f
    : thermostat.ambient_temperature_c

class Index extends React.Component {
  static getInitialProps = async ({ req, res }) => {
    const cookies = new Cookies()
    const token = req ? req.cookies.nest_token : cookies.get('nest_token')

    if (!token) {
      if (res) {
        res.writeHead(303, { Location: '/login' })
        res.end()
      } else {
        Router.push('/login')
      }

      return {}
    }

    const api = new Api('https://developer-api.nest.com', { token })
    const rootResult = await api.get('/')
    const { thermostats } = rootResult.devices

    return {
      api,
      thermostats,
      // keep ordered thermostats list to always set first of the items as active
      thermostatsList: Object.values(thermostats || {}),
    }
  }

  state = {
    activeThId: get(this.props.thermostatsList, [0, 'device_id']),
    plan: {},
    newPlan: {},
    editDialogOpen: false,
  }

  get thPlan() {}

  get weekDays() {
    const { classes } = this.props

    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((weekDay) => (
      <div className={cx(classes.weekDay /*classes.weekDayActive*/)}>
        {weekDay}
      </div>
    ))
  }

  addPlanList() {
    const { activeThId, plan } = this.state
    const thLists = plan[activeThId] || {}
    const id = guid()

    thLists[id] = {
      id,
      times: [],
    }

    this.setState({
      editDialogOpen: true,
      activeListId: id,
      plan: { ...plan, [activeThId]: thLists },
    })
  }

  @autobind
  addTime(thId, listId, time, temp) {
    const { plan } = this.state

    set(plan, [thId, listId, 'times'], { time, temp })
    this.setState({ plan })
  }

  @autobind
  closeDialog() {
    const { plan, activeThId, activeListId } = this.state
    const list = get(plan, [activeThId, activeListId])

    // drop the list if no times were added
    if (list.times.length === 0) {
      delete plan[activeThId][activeListId]
    }

    this.setState({ editDialogOpen: false, plan })
  }

  render() {
    console.log('THERMOSTATS', this.props)

    const { classes } = this.props
    const { activeThId } = this.state

    const thermostats = Object.values(this.props.thermostats).map((th) => {
      const name = th.where_name
      const temp = getTemp(th)

      return (
        <div className={classes.item} key={th.device_id}>
          <Thermostat
            name={name}
            temp={temp}
            leaf
            active={this.state.activeThId === th.device_id}
            onClick={() => this.setState({ activeThId: th.device_id })}
          />
        </div>
      )
    })

    const plans = values(this.state.plan[activeThId] || {})

    return (
      <div className={classes.main}>
        <Grid container className={classes.list} justify="center" spacing={0}>
          {thermostats}
        </Grid>
        <div>
          {plans.map((plan) => (
            <Paper className={classes.listWrapper}>
              <div className={classes.planList}>
                {plan.times.map(({ name, temp }) => (
                  <Thermostat name={name} temp={temp} paper small />
                ))}
                <div className={classes.planActions}>
                  <Button
                    variant="fab"
                    mini
                    color="secondary"
                    aria-label="Add"
                    className={classes.addTimeRuleButton}
                  >
                    <AddIcon />
                  </Button>
                  <IconButton className={classes.button} aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              <div>
                <span className={classes.repeatTitle}>Repeat:</span>
                <div className={classes.weekDays}>{this.weekDays}</div>
              </div>
            </Paper>
          ))}
        </div>

        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          className={classes.addButton}
          onClick={() => this.addPlanList()}
        >
          <AddIcon />
        </Button>
        <EditDialog
          open={this.state.editDialogOpen}
          onClose={this.closeDialog}
          onTimeAdd={this.addTime}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Index)
