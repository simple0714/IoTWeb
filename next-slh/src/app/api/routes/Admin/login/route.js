import { login } from '../../../db/queries/Admin/admin.queries';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const pw = searchParams.get('pw');

    const userInfo = await login(id, pw);
    if (!userInfo) {
      return new Response('아이디 또는 비밀번호가 틀렸습니다.', { status: 400 });
    }

    return new Response(JSON.stringify(userInfo), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response('서버 에러', { status: 500 });
  }
}
