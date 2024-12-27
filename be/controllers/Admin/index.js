const Admin = require('../../queries/Admin');
const bcrypt = require('bcrypt');

exports.postSignUp = async (req, res) => {
  const { id, pw, name, email, phone } = req.body;
  console.log( id, pw, name, email, phone )
  try {
    const userInfo = await Admin.findInfo('ADMIN_ID',id)
    if(userInfo) return res.status(400).send('이미 존재하는 아이디입니다.');
    const EmailInfo = await Admin.findInfo('ADMIN_EMAIL',email)
    if(EmailInfo) return res.status(400).send('이미 존재하는 이메일입니다.');
    const hashedPassword = await bcrypt.hash(pw, 10);
    const signUp = await Admin.signUp(id, hashedPassword, name, email, phone);
    if(!signUp) return res.status(400).send('회원가입 실패');
    return res.status(200).send('회원가입 성공');
  } catch (error) {
    console.error(error);
    return res.status(500).send('서버 에러');
  }
}

exports.getLoginInfo = async (req, res) => {
  const { id, pw } = req.query;
  console.log(id,pw)
  try {
    const userInfo = await Admin.login(id, pw);
    if(!userInfo) return res.status(400).send('아이디 또는 비밀번호가 틀렸습니다.');
    return res.status(200).send(userInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).send('서버 에러');
  }
}

exports.getFindId = async (req, res) => {
  const { name, email } = req.query;
  console.log(name,email)
  try {
    const userInfo = await Admin.findId(name, email);
    if(!userInfo) return res.status(400).send('일치하는 정보가 없습니다.');
    return res.status(200).send(userInfo);
  } catch (error) {
    console.error(error);
    return res.status(500).send('서버 에러');
  }
}

exports.getFindPw = async (req, res) => { 
  const { id, name, email, phone } = req.query;
  try {
    const userInfo = await Admin.findInfo('ADMIN_ID',id);
    if(!userInfo) return res.status(400).send('일치하는 정보가 없습니다.');
    if(userInfo.ADMIN_NM !== name || userInfo.ADMIN_EMAIL !== email || userInfo.ADMIN_PHONE !== phone) return res.status(400).send('일치하는 정보가 없습니다.');
    // bcrypt 를 이용하여 복호화
    return res.status(200).send('SUCCESS');
  } catch (error) {
    console.error(error);
    return res.status(500).send('서버 에러');
  }
}

exports.putChangePw = async (req, res) => { 
  const { id, pw } = req.query;
  try {
    const hashedPassword = await bcrypt.hash(pw, 10);
    const changePw = await Admin.changePw(id, hashedPassword);
    if(!changePw) return res.status(400).send('비밀번호 변경 실패');
    return res.status(200).send('비밀번호 변경 성공');
  } catch (error) {
    console.error(error);
    return res.status(500).send('서버 에러');
  }
}