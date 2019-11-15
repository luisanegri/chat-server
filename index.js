const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(jsonParser);
app.get('/', (req, res, next) => {
  res.send('hello');
});

const messages = [];

app.post('/message', (req, res, next) => {
  // get the message out of the body of the req
  const { message } = req.body;
  // push it to array messages
  messages.push(message);
  res.send(message);
});

app.listen(port, () => console.log(`listening on port ${port}`));
