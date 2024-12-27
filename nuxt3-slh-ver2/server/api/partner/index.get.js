import db from '../../models'
const Partner = db.PARTNER

export default defineEventHandler(async (event) => {
  try {
    const partnerData = await Partner.findAll({
      order: [['SORT', 'ASC']]
    })
    if (!partnerData) {
      throw new Error("파트너 데이터 조회에 실패하였습니다.")
    }
    return { dataInfo: partnerData }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})