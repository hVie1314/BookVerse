require('dotenv').config(); // load env variables from .env file
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');

const route = require('./routes'); // import route from routes/index.js
const mongodb = require('./configs/db/mongo'); // import db from configs/db/mongo.js
const redis = require('./configs/db/redis'); // import db from configs/db/redis.js
//const middleware = require('./app/middlewares/...');

const app = express();
const port = process.env.PORT || 3000;

// static file
app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// debug log
app.use(morgan('combined'));

// method override
app.use(methodOverride('_method'))

// custome middleware
//app.use(middleware);

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
// routes init
route(app);

// connect to DB
mongodb.connect();
redis.connect();

// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})