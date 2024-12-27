import { DataTypes, Sequelize } from 'sequelize'

const Contact = (sequelize) => {
  return sequelize.define('CONTACT', {
    ID: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      comment: "고유번호"
    },
    ORG_NM: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "기관명"
    },
    USER_NM: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "담당자명"
    },
    PHONE: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "휴대전화(하이픈제외)"
    },
    EMAIL: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "이메일"
    },
    SERVICE_CD: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "서비스코드(Json형태)"
    },
    BUDGET: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
      comment: "예산"
    },
    SCHEDULE: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "일정(YYYYMMDD)"
    },
    PROJECT_INFO: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "프로젝트 설명"
    },
    REPLY_STATUS: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "회신여부 (0:미회신,1:회신)"
    },
    CREATE_AT: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('current_timestamp'),
      comment: "생성일자"
    },
    UPDATE_AT: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      comment: "수정일자"
    }
  }, {
    sequelize,
    tableName: 'CONTACT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "ID" }]
      }
    ]
  })
}

export default Contact
