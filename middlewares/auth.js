const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookies } = req;

  if (!cookies) {
    res.status(401).send({ message: cookies });
  }

  const token = cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(res.status(401).send({ message: 'Необходима авторизация' }));
  }

  req.user = payload;

  next();
};
