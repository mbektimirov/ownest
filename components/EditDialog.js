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

const Transition = (props) => <Slide direction="up" {...props} />

const styles = {
  slide: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: -10,
    marginBottom: 15,
    flexDirection: 'column',
  },
}

const steps = [
  ['07:30', 27],
  ['10:00', 25.5],
  ['18:00', 28],
  ['19:00', 27],
  ['22:30', 25.5],
  ['03:00', 28],
]

class AlertDialogSlide extends React.Component {
  state = {
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

  render() {
    const { classes, open } = this.props
    const { activeStep } = this.state
    const maxSteps = steps.length

    return (
      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.props.onClose}
          fullWidth
        >
          <DialogContent>
            <SwipeableViews
              index={this.state.activeStep}
              onChangeIndex={this.handleStepChange}
              enableMouseEvents
              style={{ width: '100%', height: '100%' }}
            >
              {steps.map(([time, temp]) => (
                <div className={classes.slide}>
                  <TextField
                    type="time"
                    value={time}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                  <Knob
                    min={18}
                    max={35}
                    skin={s12}
                    preciseMode={false}
                    style={{ width: 220, height: 220, marginTop: 15 }}
                    defaultValue={temp}
                  />
                </div>
              ))}
            </SwipeableViews>
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
                  {steps[activeStep + 1] && steps[activeStep + 1][0]}
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
                  {steps[activeStep - 1] && steps[activeStep - 1][0]}
                </Button>
              }
            />
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(AlertDialogSlide)
