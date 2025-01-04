import { findOneAboutInfo } from '../../../db/queries/About/about.queries';

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const aboutInfo = await findOneAboutInfo({ id });

    if (!aboutInfo) {
      return new Response(
        JSON.stringify({ error: '소개글 조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ dataInfo: aboutInfo }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
