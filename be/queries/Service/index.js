const { SERVICE, sequelize } = require('../../models');
const { Op } = require('sequelize');

const getServiceListAll = async (useYn) => {
  try{
    const serviceList = await SERVICE.findAndCountAll({
      where: {
        USE_YN: useYn
      },
      order: [['SORT', 'ASC']]
    });
    if(serviceList.count === 0) return false;
    return serviceList;
  } catch (error) {
    console.error("서비스 목록 조회 실패");
    return false;
  }
};  

const getServiceFindOne = async (serviceCd) => {
  try{
    const serviceInfo = await SERVICE.findOne({ where: { SERVICE_CD: serviceCd } });
    if(!serviceInfo) return false;
    return serviceInfo;
  } catch (error) {
    console.error("서비스 정보 조회 실패");
    return false;
  }
};

const postServiceInfo = async (serviceNm) => {
  try{
    const result = await sequelize.query(`SELECT MAX(SORT) SORT, MAX(SERVICE_CD) SERVICE_CD FROM SERVICE `, { type: sequelize.QueryTypes.SELECT });
    const maxSort = result[0].SORT ? result[0].SORT + 1 : 1;
    const maxServiceCd = result[0].SERVICE_CD ? (parseInt((result[0].SERVICE_CD).slice(-2))+1).toString().padStart(2, '0') : '01';
    const serviceInfo = await SERVICE.create({ 
      SERVICE_CD: "SRC"+maxServiceCd,
      SERVICE_NM: serviceNm,
      SORT: maxSort 
    });
    if(!serviceInfo) return false;
    return serviceInfo;
  } catch (error) {
    console.error("서비스 정보 추가 실패");
    return false;
  }
};

const updateServiceInfo = async (serviceCd, serviceNm, newSort, useYn) => {
  const t = await sequelize.transaction();
  try {
    // 현재 서비스의 정보를 가져옵니다.
    const currentService = await SERVICE.findOne({ 
      where: { SERVICE_CD: serviceCd },
      transaction: t
    });

    if (!currentService) {
      await t.rollback();
      console.error("서비스를 찾을 수 없습니다.");
      return false;
    }

    const oldSort = currentService.SORT;

    // 먼저 변경하려는 서비스의 SORT를 업데이트합니다.
    await SERVICE.update(
      { SORT: newSort, SERVICE_NM: serviceNm, USE_YN: useYn, UPDATE_AT: new Date() },
      { where: { SERVICE_CD: serviceCd }, transaction: t }
    );

    // newSort 이후의 서비스들의 SORT를 newSort + 1부터 순차적으로 증가시킵니다.
    const servicesAfterNewSort = await SERVICE.findAll({
      where: { 
        SORT: { [Op.gte]: newSort },
        SERVICE_CD: { [Op.ne]: serviceCd }
      },
      order: [['SORT', 'ASC']],
      transaction: t
    });

    let updateSort = parseInt(newSort) + 1;
    for (const service of servicesAfterNewSort) {
      await SERVICE.update(
        { SORT: updateSort },
        { where: { SERVICE_CD: service.SERVICE_CD }, transaction: t }
      );
      updateSort++;
    }

    await t.commit();
    return currentService;
  } catch (error) {
    await t.rollback();
    console.error("서비스 정보 수정 실패:", error);
    return false;
  }
};

const deleteServiceInfo = async (serviceCd) => {
  try{
    const serviceInfo = await SERVICE.destroy({ where: { SERVICE_CD: serviceCd } });
    if(!serviceInfo) return false;
    return serviceInfo;
  } catch (error) {
    console.error("서비스 정보 삭제 실패");
    return false;
  }
};

const serviceFind = async (service) => {
  try {
    const services = await SERVICE.findAll({
      attributes: ['SERVICE_NM'],
      where: {
        SERVICE_CD: {
          [Op.in]: service
        }
      }
    });

    if (services.length === 0) return false;
    const serviceNames = services.map(s => s.SERVICE_NM).join(', ');
    return serviceNames;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  getServiceListAll,
  getServiceFindOne,
  postServiceInfo,
  updateServiceInfo,
  deleteServiceInfo,
  serviceFind,
};
