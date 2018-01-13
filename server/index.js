const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('./io')(server);
const path = require('path');

const middleware = require('./middleware');
const routes = require('./routes');

const build = path.join(__dirname, '..', 'build');

app.use(middleware.bodyParser.json());
app.use(middleware.bodyParser.urlencoded({ extended: true }));
app.use(middleware.morgan('dev'));

app.use(express.static(build));

app.use('/api/networkinterface', routes.networkInterface);
app.use('/api/navigation', routes.navigation);
app.use('/api/stream', (req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*'});
  next();
}, routes.stream);

server.listen(6300, () => console.log('Ready to accept connections on port 6300'));
