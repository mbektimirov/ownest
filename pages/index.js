import React from 'react'
// import { connect } from 'react-redux'

// libs
import Cookies from 'universal-cookie'
import Router from 'next/router'
import { withStyles } from '@material-ui/core/styles'
import cx from 'classnames'
import autobind from 'autobind-decorator'
import get from 'lodash/get'
import values from 'lodash/values'

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

const localApi = new Api('', { withCredentials: false })

const getTemp = (thermostat) =>
  thermostat.temperature_scale === 'F'
    ? thermostat.ambient_temperature_f
    : thermostat.ambient_temperature_c

const strToMinutes = (str = '') => {
  const [hours, mins] = str.split(':')

  return Number(hours) * 60 + Number(mins)
}

class Index extends React.Component {
  static getInitialProps = async ({ req, res }) => {
    const cookies = new Cookies()
    const token = req
      ? (req.cookies || {}).nest_token
      : cookies.get('nest_token')

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
    const nestResult = await api.get('/')
    const { thermostats } = nestResult.devices

    return {
      thermostats,
      // keep ordered thermostats list to always set first of the items as active
      thermostatsList: Object.values(thermostats || {}),
    }
  }

  state = {
    activeTh: get(this.props.thermostatsList, [0]),
    activeThId: get(this.props.thermostatsList, [0, 'device_id']),
    plan: {},
    newPlan: {},
    editDialogOpen: false,
  }

  weekDays(listId) {
    const { classes } = this.props
    const { plan, activeThId } = this.state
    const list = get(this.state.plan, [activeThId, listId])
    const { daysRepeat = [] } = list

    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((weekDay, i) => {
      const onClick = () => {
        if (daysRepeat && daysRepeat.indexOf(i) >= 0) {
          list.daysRepeat = daysRepeat.filter((day) => day !== i)
        } else {
          list.daysRepeat = [...daysRepeat, i]
        }

        this.updatePlan(plan)
      }

      return (
        <div
          className={cx(classes.weekDay, {
            [classes.weekDayActive]: daysRepeat.indexOf(i) >= 0,
          })}
          onClick={onClick}
        >
          {weekDay}
        </div>
      )
    })
  }

  updatePlan(plan) {
    this.setState({ plan })
    localApi.post('/plan', plan)
  }

  addPlan() {
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

  deletePlan(listId) {
    const { plan, activeThId } = this.state

    delete plan[activeThId][listId]

    this.updatePlan(plan)
  }

  @autobind
  addTime(thId, listId, time, temp) {
    const { plan } = this.state
    const times = get(plan, [thId, listId, 'times'], [])
    const id = guid()

    times.push({ id, time, temp })
    times.sort((t1, t2) => strToMinutes(t1.time) > strToMinutes(t2.time))

    this.updatePlan(plan)
  }

  addTimeToPlan(listId) {
    this.setState({ activeListId: listId, editDialogOpen: true })
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

  async componentDidMount() {
    const plan = await localApi.get('/plan')

    this.setState({ plan })
  }

  render() {
    console.log('STATE', this.state)
    console.log('THERMOSTATS', this.props)

    const { classes } = this.props
    const { activeThId, activeListId } = this.state

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
            onClick={() =>
              this.setState({ activeThId: th.device_id, activeTh: th })
            }
          />
        </div>
      )
    })

    const plans = this.state.plan[activeThId] || {}
    const times = get(plans, [activeListId, 'times'], [])

    return (
      <div className={classes.main}>
        <Grid container className={classes.list} justify="center" spacing={0}>
          {thermostats}
        </Grid>
        <div>
          {values(plans).map((plan) => (
            <Paper className={classes.listWrapper}>
              <div className={classes.planList}>
                {plan.times.map(({ time, temp }, i) => (
                  <Thermostat name={time} temp={temp} paper small key={i} />
                ))}
                <div className={classes.planActions}>
                  <Button
                    variant="fab"
                    mini
                    color="secondary"
                    aria-label="Add"
                    className={classes.addTimeRuleButton}
                    onClick={() => this.addTimeToPlan(plan.id)}
                  >
                    <AddIcon />
                  </Button>
                  <IconButton
                    className={classes.button}
                    onClick={() => this.deletePlan(plan.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              <div>
                <span className={classes.repeatTitle}>Repeat:</span>
                <div className={classes.weekDays}>{this.weekDays(plan.id)}</div>
              </div>
            </Paper>
          ))}
        </div>

        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          className={classes.addButton}
          onClick={() => this.addPlan()}
        >
          <AddIcon />
        </Button>

        <EditDialog
          open={this.state.editDialogOpen}
          onClose={this.closeDialog}
          onTimeAdd={({ time, temp }) => {
            this.addTime(activeThId, activeListId, time, temp)
          }}
          thermostat={this.state.activeTh}
          times={times}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Index)
