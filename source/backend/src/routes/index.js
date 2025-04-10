const testRouter = require('./testRouter');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

function route(app) {
   app.use('/test', testRouter);
   app.use('/auth', authRouter);
   //  app.use('/book', bookRouter);
   //  app.use('/me', meRouter);
   app.use('/users', userRouter);
}

module.exports = route;