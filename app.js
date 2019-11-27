const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErroHandling = require('./controllers/errorsController');

const candidateRoutes = require('./routes/candidatesRoutes');
const usersRoutes = require('./routes/userRoutes');

const app = express();

// Setting morgan to DEV to see in our logs the requests Status
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Setting body parser
app.use(express.json());

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
