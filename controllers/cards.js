const Card = require('../models/card');

const getCards = (_req, res) => {
  Card.find()
  .then(cards => res.send({ data: cards }))
  .catch((_) => res.status(500).send({message: 'Что-то пошло не так'}))
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
  .then(newCard => {
    const {name, link, owner, likes, _id} = newCard;
    res.send({ data: {name, link, owner, likes, _id}}
    )
})
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Введены некорректные данные' });
    } else {
      res.status(500).send({message: 'Что-то пошло не так'});
    }
  })
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then(removedCard => {
    if (!removedCard) {
      return res.status(404).send({ message: 'Карточка не найдена' })
    }
    res.send({ data: removedCard })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Введены некорректные данные' });
    } else {
      res.status(500).send({message: 'Что-то пошло не так'});
    }
  })

};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
  .then(updatedCard => {
    if (!updatedCard) {
      return res.status(404).send({ message: 'Карточка не найдена' })
    }
    res.send({ data: updatedCard })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Введены некорректные данные' });
    } else {
      res.status(500).send({ message: 'Не удалось поставить лайк' });
    }
  })
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
  .then(updatedCard => {
    if (!updatedCard) {
      return res.status(404).send({ message: 'Карточка не найдена' })
    }
    res.send({ data: updatedCard })
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Введены некорректные данные' });
    } else {
      res.status(500).send({ message: 'Не удалось снять лайк' });
    }
  })
};

module.exports = { getCards, postCard, deleteCard, likeCard, dislikeCard };