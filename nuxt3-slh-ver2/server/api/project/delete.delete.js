import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { projectNb } = getQuery(event)

    if (!projectNb) {
      throw createError({
        statusCode: 400,
        message: '프로젝트 번호가 필요합니다.'
      })
    }

    // 트랜잭션 시작
    const t = await db.sequelize.transaction()

    try {
      // 프로젝트 이미지 삭제
      await db.PROJECT_IMG.destroy({
        where: { PROJECT_NB: projectNb },
        transaction: t
      })

      // 프로젝트 정보 삭제
      const project = await db.PROJECT.destroy({
        where: { PROJECT_NB: projectNb },
        transaction: t
      })

      if (!project) {
        await t.rollback()
        throw createError({
          statusCode: 400,
          message: '프로젝트 정보 삭제에 실패하였습니다.'
        })
      }

      await t.commit()

      return {
        statusCode: 200,
        dataInfo: project
      }

    } catch (error) {
      await t.rollback()
      throw error
    }

  } catch (error) {
    console.error('프로젝트 삭제 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})