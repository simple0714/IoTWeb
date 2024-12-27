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

    const fileLocations = []
    const uploadedFiles = []

    // 순차적으로 파일 업로드 처리
    for (let i = 0; i < form.length; i++) {
      const file = form[i]
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `uploads/${uuidv4()}-${file.filename}`,
        Body: file.data,
        ContentType: file.type
      }

      const data = await s3.upload(params).promise()
      fileLocations.push({ url: data.Location, sort: i + 1 })
      uploadedFiles.push({ key: params.Key, url: data.Location })
    }

    return {
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      files: fileLocations
    }

  } catch (error) {
    console.error('업로드 에러:', error)
    
    // 업로드된 파일 삭제
    for (const file of uploadedFiles) {
      try {
        await s3.deleteObject({
          Bucket: process.env.AWS_BUCKET,
          Key: file.key
        }).promise()
      } catch (deleteError) {
        console.error('파일 삭제 실패:', deleteError)
      }
    }

    throw createError({
      statusCode: 500,
      message: '파일 업로드 중 오류가 발생했습니다.'
    })
  }
})