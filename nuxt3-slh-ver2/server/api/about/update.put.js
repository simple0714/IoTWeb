import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { id, sort, title, subTitle, icon } = await readBody(event)
    
    console.log('소개글 수정 요청:', { id, sort, title, subTitle, icon })

    // 입력값 검증
    if (!id || !title || !subTitle) {
      throw createError({
        statusCode: 400,
        message: '필수 항목을 입력해주세요.'
      })
    }

    // 소개글 수정
    const updateData = {
      TITLE: title,
      SUB_TITLE: subTitle,
      UPDATE_AT: new Date()
    }

    // sort나 icon이 있는 경우에만 추가
    if (sort) updateData.SORT = sort
    if (icon) updateData.ICON = icon

    const [updated] = await db.ABOUT.update(updateData, {
      where: { ID: id }
    })

    if (!updated) {
      throw createError({
        statusCode: 400,
        message: '수정에 실패하였습니다.'
      })
    }

    // 수정된 데이터 조회
    const aboutInfo = await db.ABOUT.findByPk(id)

    return {
      statusCode: 200,
      dataInfo: aboutInfo
    }

  } catch (error) {
    console.error('소개글 수정 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})