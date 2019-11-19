const express = require('express');
const morgan = require('morgan');

const candidateRoutes = require('./routes/candidatesRoutes');

const app = express();

// Setting morgan to DEV to see in our logs the requests Status
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Setting body parser
app.use(express.json());

// Middlewares Routes
app.use('/api/v1/candidates/', candidateRoutes);

// Error Handler

// Exporting App
module.exports = app;
