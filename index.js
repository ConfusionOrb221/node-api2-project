const express = require('express');

const apiRouter = require('./api/ApiRouter');

const server = express();

server.use(express.json());

server.use('/api', apiRouter);

server.use('/', (req, res) => console.log('Server up and Running'));

server.listen(4000, () => console.log('API running on port 4000'));
