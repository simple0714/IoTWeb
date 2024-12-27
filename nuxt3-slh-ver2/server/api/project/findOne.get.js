import db from '../../models'

const Project = db.PROJECT
const ProjectFile = db.PROJECT_IMG

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const projectNb = parseInt(query.projectNb)

    // 프로젝트 정보와 이미지를 함께 조회
    const projectInfo = await db.PROJECT.findOne({ 
      where: { PROJECT_NB: projectNb },
      include: [{
        model: db.PROJECT_IMG,
        required: false,  // LEFT JOIN
        order: [['SORT', 'ASC']]
      }]
    })
    if (!projectInfo) {
      throw createError({
        statusCode: 400,
        message: "프로젝트 정보조회에 실패하였습니다."
      })
    }

    // 성공 응답
    return {
      dataInfo: { 
        projectInfo, 
        projectFiles: projectInfo.PROJECT_IMGs }
    }
  } catch (error) {
    console.error("프로젝트 상세 조회 에러:", error)
    console.error("db 상태:", db)
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})

