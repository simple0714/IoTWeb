import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../connection';

const SERVICE = sequelize.define('SERVICE', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    SERVICE_CD: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "서비스코드",
      unique: "SERVICE_CD"
    },
    SERVICE_NM: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "서비스명"
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
    tableName: 'SERVICE',
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
        name: "SERVICE_CD",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SERVICE_CD" },
        ]
      },
    ]
  });
export { SERVICE };
