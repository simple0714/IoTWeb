import { findOnePartnerInfo } from '../../../db/queries/Partner/partner.queries';

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const partnerInfo = await findOnePartnerInfo({ id });

    if (!partnerInfo) {
      return new Response(
        JSON.stringify({ error: '협력사 조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ dataInfo: partnerInfo }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
