const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('./io');
const path = require('path');
const { each } = require('lodash');

const middleware = require('./middleware');
const routes = require('./routes');

app.use(middleware.bodyParser.json());
app.use(middleware.bodyParser.urlencoded({ extended: true }));
app.use(middleware.morgan('short'));

app.use(express.static(path.resolve(__dirname, '..', 'dist', 'js')));
app.use(express.static(path.resolve(__dirname, '..', 'static')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index.pug'));

each(routes, (cb, endpoint) => app.use(`/api/${endpoint}`, middleware.setCORS, cb));

io.attach(server, { transport: ['Websocket'] });

server.listen(6300, () => console.log('Ready to accept connections on port 6300'));
