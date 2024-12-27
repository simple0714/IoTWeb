const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB
  , dbConfig.USER
  , dbConfig.PASSWORD
  , {
  host : process.env.NODE_ENV === 'production' ? dbConfig.HOST : 'localhost',
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  dialectModule: require('mysql2'),
  operatorsAliases: false,
  timezone: "+09:00",
  dialectOptions: { charset: "utf8mb4", dateStrings: true, typeCast: true },
  define: {
    timestamps: true,
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델을 불러와서 db 객체에 추가
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }
);

// 쿼리로그 off
// sequelize.options.logging = false;

module.exports = db;
