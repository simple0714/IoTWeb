import { getContactFindOne } from '../../../db/queries/Contact/contact.queries';

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const contact = await getContactFindOne(id);
    if (!contact) {
      return new Response(JSON.stringify({ error: '조회에 실패하였습니다.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ dataInfo: contact }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
