const testRouter = require('./testRouter');
const authRouter = require('./authRouter');
const productRouter = require('./productRouter');

function route(app) {
   app.use('/test', testRouter);
   app.use('/auth', authRouter);
   //  app.use('/book', bookRouter);
   //  app.use('/me', meRouter);
   app.use('/products', productRouter);
}

module.exports = route;