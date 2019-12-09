const express = require('express')
const bodyParser = require('body-parser')
const packageInfo = require('./package.json')

const app = express()
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.json({
    name: 'discordBot',
    version: '1.0.0',
    description: 'A discord bot',
    repository: 'https://github.com/nishad10/discordBot.git',
    author: 'Nishad Aherrao',
    license: 'GNU GPL'
  })
})
var server = app.listen(process.env.PORT, '0.0.0.0', () => {
  const host = server.address().address
  const port = server.address().port
  console.log('Web server started at http://%s:%s', host, port)
})

module.exports = bot => {
  app.post('/', (req, res) => {
    res.sendStatus(200)
  })
}
