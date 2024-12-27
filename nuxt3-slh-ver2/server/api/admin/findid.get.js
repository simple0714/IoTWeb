import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { name, email } = getQuery(event)
    
    console.log('아이디 찾기 요청:', { name, email })

    // 사용자 정보 조회
    const userInfo = await db.ADMIN_INFO.findOne({
      where: { 
        ADMIN_NM: name,
        ADMIN_EMAIL: email
      },
      attributes: ['ADMIN_ID', 'ADMIN_NM', 'ADMIN_EMAIL'] // 필요한 필드만 선택
    })

    if (!userInfo) {
      throw createError({
        statusCode: 400,
        message: '일치하는 정보가 없습니다.'
      })
    }

    return {
      statusCode: 200,
      ADMIN_ID: userInfo.ADMIN_ID
    }

  } catch (error) {
    console.error('아이디 찾기 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})