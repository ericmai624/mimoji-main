const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('./io');
const path = require('path');

const middleware = require('./middleware');
const routes = require('./routes');

const build = path.join(__dirname, '..', 'build');

app.use(middleware.bodyParser.json());
app.use(middleware.bodyParser.urlencoded({ extended: true }));
app.use(middleware.morgan('short'));

app.use(express.static(build));

app.use('/api/networkinterface', routes.networkInterface);
app.use('/api/stream', (req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*'});
  next();
}, routes.stream);
app.use('/api/subtitle', (req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*'});
  next();
}, routes.subtitle);

io.attach(server, { transport: ['Websocket'] });

server.listen(6300, () => console.log('Ready to accept connections on port 6300'));
