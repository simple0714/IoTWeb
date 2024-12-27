import db from '../../models'
const Stack = db.STACK

export default defineEventHandler(async (event) => {
  try {
    const stacks = await Stack.findAll()
    
    if (!stacks) {
      throw createError({
        statusCode: 400,
        message: "스택정보 조회에 실패하였습니다."
      })
    }

    return stacks  // dataInfo 래핑 없이 직접 반환

  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
})