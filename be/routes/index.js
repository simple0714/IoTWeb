const express = require('express');
const router = express.Router();

// 라우팅
router.get('/', function(req, res, next) {
  res.send('softlab-hum API Server');
});

// AWS 설정
const AWS = require('aws-sdk');
const multer = require('multer');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid'); 

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

// 멀티파일 업로드
router.post('/multiFileUpload', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: '파일이 없습니다.',
    });
  }

  const fileLocations = []; // URL과 인덱스를 저장할 배열
  try {
    // 업로드 프로미스 배열
    const uploadPromises = req.files.map(async (file, index) => {
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `uploads/${uuidv4()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      // S3에 파일 업로드
      const data = await s3.upload(params).promise();
      
      // URL과 인덱스를 포함한 객체를 fileLocations에 추가
      fileLocations.push({ url: data.Location, sort: index + 1 }); // 인덱스는 1부터 시작
    });

    // 모든 파일 업로드 시도
    await Promise.all(uploadPromises);

    // 성공 응답
    return res.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      files: fileLocations, // URL과 인덱스 정보를 포함한 배열 반환
    });
  } catch (error) {
    console.error('업로드 중 오류 발생:', error);

    // 업로드 중 오류 발생 시 이미 업로드된 파일 삭제
    await Promise.all(fileLocations.map(async (fileInfo) => {
      // 삭제할 S3 객체의 Key 추출
      const key = fileInfo.url.split('/').pop(); // URL의 마지막 부분이 Key
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: key,
      };

      // S3에서 파일 삭제
      await s3.deleteObject(params).promise();
    }));

    return res.status(500).json({
      success: false,
      message: '업로드 중 오류가 발생했습니다. 모든 파일이 삭제되었습니다.',
    });
  }
});

router.post('/fileUpload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '파일이 없습니다.',
    });
  }

  try {
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `uploads/${uuidv4()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const data = await s3.upload(params).promise();

    return res.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      url: data.Location,
    });
  } catch (error) {
    console.error('업로드 중 오류 발생:', error);

    return res.status(500).json({
      success: false,
      message: '업로드 중 오류가 발생했습니다.',
    });
  }
});

module.exports = router;