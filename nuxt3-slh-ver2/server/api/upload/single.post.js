import { s3 } from '../../utils/s3'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    if (!form || !form.length) {
      throw createError({
        statusCode: 400,
        message: '파일이 없습니다.'
      })
    }

    const file = form[0]
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: `uploads/${uuidv4()}-${file.filename}`,
      Body: file.data,
      ContentType: file.type
    }

    const data = await s3.upload(params).promise()

    return {
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      url: data.Location
    }
  } catch (error) {
    console.error('업로드 에러:', error)
    throw createError({
      statusCode: 500,
      message: '파일 업로드 중 오류가 발생했습니다.'
    })
  }
})