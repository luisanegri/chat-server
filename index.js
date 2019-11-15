const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const See = require('json-sse');

app.use(jsonParser);
app.get('/', (req, res, next) => {
  res.send('hello');
});

const stream = new See();

app.get('/stream', (req, res, next) => {
  //serialize: turn into a string - normally used when needs to send something to the internet
  const string = JSON.stringify(messages);

  // send the data stored in string to the client
  stream.updateInit(string);

  // replaces the res.send - connect to the client
  stream.init(req, res);
});

const messages = [];

app.post('/message', (req, res, next) => {
  // get the message out of the body of the req
  const { message } = req.body;
  // push it to array messages
  messages.push(message);
  res.send(message);
});

app.get('/message', (req, res, next) => {
  res.send(messages);
});

app.listen(port, () => console.log(`listening on port ${port}`));
