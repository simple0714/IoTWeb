import { getServiceInfo } from '../../db/queries/Service/service.queries';

export async function GET(req) {
  // URLSearchParams를 사용하여 쿼리 파라미터 추출
  const queryParams = new URLSearchParams(req.url.split('?')[1]);
  const useYn = queryParams.get('useYn') || 1; // 기본값 설정

  try {
    const serviceList = await getServiceInfo(useYn);

    if (!serviceList || serviceList.length === 0) {
      return new Response(
        JSON.stringify({ error: '서비스 목록 조회 실패' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ dataInfo: serviceList }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
