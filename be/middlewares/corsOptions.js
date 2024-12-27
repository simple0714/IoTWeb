const corsOptions = {
  origin: (origin, callback) => {
    // 허용할 도메인 목록
    // 프론트 : 5000 , 백엔드 : 3001
    const whitelist = ['http://localhost:3001','http://127.0.0.1:3001','http://localhost:5000','http://127.0.0.1:5000'];
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 인증 정보(쿠키, 인증 헤더 등) 포함 여부
};

module.exports = corsOptions;