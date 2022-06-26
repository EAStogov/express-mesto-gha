const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    res.status(401).send({ message: 'Необходима авторизация' });
    // next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
    // next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
