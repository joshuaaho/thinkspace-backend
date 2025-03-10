import morgan from 'morgan';
import logger from '#utils/logger';

// Middleware to capture response body
const captureResponse = (req, res, next) => {
  const oldSend = res.send;
  const oldJson = res.json;

  res.send = function (body) {
    res.locals.body = body;
    return oldSend.apply(res, arguments);
  };

  res.json = function (body) {
    res.locals.body = body;
    return oldJson.apply(res, arguments);
  };

  next();
};

// Configure morgan tokens for request and response body
morgan.token('request-body', (req) => JSON.stringify(req.body));
morgan.token('response-body', (req, res) => JSON.stringify(res.locals.body));
morgan.token('device', (req) => {
  const userAgent = req.headers['user-agent'];
  return userAgent || 'unknown device';
});
morgan.token('authorization', (req) => {
  const auth = req.headers['authorization'];
  return auth ? `${auth.slice(0, 20)}...` : 'no auth'; // Truncate for security
});
morgan.token('request-headers', (req) => {
  // Filter out sensitive headers if needed
  const headers = { ...req.headers };
  if (headers.authorization) {
    headers.authorization = headers.authorization.slice(0, 20) + '...';
  }
  return JSON.stringify(headers);
});
morgan.token('response-headers', (req, res) => {
  return JSON.stringify(res.getHeaders());
});

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, 'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req, res)),
      request_body: tokens['request-body'](req, res),
      response_body: tokens['response-body'](req, res),
      device: tokens['device'](req, res),
      authorization: tokens['authorization'](req, res),
      request_headers: tokens['request-headers'](req, res),
      response_headers: tokens['response-headers'](req, res),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        logger.http(`incoming-request`, data);
      },
    },
  },
);

// Combine all middleware
const enhancedMorganMiddleware = [captureResponse, morganMiddleware];

export default enhancedMorganMiddleware;
