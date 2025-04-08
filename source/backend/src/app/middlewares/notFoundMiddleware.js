
const notFoundMiddleware = (req, res, next) => {
   res.status(404).json({
      errorCode: "ENDPOINT_NOT_FOUND",
   });
}

module.exports = notFoundMiddleware;