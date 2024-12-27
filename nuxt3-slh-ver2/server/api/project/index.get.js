import db from '../../models'
const Project = db.PROJECT

export default defineEventHandler(async (event) => {
  // console.log('프로젝트 데이터 조회 시작')  
  try {
    const { page = 1, size = 50, title } = getQuery(event)
    
    const where = {}
    if (title) {
      where.TITLE = {
        [db.Sequelize.Op.like]: `%${title}%`
      }
    }

    const projectInfo = await Project.findAndCountAll({
      where,
      limit: parseInt(size),
      offset: (parseInt(page) - 1) * parseInt(size),
      order: [['PROJECT_NB', 'ASC']]
    })

    if (!projectInfo) {
      throw createError({
        statusCode: 400,
        message: "프로젝트 정보조회에 실패하였습니다."
      })
    }

    return {
      dataInfo: {
        count: projectInfo.count,
        currentPage: parseInt(page),
        projectList: projectInfo.rows
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})