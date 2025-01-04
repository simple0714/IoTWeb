import { findInfo } from '../../../db/queries/Admin/admin.queries';

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    const userInfo = await findInfo('ADMIN_ID', id);
    if (userInfo) {
      return new Response('이미 존재하는 아이디입니다.', { status: 200 });
    }

    return new Response('사용 가능한 아이디입니다.', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('서버 에러', { status: 500 });
  }
}
