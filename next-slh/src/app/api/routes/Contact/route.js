import { getContactInfo } from '../../db/queries/Contact/contact.queries'; // 쿼리 파일에서 가져옵니다.

export const GET = async (req) => {
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    
    const page = queryParams.get('page') || 1;
    const size = queryParams.get('size') || 50;
    const userNm = queryParams.get('userNm') || '';
    const phone = queryParams.get('phone') || '';
    const email = queryParams.get('email') || '';


  try {
    const pageNumber = parseInt(page, 10) || 1;
    const sizeNumber = parseInt(size, 10) || 50;
    
    const list = await getContactInfo(pageNumber, sizeNumber, userNm, phone, email);
    if (!list) {
      return new Response(
        JSON.stringify({ error: '조회에 실패하였습니다.', message: '조회된 데이터가 없습니다.' }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ dataInfo: list }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
