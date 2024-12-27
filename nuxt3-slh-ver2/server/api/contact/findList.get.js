import db from '../../models'
import { Op } from 'sequelize'

export default defineEventHandler(async (event) => {
  try {
    const { page = 1, size = 50 } = getQuery(event)
    
    // 데이터 조회
    const { count, rows } = await db.CONTACT.findAndCountAll({
      attributes: [
        'ID',
        'USER_NM',
        'SERVICE_CD',
        'PROJECT_INFO',
        'BUDGET',
        'SCHEDULE',
        'CREATE_AT'
      ],
      order: [['CREATE_AT', 'DESC']]
    })

    if (!rows || rows.length === 0) {
      throw createError({
        statusCode: 400,
        message: '조회된 데이터가 없습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: {
        rows,
        count
      }
    }

  } catch (error) {
    console.error('문의 목록 조회 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})