import { findInfo } from '../../../db/queries/Admin/admin.queries';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    // ID로 사용자 정보 조회
    const userInfo = await findInfo('ADMIN_ID', id);
    if (!userInfo) {
      return new Response('일치하는 정보가 없습니다.', { status: 200 });
    }

    // 입력된 정보와 사용자 정보 비교
    if (
      userInfo.ADMIN_NM !== name ||
      userInfo.ADMIN_EMAIL !== email ||
      userInfo.ADMIN_PHONE !== phone
    ) {
      return new Response('일치하는 정보가 없습니다.', { status: 200 });
    }

    // 성공적으로 확인되었음을 반환
    return new Response('SUCCESS', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('서버 에러', { status: 500 });
  }
}
