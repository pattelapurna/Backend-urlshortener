const logRequestSize = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    const requestSize = req.headers['content-length'] || 0;
    console.log(`Request Size: ${requestSize} bytes`);
    return originalSend.call(this, body);
  };

  next();
};

export default logRequestSize
