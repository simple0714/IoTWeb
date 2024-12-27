const Partner = require('../../queries/Partner');

exports.getPartnerList = async (req, res) => {
  const { page = 1 , size = 50, name, useYn = 1 } = req.query;
  try {
    const partnerList = await Partner.getPartnerList(parseInt(page), parseInt(size), name, useYn);
    if(!partnerList) return res.status(400).json({ error: "파트너 리스트 조회에 실패하였습니다." });
    res.status(200).json({ dataInfo: partnerList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addPartnerInfo = async (req, res) => {
  const {partnerNm, imgUrl, partnerUrl} = req.body;
  try {
    const result = await Partner.postPartnerInfo(partnerNm, imgUrl, partnerUrl);
    if(!result) return res.status(400).json({ error: "파트너 정보 추가에 실패하였습니다." });
    res.status(200).json({ dataInfo: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updatePartnerInfo = async (req, res) => {
  const {id, partnerNm, imgUrl, partnerUrl, sort, useYn} = req.body;
  try {
    const result = await Partner.updatePartnerInfo(id, partnerNm, imgUrl, partnerUrl, sort, useYn);
    if(!result) return res.status(400).json({ error: "파트너 정보 수정에 실패하였습니다." });
    res.status(200).json({ dataInfo: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deletePartnerInfo = async (req, res) => {
  const {id} = req.query;
  try {
    const result = await Partner.deletePartnerInfo(id);
    if(!result) return res.status(400).json({ error: "파트너 정보 삭제에 실패하였습니다." });
    res.status(200).json({ dataInfo: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}