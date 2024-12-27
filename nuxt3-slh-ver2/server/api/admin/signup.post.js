import db from '../../models'
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    // POST 요청의 body 읽기
    const { id, pw, name, email, phone } = await readBody(event)
    
    console.log('회원가입 시도:', { id, name, email, phone })

    // 아이디 중복 체크
    const userInfo = await db.ADMIN_INFO.findOne({
      where: { ADMIN_ID: id }
    })
    
    if (userInfo) {
      throw createError({
        statusCode: 400,
        message: '이미 존재하는 아이디입니다.'
      })
    }

    // 이메일 중복 체크
    const emailInfo = await db.ADMIN_INFO.findOne({
      where: { ADMIN_EMAIL: email }
    })
    
    if (emailInfo) {
      throw createError({
        statusCode: 400,
        message: '이미 존재하는 이메일입니다.'
      })
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(pw, 10)

    // 회원가입 처리
    const result = await db.ADMIN_INFO.create({
      ADMIN_ID: id,
      ADMIN_PW: hashedPassword,
      ADMIN_NM: name,
      ADMIN_EMAIL: email,
      ADMIN_PHONE: phone
    })

    if (!result) {
      throw createError({
        statusCode: 400,
        message: '회원가입 실패'
      })
    }

    return {
      statusCode: 200,
      message: '회원가입 성공'
    }

  } catch (error) {
    console.error('회원가입 에러:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '서버 에러'
    })
  }
})