import db from '../../models'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { id, pw } = query
    
    console.log('로그인 시도:', id)

    // 사용자 정보 조회
    const userInfo = await db.ADMIN_INFO.findOne({
      where: { ADMIN_ID: id }
    })

    if (!userInfo) {
      throw createError({
        statusCode: 400,
        message: '아이디 또는 비밀번호가 틀렸습니다.'
      })
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(pw, userInfo.ADMIN_PW)
    
    if (!isValidPassword) {
      throw createError({
        statusCode: 400,
        message: '아이디 또는 비밀번호가 틀렸습니다.'
      })
    }

    // 비밀번호 필드 제외하고 반환
    const { ADMIN_PW, ...safeUserInfo } = userInfo.toJSON()
    
    return {
      statusCode: 200,
      dataInfo: safeUserInfo
    }

  } catch (error) {
    console.error('로그인 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})