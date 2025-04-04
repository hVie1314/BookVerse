
const responseFormatterMiddleware = (req, res, next) => {

  // Store the original send method
  const originalSend = res.send;

  // Override the send method
  res.send = function (data) {
    // Parse data if it's a string to avoid double-stringifying
    const parsedData = JSON.parse(data);

    // error response format
    if (res.statusCode >= 400) {
      return originalSend.call(this, JSON.stringify({
        success: false,
        errorCode: parsedData.errorCode,
      }));
    }

    // success response format
    return originalSend.call(this, JSON.stringify({
      success: true,
      data: parsedData,
    }));
  };

  next();
}

module.exports = responseFormatterMiddleware;