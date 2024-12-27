import AWS from 'aws-sdk'

// AWS SDK 설정
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET
})

// S3 인스턴스 생성
export const s3 = new AWS.S3()