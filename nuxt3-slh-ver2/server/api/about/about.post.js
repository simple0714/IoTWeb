import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { sort, title, subTitle, icon } = await readBody(event)
    
    console.log('소개글 등록 요청:', { sort, title, subTitle, icon })

    // 입력값 검증
    if (!title || !subTitle || !icon) {
      throw createError({
        statusCode: 400,
        message: '모든 필드를 입력해주세요.'
      })
    }
    // 최대 SORT 값 조회
    const maxSort = await db.ABOUT.max('SORT') || 0
    
    // 소개글 등록
    const aboutInfo = await db.ABOUT.create({
      SORT: maxSort + 1,
      TITLE: title,
      SUB_TITLE: subTitle,
      ICON: icon,
      CREATE_AT: new Date()
    })

    if (!aboutInfo) {
      throw createError({
        statusCode: 400,
        message: '저장에 실패하였습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: aboutInfo
    }

  } catch (error) {
    console.error('소개글 등록 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})