import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import configureAWS from '../../../utils/awsConfig';
import { v4 as uuidv4 } from 'uuid';

const s3 = configureAWS();

export async function POST(req) {
  const formData = await req.formData();
  const files = formData.getAll('files'); // 여러 파일 가져오기

  if (!files || files.length === 0) {
    return NextResponse.json({ success: false, message: '파일이 없습니다.' }, { status: 400 });
  }

  const uploadedFiles = [];

  try {
    for (const file of files) {
      const fileName = `uploads/${uuidv4()}-${file.name}`;

      const fileBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      uploadedFiles.push({
        url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: '모든 파일이 성공적으로 업로드되었습니다.',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('업로드 중 오류:', error);
    return NextResponse.json({ success: false, message: '업로드에 실패했습니다.' }, { status: 500 });
  }
}
