import { signUp } from '../../../db/queries/Admin/admin.queries';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, pw, name, email, phone } = body;

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(pw, 10);

    // 회원가입 처리
    const newUser = await signUp(id, hashedPassword, name, email, phone);
    if (!newUser) {
      return new Response('회원가입 실패', { status: 400 });
    }

    return new Response('회원가입 성공', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('서버 에러', { status: 500 });
  }
}
