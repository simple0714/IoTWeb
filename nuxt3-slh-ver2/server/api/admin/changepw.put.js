import db from '../../models'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const { id, pw } = getQuery(event)
    
    console.log('비밀번호 변경 요청:', { id, pwLength: pw?.length })

    // 입력값 검증
    if (!id || !pw) {
      throw createError({
        statusCode: 400,
        message: '아이디와 새 비밀번호를 입력해주세요.'
      })
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(pw, 10)

    // 비밀번호 업데이트
    const result = await db.ADMIN_INFO.update(
      { 
        ADMIN_PW: hashedPassword,
        UPDATE_AT: new Date()
       },
      { where: { ADMIN_ID: id } }
    )

    if (!result[0]) {  // 업데이트된 행이 없는 경우
      throw createError({
        statusCode: 400,
        message: '비밀번호 변경 실패'
      })
    }

    return {
      statusCode: 200,
      message: '비밀번호 변경 성공'
    }

  } catch (error) {
    console.error('비밀번호 변경 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})