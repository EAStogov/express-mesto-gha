const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('', getCards);

router.post('', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^((https?:\/\/)|(www\.))([\w-]+)\.([a-z]{2,6})(\/[\w/]*)?/),
  }),
}), postCard);

router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = router;
