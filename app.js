require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');

const appRouter = require('./routes/appRouter');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());

app.use('', appRouter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(err.statusCode).send({ message: err.message }));

app.listen(PORT, () => {
});
