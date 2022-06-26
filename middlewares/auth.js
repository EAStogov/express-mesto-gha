const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация1');
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация2');
  }

  req.user = payload;

  next();
};
