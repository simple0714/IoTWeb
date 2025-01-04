import { findId } from '../../../db/queries/Admin/admin.queries';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    // 이름과 이메일을 기반으로 아이디 찾기
    const userInfo = await findId(name, email);
    if (!userInfo) {
      return new Response('일치하는 정보가 없습니다.', { status: 200 });
    }

    return new Response(JSON.stringify(userInfo), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('서버 에러', { status: 500 });
  }
}
