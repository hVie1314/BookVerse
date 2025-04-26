const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const bookRouter = require('./bookRouter');
const cartRouter = require('./cartRouter');
const reviewRouter = require('./reviewRouter');
const cancelRequestRouter = require('./cancelRequestRouter')

function route(app) {
   app.use('/auth', authRouter);
   app.use('/user', userRouter);
   app.use('/book', bookRouter);
   app.use('/cart', cartRouter);
   app.use('/review', reviewRouter);
   app.use('/order/cancel', cancelRequestRouter);
}

module.exports = route;