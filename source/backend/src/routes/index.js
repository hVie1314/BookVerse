const testRouter = require('./testRouter');

function route(app) {
   app.use('/test', testRouter);
   //  app.use('/book', bookRouter);
   //  app.use('/me', meRouter);
}

module.exports = route;