const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

const { JWT_SECRET = 'd92f6c25c8bd88007924dd817ca05574' } = process.env;

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies.jwt) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
