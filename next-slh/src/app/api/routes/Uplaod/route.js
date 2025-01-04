import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import configureAWS from '../../utils/awsConfig';
import { v4 as uuidv4 } from 'uuid';

const s3 = configureAWS();

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ success: false, message: '파일이 없습니다.' }, { status: 400 });
  }

  const fileName = `uploads/${uuidv4()}-${file.name}`;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    const result = await s3.send(command);

    return NextResponse.json({
      success: true,
      message: '파일 업로드에 성공했습니다.',
      url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
    });
  } catch (error) {
    console.error('업로드 중 오류:', error);
    return NextResponse.json({ success: false, message: '업로드에 실패했습니다.' }, { status: 500 });
  }
}
