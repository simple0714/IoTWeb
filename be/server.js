const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');

const dbConnectionTest = require('./middlewares/dbConnectionTest');
const corsOptions = require('./middlewares/corsOptions');

const swaggerUi = require('swagger-ui-express');
const mergeYAML = require('./swagger/mergeYAML');
const swaggerDocument = mergeYAML();

// JSON 파싱을 위한 미들웨어
app.use(express.json());

// CORS 허용
app.use(cors(corsOptions));

// 연결 테스트 미들웨어 사용
app.use(dbConnectionTest);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 라우터 설정
const homeRouter = require('./routes/index');
const aboutRouter = require('./routes/About');
const adminRouter = require('./routes/Admin');
const contactRouter = require('./routes/Contact');
const partnerRouter = require('./routes/Partner');
const projectRouter = require('./routes/Project');
const serviceRouter = require('./routes/Service');
const stack = require('./routes/Stack');

app.use('/apis/', homeRouter);
app.use('/apis/about', aboutRouter);
app.use('/apis/admin', adminRouter);
app.use('/apis/contact', contactRouter);
app.use('/apis/partner', partnerRouter);
app.use('/apis/project', projectRouter);
app.use('/apis/service', serviceRouter);
app.use('/apis/stack', stack);

// 서버 시작
app.listen(PORT, () => {
  console.log(` ✅ [Express Server Start!] http://localhost:${PORT}`); 
  console.log(` ✅ [Swagger UI Start!] http://localhost:${PORT}/api-docs`);
});
