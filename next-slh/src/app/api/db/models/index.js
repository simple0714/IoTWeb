const { Sequelize } = require('sequelize');
const sequelize = require('../connection');

// 모델 수동 등록
const ABOUT = require('./ABOUT')(sequelize, Sequelize.DataTypes);
const ADMIN_INFO = require('./ADMIN_INFO')(sequelize, Sequelize.DataTypes);
const CONTACT = require('./CONTACT')(sequelize, Sequelize.DataTypes);
const PARTNER = require('./PARTNER')(sequelize, Sequelize.DataTypes);
const PROJECT_IMG = require('./PROJECT_IMG')(sequelize, Sequelize.DataTypes);
const PROJECT = require('./PROJECT')(sequelize, Sequelize.DataTypes);
const SERVICE = require('./SERVICE')(sequelize, Sequelize.DataTypes);
const STACK = require('./STACK')(sequelize, Sequelize.DataTypes);

// DB 객체 생성
const db = {
  ABOUT,
  ADMIN_INFO,
  CONTACT,
  PARTNER,
  PROJECT_IMG,
  PROJECT,
  SERVICE,
  STACK,
  sequelize, // Sequelize 인스턴스
  Sequelize, // Sequelize 라이브러리
};

// 모델 간 관계 설정 (필요시)
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.sequelize.sync({ force: false }) // DB 동기화
  .then(() => {
    console.log('DB 및 테이블이 성공적으로 동기화되었습니다.');
  })
  .catch((error) => {
    console.error('DB 동기화 오류:', error);
  });

module.exports = db;
