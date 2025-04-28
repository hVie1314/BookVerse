require('dotenv').config(); // load env variables from .env file

const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');

const route = require('./routes'); // import route from routes/index.js
const mongodb = require('./configs/db/mongo');
const redis = require('./configs/db/redis');
const responseFormatterMiddleware = require('./app/middlewares/responseFormatterMiddleware');
const notFoundMiddleware = require('./app/middlewares/notFoundMiddleware');
const errorHandlerMiddleware = require('./app/middlewares/errorHandlerMiddleware');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(responseFormatterMiddleware);

// static file
app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// debug log
app.use(morgan('combined'));

// method override
app.use(methodOverride('_method'));

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
// routes init
route(app);

// 404 handler
app.use(notFoundMiddleware);

// error handler middleware
app.use(errorHandlerMiddleware);

// connect to DB
mongodb.connect();
redis.connect();

// start server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
