
const responseFormatterMiddleware = (req, res, next) => {

  // Store the original send method
  const originalSend = res.send;

  // Override the send method
  res.send = function (data) {
    let parsedData = null;
    // Parse data if it's a string to avoid double-stringifying
    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        return originalSend.call(this, data);
      }
    } else {
      parsedData = data;
    }

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