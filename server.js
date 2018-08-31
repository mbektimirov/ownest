const express = require('express')
const next = require('next')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const bodyParser = require('body-parser')
const NestStrategy = require('passport-nest').Strategy
const nestSecret = require('./nest-secret')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let savedPlan = {}

app.prepare().then(() => {
  const server = express()

  passport.use(
    new NestStrategy({
      clientID: nestSecret.NEST_ID,
      clientSecret: nestSecret.NEST_SECRET,
    })
  )

  /**
    No user data is available in the Nest OAuth
    service, just return the empty user object.
  */
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  /**
    No user data is available in the Nest OAuth
    service, just return the empty user object.
  */
  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  server.use(cookieParser('cookie_secret_shh')) // Change for production apps
  server.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )
  server.use(bodyParser.json())
  server.use(
    session({
      secret: 'session_secret_shh', // Change for production apps
      resave: true,
      saveUninitialized: false,
    })
  )
  server.use(passport.initialize())
  server.use(passport.session())

  /**
    Listen for calls and redirect the user to the Nest OAuth
    URL with the correct parameters.
  */
  server.get('/auth/nest', passport.authenticate('nest'))

  server.get(
    '/auth/nest/callback',
    passport.authenticate('nest', {}),
    (req, res) => {
      res.cookie('nest_token', req.user.accessToken)
      res.redirect('/')
    }
  )

  server.get('/plan', (req, res) => {
    res.send(savedPlan)
  })

  server.post('/plan', (req, res) => {
    savedPlan = req.body
    res.send('ok')
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`Auth server running at http://localhost:${port}`)
  })
})
