import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { projectNb, title, subTitle, projectImg, stack, projectInfo, files } = await readBody(event)
    
    console.log('프로젝트 정보 수정 요청:', { projectNb, title, subTitle, projectImg, stack, projectInfo, files })

    // 입력값 검증
    if (!projectNb || !title || !projectImg || !stack || !projectInfo) {
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
      // 프로젝트 정보 수정
      const project = await db.PROJECT.update({
        TITLE: title,
        SUB_TITLE: subTitle,
        PROJECT_IMG: projectImg,
        STACK: stackObj,
        PROJECT_INFO: projectInfo,
        UPDATE_AT: new Date()
      }, {
        where: { PROJECT_NB: projectNb },
        transaction: t
      })

      if (!project) {
        await t.rollback()
        throw createError({
          statusCode: 400,
          message: '프로젝트 정보 수정에 실패하였습니다.'
        })
      }

      // 기존 파일 조회
      const existingFiles = await db.PROJECT_IMG.findAll({
        where: { PROJECT_NB: projectNb },
        attributes: ['SORT', 'PROJECT_IMG'],
        transaction: t
      })

      const existingFileMap = new Map(existingFiles.map(file => [file.SORT, file.PROJECT_IMG]))
      const newFileMap = new Map(files.map(file => [file.sort, file.url]))

      // 삭제할 파일 찾기
      const filesToDelete = existingFiles.filter(file => !newFileMap.has(file.SORT))

      // 파일 삭제
      if (filesToDelete.length > 0) {
        await db.PROJECT_IMG.destroy({
          where: {
            PROJECT_NB: projectNb,
            SORT: filesToDelete.map(file => file.SORT)
          },
          transaction: t
        })
      }

      // 업데이트할 파일
      const filesToUpdate = files.filter(file => 
        existingFileMap.has(file.sort) && existingFileMap.get(file.sort) !== file.url
      )

      // 새로 추가할 파일
      const filesToAdd = files.filter(file => !existingFileMap.has(file.sort))

      // 파일 업데이트
      for (const file of filesToUpdate) {
        const updated = await db.PROJECT_IMG.update(
          { PROJECT_IMG: file.url },
          {
            where: {
              PROJECT_NB: projectNb,
              SORT: file.sort
            },
            transaction: t
          }
        )
        if (!updated) {
          await t.rollback()
          throw createError({
            statusCode: 400,
            message: '파일 업데이트에 실패하였습니다.'
          })
        }
      }

      // 새 파일 추가
      if (filesToAdd.length > 0) {
        const created = await db.PROJECT_IMG.bulkCreate(
          filesToAdd.map(file => ({
            PROJECT_NB: projectNb,
            PROJECT_IMG: file.url,
            SORT: file.sort
          })),
          { transaction: t }
        )
        if (!created) {
          await t.rollback()
          throw createError({
            statusCode: 400,
            message: '새 파일 추가에 실패하였습니다.'
          })
        }
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
    console.error('프로젝트 정보 수정 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})