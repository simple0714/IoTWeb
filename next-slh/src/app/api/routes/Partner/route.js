import { getPartnerInfo, postPartnerInfo, updatePartnerInfo, deletePartnerInfo } from '../../db/queries/Partner/partner.queries';

export async function GET(req) {
  const { page = 1, size = 50, name = '', useYn = 1 } = req.nextUrl.searchParams;

  try {
    // page와 size를 정수로 변환
    const pageNumber = parseInt(page, 10) || 1;
    const sizeNumber = parseInt(size, 10) || 50;

    // 파트너 정보 조회
    const partnerList = await getPartnerInfo(pageNumber, sizeNumber, name, useYn);

    if (!partnerList || partnerList.length === 0) {
      return new Response(
        JSON.stringify({ error: '파트너 리스트 조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ dataInfo: partnerList }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  const { partnerNm, imgUrl, partnerUrl, sort } = await req.json();

  try {
    const result = await postPartnerInfo(partnerNm, imgUrl, partnerUrl, sort);
    if (!result) return new Response(JSON.stringify({ error: "파트너 정보 추가에 실패하였습니다." }), { status: 400 });
    return new Response(JSON.stringify({ dataInfo: result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  const { id, partnerNm, imgUrl, partnerUrl, sort, useYn } = await req.json();
  try {
    const result = await updatePartnerInfo(id, partnerNm, imgUrl, partnerUrl, sort, useYn);
    if (!result) return new Response(JSON.stringify({ error: "파트너 정보 수정에 실패하였습니다." }), { status: 400 });
    return new Response(JSON.stringify({ dataInfo: result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  try {
    const result = await deletePartnerInfo(id);
    if (!result) return new Response(JSON.stringify({ error: "파트너 정보 삭제에 실패하였습니다." }), { status: 400 });
    return new Response(JSON.stringify({ dataInfo: result }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
