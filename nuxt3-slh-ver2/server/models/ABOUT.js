import { Sequelize, DataTypes } from 'sequelize'

export default (sequelize) => {
  return sequelize.define('ABOUT', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    SORT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "정렬순서",
      unique: "SORT"
    },
    TITLE: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "타이틀"
    },
    SUB_TITLE: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      comment: "서브타이틀"
    },
    ICON: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "아이콘 경로"
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
    tableName: 'ABOUT',
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
        name: "SORT",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SORT" },
        ]
      },
    ]
  })
}