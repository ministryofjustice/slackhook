const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const slack = require('./slack');
const config = require('./config');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(require.resolve('./index.html'));
});

app.post('/kudu', (req, res) => {
  slack.postToSlack({
    channel: req.query.channel,

  })
  res.send({query: req.query, body: req.body});
});

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log('Server listening on %j', server.address());
});
