import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  statusCode: 429,
  message: "Your quota is completed to access the API. Wait for some time and try again",
  handler: (_req, res, options) =>
    res.status(options.statusCode).send(options.message),
  standardHeaders: true,
  legacyHeaders: false,
});


export default limiter
