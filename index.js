const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const corsMiddleWare = cors();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const See = require('json-sse');

app.use(corsMiddleWare);
app.use(jsonParser);
app.get('/', (req, res, next) => {
  res.send('hello');
});

const stream = new See();

const streams = {};

app.get('/stream', (req, res, next) => {
  const rooms = Object.keys(messages);
  //serialize: turn into a string - normally used when needs to send something to the internet
  const string = JSON.stringify(rooms);

  // send the data stored in string to the client
  stream.updateInit(string);

  // replaces the res.send - connect to the client
  stream.init(req, res);
});

app.get('/rooms/:roomName', (req, res, next) => {
  const { roomName } = req.params;

  const { stream } = streams[roomName];

  const data = messages[roomName];
  //serialize: turn into a string - normally used when needs to send something to the internet
  const string = JSON.stringify(data);

  // send the data stored in string to the client
  stream.updateInit(string);

  // replaces the res.send - connect to the client
  stream.init(req, res);
});

// rather than repeating code
function send(data) {
  const string = JSON.stringify(data);
  stream.send(string);
}

// create a new room
app.post('/room', (req, res, next) => {
  const { name } = req.body;

  send(name);
  // add dynamic property to an object
  messages[name] = [];

  streams[name] = new See();

  res.send(name);
});

const messages = {};
// {
//   name: [hi, hello]
//   fun: ['we are here', 'yes']
// }

app.post('/message/:roomName', (req, res, next) => {
  // get the message out of the body of the req
  const { message } = req.body;
  const { roomName } = req.params;

  // one of those obj commented under messages object
  const room = messages[roomName];

  room.push(message);

  const stream = streams[roomName];

  const string = JSON.stringify(message);

  stream.send(string);

  res.send(message);
});

app.get('/message', (req, res, next) => {
  res.send(messages);
});

app.listen(port, () => console.log(`listening on port ${port}`));
