const express = require('express');
const path = require('path');
const app = express();

const build = path.join(__dirname + '/../build');

app.engine('html', require('pug').renderFile);
app.use(express.static(build));

app.get('/', (req, res) => res.render(build + '/index.html'));

app.listen(2222, () => console.log('Ready to accept connections on port 2222'));