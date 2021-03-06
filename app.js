const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErroHandling = require('./controllers/errorsController');

const candidateRoutes = require('./routes/candidatesRoutes');
const usersRoutes = require('./routes/userRoutes');

const app = express();
app.use(helmet());

app.use(cors());
app.options('*', cors());

const limited = rateLimit({
  max: process.env.MAX_RATE_LIMIT,
  windowMs: 60 * 60 * 1000,
  message: 'Wait 1h to try again'
});
app.use('/api', limited);

const limitedLogin = rateLimit({
  max: process.env.MAX_RATE_LIMIT_LOGIN,
  windowMs: 60 * 60 * 1000
});
app.use('/api/v1/users/login', limitedLogin);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against cross site scripting attacks
app.use(xss());

// Setting morgan to DEV to see in our logs the requests Status
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Preventing http parameters polution
app.use(hpp());

// Setting body parser
app.use(express.json({ limit: '10kb' }));

// Middlewares Routes
app.use('/api/v1/candidates/', candidateRoutes);
app.use('/api/v1/users/', usersRoutes);

// Error Handler
app.use('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} was not found try again`, 404));
});

// Global error handling
app.use(globalErroHandling);

// Exporting App
module.exports = app;
