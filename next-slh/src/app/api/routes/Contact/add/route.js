import { contactCreate } from '../../../db/queries/Contact/contact.queries';
import { getServiceInfo } from '../../../db/queries/Service/service.queries';
import { sendLms } from '../../../utils/LMS';

export async function POST(req) {
  try {
    // 요청 본문(body)에서 데이터 추출
    const { orgNm, name, phone, email, service, budget, schedule, description } = await req.json();

    let serviceCd = '';
    if (Array.isArray(service)) {
      serviceCd = { serviceCd: service };
    } else {
      return new Response(
        JSON.stringify({ error: '서비스 코드가 올바르지 않습니다.' }),
        { status: 400 }
      );
    }

    // 연락처 정보 저장
    const contact = await contactCreate({ orgNm, name, phone, email, serviceCd, budget, schedule, description });

    if (!contact) {
      return new Response(
        JSON.stringify({ error: '저장에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    // 서비스명 조회
    const serviceNm = await getServiceInfo(service);
    if (!serviceNm) {
      console.log('서비스명 조회에 실패하였습니다.');
    }

    // LMS 전송
    const postLMS = sendLms(orgNm, name, phone, email, serviceNm, budget, schedule, description);

    return new Response(
      JSON.stringify({ dataInfo: contact }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
