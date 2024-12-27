import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id') || '1'
    
    console.log('소개글 단일 조회 요청:', { id })

    const aboutInfo = await db.ABOUT.findOne({
      where: { ID: id }
    })

    if (!aboutInfo) {
      throw createError({
        statusCode: 400,
        message: '조회에 실패하였습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: aboutInfo
    }

  } catch (error) {
    console.error('소개글 조회 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})