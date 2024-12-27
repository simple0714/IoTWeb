import { Sequelize, DataTypes } from 'sequelize'

export default (sequelize, DataTypes) => {
    return sequelize.define('PROJECT', {
        ID: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            comment: "고유번호"
          },
          PROJECT_NB: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "프로젝트 넘버",
            unique: "PROJECT_NB"
          },
          TITLE: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            comment: "타이틀"
          },
          SUB_TITLE: {
            type: DataTypes.STRING(200),
            allowNull: true,
            comment: "서브타이틀"
          },
          PROJECT_IMG: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            comment: "프로젝트 섬네일"
          },
          STACK: {
            type: DataTypes.JSON,
            allowNull: false,
            comment: "기술스택(Json형태)"
          },
          PROJECT_INFO: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "프로젝트 설명"
          },
          CREATE_AT: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('current_timestamp'),
            comment: "생성일자"
          },
          UPDATE_AT: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('current_timestamp'),
            comment: "수정일자"
          }
    }, {
        tableName: 'PROJECT',
        timestamps: false,
        indexes: [
            {
              name: "PRIMARY",
              unique: true,
              using: "BTREE",
              fields: [
                { name: "ID" },
              ]
            },
            {
              name: "PROJECT_NB",
              unique: true,
              using: "BTREE",
              fields: [
                { name: "PROJECT_NB" },
              ]
            },
        ]
    })
}