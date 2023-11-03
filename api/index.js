const express = require('express')
const cors = require('cors');

const users_routes = require('./routes/Users/users.routes')
const matches_routes = require('./routes/Matches/matches.routes')

const app = express()
app.use(cors());

app.use(express.json())
app.use('/api/users', users_routes)
app.use('/api/matches', matches_routes)

app.listen(3000)
console.log('Server on port', 3000)