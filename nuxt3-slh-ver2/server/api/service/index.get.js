import db from '../../models'
const Service = db.SERVICE

export default defineEventHandler(async (event) => {
  console.log('서비스 데이터 조회 시작')

  try {
    const query = getQuery(event)
    const useYn = query.useYn ?? 1
    
    console.log('서비스 데이터 조회 시작')
    
    const serviceList = await Service.findAll({
      where: { USE_YN: useYn }
    })
    
    if (!serviceList) {
      throw createError({
        statusCode: 400,
        message: '서비스 목록 조회 실패'
      })
    }

    return { dataInfo: serviceList }
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})