import tokenService from '#services/token.service';
import logger from '#utils/logger';
import { asyncLocalStorage } from '#utils/context';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const user = await tokenService.verifyAccessToken(token);

    // Each .run() creates a new isolated context
    asyncLocalStorage.run({ user }, () => {
      // This context is unique per request
      // Other requests can't access this context
      logger.addDefaultMetadata({
        userId: user._id,
      });

      next();
    }); // Context is destroyed when callback completes
  } catch (err) {
    return next(err);
  }
};

export default auth;
