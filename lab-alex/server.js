'use strict';

const express = require('express');
const debug = require(
  'debug'
)('pictogram:server');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`server up on ${PORT}`);
});