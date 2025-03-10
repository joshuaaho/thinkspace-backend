import userService from '#services/user.service';
import authService from '#services/auth.service';
import AppError from '#classes/AppError';

const register = async (req, res, next) => {
  try {
    await userService.createUser(req.body);
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { refreshToken, accessToken } = await authService.login(req.body.username, req.body.password);

    return res
      .status(200)
      .cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ accessToken });
  } catch (err) {
    return next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      throw new AppError('Refresh token missing', 401);
    }

    const refreshToken = cookies.jwt;

    const { newAccessToken } = await authService.refresh(refreshToken);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(204).end();

    const refreshToken = cookies.jwt;

    await authService.logout(refreshToken);

    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export default {
  logout,
  refresh,
  login,
  register,
};
