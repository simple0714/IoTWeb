import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { partnerNm, imgUrl, partnerUrl } = await readBody(event)
    
    console.log('파트너 정보 추가 요청:', { partnerNm, imgUrl, partnerUrl })

    // 입력값 검증
    if (!partnerNm || !imgUrl) {
      throw createError({
        statusCode: 400,
        message: '필수 항목을 입력해주세요.'
      })
    }

    // 최대 SORT 값 조회
    const sortItem = await db.PARTNER.findOne({
      attributes: ['SORT'],
      order: [['SORT', 'DESC']]
    })
    
    const sort = sortItem ? parseInt(sortItem.SORT) + 1 : 1

    // 파트너 정보 추가
    const result = await db.PARTNER.create({
      PARTNER_NM: partnerNm,
      PARTNER_IMG: imgUrl,
      PARTNER_URL: partnerUrl,
      SORT: sort,
      USE_YN: 1,
      CREATE_AT: new Date()
    })

    if (!result) {
      throw createError({
        statusCode: 400,
        message: '파트너 정보 추가에 실패하였습니다.'
      })
    }

    return {
      statusCode: 200,
      dataInfo: result
    }

  } catch (error) {
    console.error('파트너 정보 추가 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})