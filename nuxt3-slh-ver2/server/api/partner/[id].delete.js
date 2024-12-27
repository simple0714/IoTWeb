import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    console.log('파트너 정보 삭제 요청:', { id })

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '파트너 ID가 필요합니다.'
      })
    }

    // 파트너 정보 삭제
    const result = await db.PARTNER.destroy({
      where: { ID: id }
    })

    if (!result) {
      throw createError({
        statusCode: 400,
        message: '파트너 정보 삭제에 실패하였습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: result
    }

  } catch (error) {
    console.error('파트너 정보 삭제 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})