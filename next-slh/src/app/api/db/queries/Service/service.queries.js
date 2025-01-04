import { SERVICE } from '../../models/SERVICE';

const getServiceInfo = async (useYn) => {
  try {
    const serviceList = await SERVICE.findAndCountAll({
      where: {
        USE_YN: useYn
      },
      order: [['SORT', 'ASC']],
    });

    if (serviceList.count === 0) return false;

    return serviceList.rows; // `rows`는 실제 데이터 배열을 포함합니다.
  } catch (error) {
    console.error('서비스 목록 조회 실패', error);
    return false;
  }
};

export { getServiceInfo };
