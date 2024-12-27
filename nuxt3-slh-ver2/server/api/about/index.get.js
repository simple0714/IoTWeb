import db from '../../models'
const About = db.ABOUT

export default defineEventHandler(async (event) => {
  try {
    const aboutInfo = await About.findAll({
      order: [['SORT', 'ASC']]
    })
    if (!aboutInfo) {
      throw new Error("소개글 조회에 실패하였습니다.")
    }
    return { dataInfo: aboutInfo }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})