const Contact = require('../../queries/Contact');
const Service = require('../../queries/Service');
const LMS = require('../../utils/LMS');

exports.postContact = async (req, res) => {
  // param : 조직명, 담당자명, 연락처, 이메일, 서비스[오브젝트], 예산, 일정, 설명
  const { orgNm, name, phone, email, service, budget, schedule, description } = req.body;
  let serviceCd = '';
  if(Array.isArray(service)) serviceCd = { serviceCd: service };
  else return res.status(400).json({ error: "서비스 코드가 올바르지 않습니다." });
  try{
    const contact = await Contact.contactCreate({orgNm, name, phone, email, serviceCd, budget, schedule, description});
    if(!contact) return res.status(400).json({ error: "저장에 실패하였습니다." });
    const ServiceNm = await Service.serviceFind(service);
    if(!ServiceNm) console.log('서비스명 조회에 실패하였습니다.');
    const postLMS = LMS.sendLms(orgNm, name, phone, email, ServiceNm, budget, schedule, description);
    res.status(200).json({dataInfo: contact});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getContactFindList = async (req, res) => {
  const { page = 1 , size = 50, userNm, phone, email } = req.query;
  try {
    const List = await Contact.contactFindList(parseInt(page), parseInt(size), userNm, phone, email);
    if(!List) return res.status(400).json({ error: "조회에 실패하였습니다.", message: "조회된 데이터가 없습니다." });
    res.status(200).json({dataInfo: List});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getContactFindOne = async (req, res) => {
  const { id } = req.query;
  try {
    const findOne = await Contact.contactFindOne(id);
    if(!findOne) return res.status(400).json({ error: "조회에 실패하였습니다." });
    res.status(200).json({dataInfo: findOne});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}