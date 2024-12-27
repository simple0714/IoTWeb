import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { id } = getQuery(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'ID가 필요합니다.'
      })
    }

    const contact = await db.CONTACT.findOne({
      where: { ID: id },
      attributes: [
        'ID',
        'ORG_NM',
        'USER_NM',
        'PHONE',
        'EMAIL',
        'SERVICE_CD',
        'BUDGET',
        'SCHEDULE',
        'PROJECT_INFO',
        'CREATE_AT'
      ]
    })

    if (!contact) {
      throw createError({
        statusCode: 400,
        message: '문의 정보를 찾을 수 없습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: contact
    }

  } catch (error) {
    console.error('문의 상세 조회 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})