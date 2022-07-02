const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UnknownError = require('../errors/UnknownError');

const { JWT_SECRET } = process.env;

const getUsers = (_req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      next(new UnauthorizedError('Необходимо авторизоваться'));
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    });
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((me) => {
      if (!me) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(me);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        const err = new Error('Пользователь с таким email уже зарегистрирован');
        err.statusCode = 409;
        next(err);
      }
      bcrypt.hash(req.body.password, 10)
        .then((hash) => User.create({
          email: req.body.email,
          password: hash,
          name: req.body.name,
          about: req.body.about,
          avatar: req.body.avatar,
        }))
        .then((newUser) => res.send({
          email: newUser.email,
          name: newUser.name,
          about: newUser.about,
          avatar: newUser.avatar,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Введены некорректные данные'));
          }
        });
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
      });

      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUser, getMe, createUser, updateUserProfile, updateUserAvatar, login,
};
