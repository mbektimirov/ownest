import React from 'react'

// material
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Slide from '@material-ui/core/Slide'
import MobileStepper from '@material-ui/core/MobileStepper'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import SwipeableViews from 'react-swipeable-views'
import TextField from '@material-ui/core/TextField'

// libs
import { withStyles } from '@material-ui/core/styles'
import { Knob } from 'react-rotary-knob'
import s12 from './knob-s12'
import cx from 'classnames'

const Transition = (props) => <Slide direction="up" {...props} />

const styles = {
  dialog: {
    fontFamily: 'Roboto',
    color: 'white',
    textAlign: 'center',
  },
  title: {
    color: '#cecece',
    // fontSize: 12,
    marginBottom: 10,
  },
  slide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: -10,
    marginBottom: 6,
    flexDirection: 'column',
  },
  slideNew: {
    background: '#3f51b552',
    borderRadius: 4,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
}

class AlertDialogSlide extends React.Component {
  state = {
    newTime: '',
    newTemp: 18,
    activeStep: 0,
  }

  handleNext = () => {
    this.setState((prevState) => ({
      activeStep: prevState.activeStep + 1,
    }))
  }

  handleBack = () => {
    this.setState((prevState) => ({
      activeStep: prevState.activeStep - 1,
    }))
  }

  handleStepChange = (activeStep) => {
    this.setState({ activeStep })
  }

  renderInputs({ id, time, temp, onTimeChange, onTempChange }) {
    const { classes } = this.props

    return (
      <div
        className={cx(classes.slide, { [classes.slideNew]: !id })}
        key={`${id || 'new'}-time`}
      >
        <TextField
          type="time"
          value={time}
          inputProps={{
            step: 300, // 5 min
          }}
          onChange={onTimeChange}
        />
        <Knob
          min={18}
          max={35}
          skin={s12}
          preciseMode={false}
          style={{ width: 220, height: 220, marginTop: 15 }}
          defaultValue={temp}
          onChange={onTempChange}
        />
      </div>
    )
  }

  save() {
    this.props.onTimeAdd({ time: this.state.newTime, temp: this.state.newTemp })
    this.setState({ newTemp: 18, newTime: '' }) // reset to defaults
    this.setState({ activeStep: this.props.times.length })
  }

  saveAndClose() {
    this.save()
    this.props.onClose()
  }

  render() {
    const { classes, open, thermostat, times } = this.props
    const { activeStep, newTime, newTemp } = this.state
    const timesSlides = times.map(({ id, time, temp }) =>
      this.renderInputs({ id, time, temp })
    )

    timesSlides.push(
      this.renderInputs({
        time: newTime,
        temp: newTemp,
        onTimeChange: (e) => this.setState({ newTime: e.target.value }),
        onTempChange: (temp) => this.setState({ newTemp: Math.round(temp) }),
      })
    )

    const maxSteps = timesSlides.length

    console.log('DIALOG STATE', this.state)

    return (
      <Dialog
        className={classes.dialog}
        open={open}
        TransitionComponent={Transition}
        onClose={this.props.onClose}
        onEntered={() => this.setState({ activeStep: times.length })}
        fullWidth
      >
        <DialogContent>
          <div className={classes.title}>{thermostat.name}</div>
          <SwipeableViews
            index={this.state.activeStep}
            onChangeIndex={this.handleStepChange}
            enableMouseEvents
            style={{ width: '100%', height: '100%' }}
          >
            {timesSlides}
          </SwipeableViews>

          {maxSteps > 0 && (
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button
                  size="small"
                  onClick={this.handleNext}
                  disabled={activeStep === maxSteps - 1}
                >
                  {times[activeStep + 1] && times[activeStep + 1].time}
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={this.handleBack}
                  disabled={activeStep === 0}
                >
                  <KeyboardArrowLeft />
                  {times[activeStep - 1] && times[activeStep - 1].time}
                </Button>
              }
            />
          )}

          <div className={classes.actions}>
            <Button
              size="small"
              onClick={() => {
                this.saveAndClose()
              }}
            >
              Save
            </Button>
            <Button size="small">Close</Button>
            <Button
              size="small"
              onClick={() => {
                this.save()
              }}
            >
              Add more
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

export default withStyles(styles)(AlertDialogSlide)
