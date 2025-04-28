
class AppError extends Error {

  constructor(status = 500, errorCode = "INTERNAL_SERVER_ERROR", message = null) {
    super(message || errorCode); 

    this.status = status; 
    this.errorCode = errorCode;
    // Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }
}

module.exports = AppError;