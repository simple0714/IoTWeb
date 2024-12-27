const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PROJECT_IMG', {
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
      comment: "프로젝트 넘버"
    },
    PROJECT_IMG: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "이미지경로"
    },
    SORT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "정렬순서"
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
    tableName: 'PROJECT_IMG',
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
    ]
  });
};
