import { changePw } from '../../../db/queries/Admin/admin.queries';
import bcrypt from 'bcrypt';

export async function PUT(req) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const pw = url.searchParams.get('pw');

        if (!id || !pw) {
            return new Response('id와 pw가 필요합니다.', { status: 400 });
        }

        console.log('ID:', id);
        console.log('PW:', pw);

        const hashedPassword = await bcrypt.hash(pw, 10);
        const isChanged = await changePw(id, hashedPassword);

        if (!isChanged) {
            return new Response('비밀번호 변경 실패', { status: 400 });
        }

        return new Response('비밀번호 변경 성공', { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('서버 에러', { status: 500 });
    }
}
  
