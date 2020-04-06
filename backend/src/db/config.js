require('dotenv').config();


module.exports = {

  development: {
    database: process.env.DEV_DB_NAME,
    username: process.env.DEV_DB_USER,
    password: process.env.DEV_DB_PASS,
    host: process.env.DEV_DB_HOST,
    dialect: 'postgres'
  },

  test: {
    database: process.env.TEST_DB_NAME,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    host: process.env.TEST_DB_HOST,
    logging: false,
    dialect: 'postgres'
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};
