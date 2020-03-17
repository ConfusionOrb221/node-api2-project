const express = require('express');
const expressRouter = require('./ExpressRouter');

const router = express.Router();

router.use('/posts', expressRouter);


module.exports = router;