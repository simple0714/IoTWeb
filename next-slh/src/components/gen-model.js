require('dotenv').config();

const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: '3306',  
  dialect: process.env.DB_DIALECT,
  directory: './be/models', // 모델 파일을 저장할 디렉토리

  additional: {
    timestamps: false
  },
  
  //tables: ['admins'], // 생성하고자 하는 테이블 목록

  // ['users'];
  // ['users','admins','directions','directions_history','mobile_apps','route_search_history','system_announcements','transportation_modes','tutorials'];
  // ['admins'];
  // ['directions'];
  // ['directions_history'];
  // ['mobile_apps'];
  // ['route_search_history'];
  // ['system_announcements'];
  // ['transportation_modes'];
  // ['tutorials'];
  
});

try {
  auto.run()
    .then(data => {
      console.log('모델 생성이 완료되었습니다.', auto.tables);
      console.log('모델 생성 종료.');
      process.exit(0);
    })
    .catch(error => {
      console.error('모델 생성 중 오류 발생:', error);
      process.exit(1); // 오류를 나타내기 위해 비정상 종료 코드 사용
    });

} catch (error) {
  console.error('모델 생성 중 오류 발생:', error);
}

