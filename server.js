/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false
  })
  .then(conn => global.console.log('DB CONNECTED'));

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  global.console.log(`App running on port ${port}`);
});
