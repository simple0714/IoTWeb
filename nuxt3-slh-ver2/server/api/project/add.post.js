import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { title, subTitle, projectImg, stack, projectInfo, files } = await readBody(event)
    
    console.log('프로젝트 정보 추가 요청:', { title, subTitle, projectImg, stack, projectInfo, files })

    // 입력값 검증
    if (!title || !projectImg || !stack || !projectInfo) {
      throw createError({
        statusCode: 400,
        message: '필수 항목을 입력해주세요.'
      })
    }

    // stack 배열 검증
    if (!Array.isArray(stack)) {
      throw createError({
        statusCode: 400,
        message: '서비스 코드가 올바르지 않습니다.'
      })
    }

    const stackObj = { stack: stack }

    // 트랜잭션 시작
    const t = await db.sequelize.transaction()

    try {
      // 최대 PROJECT_NB 조회
      const [result] = await db.sequelize.query(
        'SELECT MAX(PROJECT_NB) AS PROJECT_NB FROM PROJECT',
        { type: db.sequelize.QueryTypes.SELECT, transaction: t }
      )
      
      const projectNb = result.PROJECT_NB ? result.PROJECT_NB + 1 : 1

      // 프로젝트 정보 추가
      const project = await db.PROJECT.create({
        PROJECT_NB: projectNb,
        TITLE: title,
        SUB_TITLE: subTitle,
        PROJECT_IMG: projectImg,
        STACK: stackObj,
        PROJECT_INFO: projectInfo,
        CREATE_AT: new Date()
      }, { transaction: t })

      // 프로젝트 이미지 추가
      if (files && files.length > 0) {
        await db.PROJECT_IMG.bulkCreate(
          files.map((file, index) => ({
            PROJECT_NB: projectNb,
            PROJECT_IMG: file.url,
            SORT: index + 1
          })),
          { transaction: t }
        )
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
    console.error('프로젝트 정보 추가 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})