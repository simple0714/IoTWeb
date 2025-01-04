import { findInfo } from '../../../db/queries/Admin/admin.queries';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    const userInfo = await findInfo('ADMIN_EMAIL', email);
    if (userInfo) {
      return new Response('이미 존재하는 이메일입니다.', { status: 200 });
    }

    return new Response('사용 가능한 이메일입니다.', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('서버 에러', { status: 500 });
  }
}
