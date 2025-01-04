import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../connection';

const STACK = sequelize.define('STACK', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    STACK_NM: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "스택이름"
    },
    ICON: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "아이콘 경로"
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
    tableName: 'STACK',
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
export { STACK };
