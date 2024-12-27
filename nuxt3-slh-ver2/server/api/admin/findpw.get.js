import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { id, name, email, phone } = getQuery(event)
    
    console.log('비밀번호 찾기 요청:', { id, name, email, phone })

    // 입력값 검증
    if (!id || !name || !email || !phone) {
      throw createError({
        statusCode: 400,
        message: '모든 정보를 입력해주세요.'
      })
    }

    // 사용자 정보 조회
    const userInfo = await db.ADMIN_INFO.findOne({
      where: { ADMIN_ID: id }
    })

    if (!userInfo) {
      throw createError({
        statusCode: 400,
        message: '일치하는 정보가 없습니다.'
      })
    }

    // 추가 정보 검증
    if (userInfo.ADMIN_NM !== name || 
        userInfo.ADMIN_EMAIL !== email || 
        userInfo.ADMIN_PHONE !== phone) {
      throw createError({
        statusCode: 400,
        message: '일치하는 정보가 없습니다.'
      })
    }

    return {
      statusCode: 200,
      message: 'SUCCESS'
    }

  } catch (error) {
    console.error('비밀번호 찾기 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})