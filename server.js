const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users.js')
const profile = require('./routes/api/profile.js')
const posts = require('./routes/api/posts.js')

const app = express()

// bodyParser middleware to use it - will allow you to access req.body.attribute when establishing routes
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//DB config
const db = require('./config/keys.js').mongoURI

//connect to mongoDB through mongoose
mongoose.connect(db)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err))

// app.get('/', (req, res) => res.send('hello world!'))

// passport middleware
app.use(passport.initialize())
//everything that is done in passport is done in a 'strategy' i.e. here it will be a JWT strategy defined in a config file
// passport config:
require('./config/passport')(passport)
// requiring the file where strategy is defined and passing in passport itself to that file

//use routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`server running on port ${port}`))
