import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../connection';

const TB_USER = sequelize.define('TB_USER', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    USER_ID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "사용자 ID",
      unique: "USER_ID"
    },
    USER_NM: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "사용자 이름"
    },
    USER_PW: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "사용자 비밀번호"
    },
    PHONE: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "사용자 전화번호",
      unique: "PHONE"
    },
    ORG_CD: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: "부서코드"
    },
    ORG_NM: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "부서명"
    },
    ROLE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "사용자 권한 (0:시스템관리자, 1:일반사용자)"
    },
    STATUS: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "1",
      comment: "사용자 상태 (0:대기, 1:사용, 2:정지(만료))"
    },
    ACCESS_TOKEN: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "엑세스토큰"
    },
    ACCESS_TOKEN_EXP: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "엑세스토큰 만료일"
    },
    REFRESH_TOKEN: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "리프레시 토큰"
    },
    REFRESH_TOKEN_EXP: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "리프레시 토큰 만료일"
    },
    LAST_LOGIN_DT: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "마지막 로그인 일시"
    },
    CREATE_AT: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'TB_USER',
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
        name: "USER_ID",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "USER_ID" },
        ]
      },
      {
        name: "PHONE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "PHONE" },
        ]
      },
    ]
  });
export { TB_USER };
