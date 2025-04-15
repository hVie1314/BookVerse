const testRouter = require('./testRouter');
const authRouter = require('./authRouter');
const bookRouter = require('./bookRouter');

function route(app) {
   app.use('/test', testRouter);
   app.use('/auth', authRouter);
   app.use('/book', bookRouter);
   //  app.use('/me', meRouter);
}

module.exports = route;