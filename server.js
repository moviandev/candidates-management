/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const DB_LOCAL = process.env.LOCAL_DB;

mongoose
  .connect(DB_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(conn => global.console.log('DB CONNECTED'));

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  global.console.log(`App running on port ${port}`);
});
