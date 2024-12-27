import db from '../../models'

export default defineEventHandler(async (event) => {
  try {
    const { id, partnerNm, imgUrl, partnerUrl, sort, useYn } = await readBody(event)
    
    console.log('파트너 정보 수정 요청:', { id, partnerNm, imgUrl, partnerUrl, sort, useYn })

    // 입력값 검증
    if (!id || !partnerNm || !imgUrl) {
      throw createError({
        statusCode: 400,
        message: '필수 항목을 입력해주세요.'
      })
    }

    // 기존 파트너 정보 확인
    const currentPartner = await db.PARTNER.findOne({
      where: { ID: id }
    })

    if (!currentPartner) {
      throw createError({
        statusCode: 400,
        message: '협력사를 찾을 수 없습니다.'
      })
    }

    // 파트너 정보 수정
    await db.PARTNER.update({
      PARTNER_NM: partnerNm,
      PARTNER_IMG: imgUrl,
      PARTNER_URL: partnerUrl,
      SORT: sort,
      USE_YN: useYn,
      UPDATE_AT: new Date()
    }, {
      where: { ID: id }
    })

    // 수정된 정보 조회
    const updatedPartner = await db.PARTNER.findOne({
      where: { ID: id }
    })

    return {
      statusCode: 200,
      dataInfo: updatedPartner
    }

  } catch (error) {
    console.error('파트너 정보 수정 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})