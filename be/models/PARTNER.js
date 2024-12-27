const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PARTNER', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    PARTNER_NM: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "파트너명"
    },
    PARTNER_IMG: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "파트너 이미지 경로"
    },
    PARTNER_URL: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "파트너 페이지 경로"
    },
    SORT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "정렬순서"
    },
    USE_YN: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "사용여부 (0:미사용,1:사용 미사용시 화면표시X)"
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
    tableName: 'PARTNER',
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
