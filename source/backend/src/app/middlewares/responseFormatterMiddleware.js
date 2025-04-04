
const responseFormatterMiddleware = (req, res, next) => {

  // Store the original send method
  const originalSend = res.send;

  // Override the send method
  res.send = function (data) {
    // Parse data if it's a string to avoid double-stringifying
    const parsedData = JSON.parse(data);

    // Format the response data
    const formattedResponse = {
      success: true,
      data: parsedData,
    };

    // Call the original send method with the formatted response
    originalSend.call(this, JSON.stringify(formattedResponse));
  };

  next();
}

module.exports = responseFormatterMiddleware;