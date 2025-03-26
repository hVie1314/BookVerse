const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

const route = require('./routes'); // import route from routes/index.js
const db = require('./configs/db'); // import db from config/db/index.js
//const middleware = require('./app/middlewares/...');

const app = express();
const port = 3000;


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

// routes init
route(app);

// connect to DB
db.connect();

// start server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})