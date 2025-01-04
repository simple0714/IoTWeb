// 데이터베이스 연결
import { Sequelize } from 'sequelize';
const mysql2 = require('mysql2');
require('dotenv').config({ path: '../../../../.env' });

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
        dialectModule: mysql2,
    });

// DB 연결 확인
sequelize.authenticate()
    .then(() => {
        console.log('DB 연결 성공!');
    })
    .catch((error) => {
        console.error('DB 연결 오류:', error);
    });

export default sequelize;
