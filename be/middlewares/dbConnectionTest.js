const { sequelize } = require('../models');

const dbConnectionTest = async (req, res, next) => {
  try {
    // await sequelize.authenticate();
    // console.log('데이터베이스 연결 성공');
    next();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    res.status(500).send('데이터베이스 연결 실패');
  }
};

module.exports = dbConnectionTest;
