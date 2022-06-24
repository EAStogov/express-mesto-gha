const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  req.user = {
    _id: '62b4a23d553c410c9aeb3a68'
  };

  next();
});
app.use('', userRouter);
app.use('', cardRouter);
app.use('*', (_req, res) => {
  res.status(404).send({ message: 'Страница не найдена' })
});

mongoose.connect('mongodb://localhost:27017/mestodb')

app.listen(PORT, () => {
  console.log("it's alive")
})