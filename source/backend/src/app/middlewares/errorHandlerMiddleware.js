const AppError = require("../../utils/appError");

const errorHandlerMiddleware = (err, req, res, next) => {

   try {
      // log
      console.log("\n--------------------------------------------------------------------------------------\n");
      console.log('ERROR LOG ', new Date().toLocaleString());
   	console.log('Request:', req.method, req.originalUrl);
   	console.log('Params:', req.params);
   	console.log('Body:', req.body);
   	console.log('Query:', req.query);
   	console.log('Error: ', err);
   	console.log('Error stack: ', err.stack);
      console.log("\n--------------------------------------------------------------------------------------\n");
   
      if (err instanceof AppError) {
         return res.status(err.status).json({
            errorCode: err.errorCode,
         });
      }
   } catch (error) {
      // undefined error
      res.status(500).json({
         errorCode: "UNKNOWN_INTERNAL_SERVER_ERROR",
      });
   }
}

module.exports = errorHandlerMiddleware;