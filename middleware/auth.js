import { tokenService } from '../services/index.js';
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const user = await tokenService.verifyAccessToken(token);
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

export default auth;
