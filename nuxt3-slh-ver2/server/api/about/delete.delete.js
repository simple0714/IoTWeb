import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { id } = getQuery(event)
    
    console.log('소개글 삭제 요청:', { id })

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '삭제할 ID가 필요합니다.'
      })
    }

    // 소개글 삭제
    const result = await db.ABOUT.destroy({
      where: { ID: id }
    })

    if (!result) {
      throw createError({
        statusCode: 400,
        message: '삭제에 실패하였습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: { id }  // 삭제된 ID 반환
    }

  } catch (error) {
    console.error('소개글 삭제 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})