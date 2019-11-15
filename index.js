const express = require('express');
const bodyParser = require('body-parser');
const Sse = require('json-sse');
const cors = require('cors');

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware);

const jsonParser = bodyParser.json();
app.use(jsonParser);

const port = 4000;

app.get('/', (request, response, next) => {
  response.send('hello world');
});

const stream = new Sse();

const streams = {};

app.get('/stream', (request, response, next) => {
  // const messages = { a: 1, b: 2 }
  const rooms = Object.keys(messages);
  // rooms === ['a', 'b']

  const string = JSON.stringify(rooms);

  stream.updateInit(string);

  stream.init(request, response);
});

app.get('/streams/:roomName', (request, response, next) => {
  const { roomName } = request.params;
  // roomName === 'fun'

  const stream = streams[roomName];

  // const messages = {
  //   fun: ['I'm having fun', 'me too']
  // }
  const data = messages[roomName];
  // data === ['I'm having fun', 'me too']

  const string = JSON.stringify(data);

  stream.updateInit(string);

  stream.init(request, response);
});

function send(data) {
  const string = JSON.stringify(data);

  stream.send(string);
}

app.post('/room', (request, response, next) => {
  const { name } = request.body;

  send(name);

  messages[name] = [];
  // messages.room = []
  // messags.fun = []

  streams[name] = new Sse();

  response.send(name);
});

const messages = {};
// {
//   name: ['hi', 'hello', 'goodbye'],
//   fun: ['we are having fun', 'so much fun']
// }

app.get('/message', (request, response, next) => {
  response.send(messages);
});

app.post('/message/:roomName', (request, response, next) => {
  const { message } = request.body;
  const { roomName } = request.params;

  const room = messages[roomName];

  room.push(message);

  const stream = streams[roomName];

  const string = JSON.stringify(message);

  stream.send(string);

  response.send(message);
});

app.listen(port, () => console.log(`Listening on ${port}`));
