import React from 'react'

// material
import Paper from '@material-ui/core/Paper'

// libs
import { withStyles } from '@material-ui/core/styles'
import cx from 'classnames'

const thermostat = {
  width: 86,
  height: 86,
  borderRadius: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  fontWeight: 500,
  fontSize: 20,
  position: 'relative',
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  classic: {
    ...thermostat,
    background: 'url(/static/th-background.png)',
    backgroundSize: 'contain',
  },
  paper: {
    ...thermostat,
    width: 80,
    height: 80,
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  small: {
    width: 60,
    height: 60,
    fontSize: 16,
  },
  leaf: {
    width: 10,
    height: 10,
    background: 'url(/static/leaf.svg) no-repeat',
    backgroundSize: 'contain',
    position: 'absolute',
    top: '76%',
  },
  name: {
    color: '#cecece',
    fontSize: 12,
  },
}

const Thermostat = ({ temp, name, leaf, paper, small, classes }) => {
  const Component = paper ? Paper : 'div'

  return (
    <div className={classes.wrapper}>
      <Component
        className={cx(paper ? classes.paper : classes.classic, {
          [classes.small]: small,
        })}
      >
        <div>{temp}</div>
        {leaf && <div className={classes.leaf} />}
      </Component>
      <div className={classes.name}>{name}</div>
    </div>
  )
}

export default withStyles(styles)(Thermostat)