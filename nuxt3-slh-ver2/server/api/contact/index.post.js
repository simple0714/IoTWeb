import db from '../../models'

const Contact = db.CONTACT
const Service = db.SERVICE

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 가져오기
    const body = await readBody(event)
    const { orgNm, name, phone, email, service, budget, schedule, description } = body

    // 서비스 코드 유효성 검사
    let serviceCd = ''
    if (Array.isArray(service)) {
      serviceCd = { serviceCd: service }
    } else {
      throw createError({
        statusCode: 400,
        message: '서비스 코드가 올바르지 않습니다.'
      })
    }

    // 연락처 데이터 생성
    const contact = await Contact.create({
      ORG_NM: orgNm,
      USER_NM: name,
      PHONE: phone,
      EMAIL: email,
      SERVICE_CD: serviceCd,
      BUDGET: budget,
      SCHEDULE: schedule,
      PROJECT_INFO: description
    })

    if (!contact) {
      throw createError({
        statusCode: 400,
        message: '저장에 실패하였습니다.'
      })
    }

    // 서비스명 조회
    const ServiceNm = await Service.findAll({
      where: {
        SERVICE_CD: service
      },
      attributes: ['SERVICE_NM']
    })

    if (!ServiceNm) {
      console.log('서비스명 조회에 실패하였습니다.')
    }

    // 성공 응답
    return {
      dataInfo: contact
    }

  } catch (error) {
    console.error('Contact 생성 오류:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 오류가 발생했습니다.'
    })
  }
})