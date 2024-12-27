const Service = require('../../queries/Service');

exports.getServiceListAll = async (req, res) => {
  try{
    const {useYn = 1} = req.query;
    const serviceList = await Service.getServiceListAll(useYn);
    if(!serviceList) return res.status(400).json({ error: '서비스 목록 조회 실패' });
    res.status(200).json({ dataInfo: serviceList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getServiceFindOne = async (req, res) => {
  try{
    const {serviceCd} = req.query;
    const serviceInfo = await Service.getServiceFindOne(serviceCd);
    if(!serviceInfo) return res.status(400).json({ error: '서비스 정보 조회에 실패하였습니다.' });
    res.status(200).json({ dataInfo: serviceInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.postServiceInfo = async (req, res) => {
  try{
    const { serviceNm } = req.body;
    const serviceInfo = await Service.postServiceInfo(serviceNm);
    if(!serviceInfo) return res.status(400).json({ error: '서비스 정보 추가에 실패하였습니다.' });
    res.status(200).json({ dataInfo: serviceInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateServiceInfo = async (req, res) => {
  try{
    const { serviceCd, serviceNm, sort, useYn } = req.body;
    const serviceInfo = await Service.updateServiceInfo(serviceCd, serviceNm, sort, useYn);
    if(!serviceInfo) return res.status(400).json({ error: '서비스 정보 수정에 실패하였습니다.' });
    res.status(200).json({ dataInfo: serviceInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteServiceInfo = async (req, res) => {
  try{
    const { serviceCd } = req.query;
    const serviceInfo = await Service.deleteServiceInfo(serviceCd);
    if(!serviceInfo) return res.status(400).json({ error: '서비스 정보 삭제에 실패하였습니다.' });
    res.status(200).json({ dataInfo: serviceInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
