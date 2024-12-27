const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ADMIN_INFO', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    ADMIN_ID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "관리자ID",
      unique: "ADMIN_ID"
    },
    ADMIN_PW: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "관리자PW"
    },
    ADMIN_NM: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "관리자명"
    },
    ADMIN_EMAIL: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "관리자이메일",
      unique: "ADMIN_EMAIL"
    },
    ADMIN_PHONE: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "관리자전화번호(하이픈제외)"
    },
    ROLE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "권한 ( 0:전체메뉴, 1:특정메뉴 )"
    },
    CREATE_AT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "생성일자"
    },
    UPDATE_AT: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
      comment: "수정일자"
    }
  }, {
    sequelize,
    tableName: 'ADMIN_INFO',
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
        name: "ADMIN_ID",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ADMIN_ID" },
        ]
      },
      {
        name: "ADMIN_EMAIL",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ADMIN_EMAIL" },
        ]
      },
    ]
  });
};
