import { S3Client } from '@aws-sdk/client-s3';

const configureAWS = () => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });
  return s3;
};

export default configureAWS;


// import AWS from 'aws-sdk';

// const configureAWS = () => {
//   if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY || !process.env.AWS_REGION) {
//     throw new Error('AWS 환경변수가 설정되지 않았습니다.');
//   }

//   AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//     region: process.env.AWS_REGION
//   });

//   return new AWS.S3();
// };

// export default configureAWS;
