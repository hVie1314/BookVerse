const testRouter = require('./testRouter');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const bookRouter = require('./bookRouter');
const cartRouter = require('./cartRouter');

function route(app) {
   app.use('/test', testRouter);
   app.use('/auth', authRouter);
   app.use('/users', userRouter);
   app.use('/book', bookRouter);
   app.use('/cart', cartRouter);
}

module.exports = route;