import { Sequelize } from 'sequelize'
import dbConfig from '../config/db.config'
//모델
import ABOUT from './ABOUT'
import PROJECT from './PROJECT'
import STACK from './STACK'
import PARTNER from './PARTNER'
import SERVICE from './SERVICE'
import CONTACT from './CONTACT'
import PROJECT_IMG from './PROJECT_IMG'
import ADMIN_INFO from './ADMIN_INFO'
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    timezone: "+09:00",
    dialectOptions: { charset: "utf8mb4", dateStrings: true, typeCast: true },
    define: {
        timestamps: true,
    },
    pool: dbConfig.pool,
    logging: false // 필요한 경우 true로 설정
});

// const db = {
//     Sequelize,
//     sequelize
// }

// db.ABOUT = ABOUT(sequelize, Sequelize)
// db.STACK = STACK(sequelize, Sequelize)
// db.PARTNER = PARTNER(sequelize, Sequelize)
// db.SERVICE = SERVICE(sequelize, Sequelize)
// db.CONTACT = CONTACT(sequelize, Sequelize)
// db.PROJECT = PROJECT(sequelize, Sequelize)
// db.PROJECT_IMG = PROJECT_IMG(sequelize, Sequelize)

const db = {
    Sequelize,
    sequelize,
    ABOUT: ABOUT(sequelize, Sequelize),
    STACK: STACK(sequelize, Sequelize),
    PARTNER: PARTNER(sequelize, Sequelize),
    SERVICE: SERVICE(sequelize, Sequelize),
    CONTACT: CONTACT(sequelize, Sequelize),
    PROJECT: PROJECT(sequelize, Sequelize),
    PROJECT_IMG: PROJECT_IMG(sequelize, Sequelize),
    ADMIN_INFO: ADMIN_INFO(sequelize, Sequelize)
}
// 모델 간 관계 설정 추가
db.PROJECT.hasMany(db.PROJECT_IMG, { 
    foreignKey: 'PROJECT_NB',
    sourceKey: 'PROJECT_NB'
})
db.PROJECT_IMG.belongsTo(db.PROJECT, { 
    foreignKey: 'PROJECT_NB',
    targetKey: 'PROJECT_NB'
})
export default db
