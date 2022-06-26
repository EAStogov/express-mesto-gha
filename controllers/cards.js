const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const UnknownError = require('../errors/UnknownError');

const getCards = (_req, res, next) => {
  Card.find()
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      next(new UnauthorizedError('Необходимо авторизоваться'));
    });
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCard) => {
      const { likes, _id } = newCard;
      res.send({
        data: {
          name, link, owner, likes, _id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(card.owner)) {
        next(new UnauthorizedError('Нельзя удалить чужую карточку'));
      }
      Card.findOneAndRemove(card)
        .then((removedCard) => {
          if (!removedCard) {
            next(new NotFoundError('Карточка не найдена'));
          }
          return res.send({ data: removedCard });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            next(new BadRequestError('Введены некорректные данные'));
          } else {
            next(new UnknownError('Что-то пошло не так'));
          }
        });
    })
    .catch(next(new UnauthorizedError('Что-то пошло не так')));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedCard) => {
      if (!updatedCard) {
        next(new NotFoundError('Карточка не найдена'));
      }
      return res.send({ data: updatedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(new UnknownError('Что-то пошло не так'));
      }
    });
};

module.exports = {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
};
