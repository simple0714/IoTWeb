const { ADMIN_INFO, sequelize } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const signUp = async (id, pw, name, email, phone) => {
  try {
    const signUp = await ADMIN_INFO.create({
      ADMIN_ID:id,
      ADMIN_PW:pw,
      ADMIN_NM:name, 
      ADMIN_EMAIL:email, 
      ADMIN_PHONE:phone,
      ROLE:1
    });

    if (!signUp) return false;
    return {
      dataInfo:signUp,
      message:"회원가입 성공"
    };
  } catch (error) {
    console.error(error);
    return false;
  }
}

const findInfo = async (div,param) => {
  try {
    const where = {};
    where[div] = param;
    const userInfo = await ADMIN_INFO.findOne({ where });
    if (!userInfo) return false;
    return userInfo;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const login = async (id, pw) => {
  try {
    const userInfo = await ADMIN_INFO.findOne({ where: { ADMIN_ID: id } });
    if (!userInfo) return false;
    const compare = await bcrypt.compare(pw, userInfo.ADMIN_PW);
    if (!compare) return false;
    return {dataInfo:{ADMIN_ID:userInfo.ADMIN_ID,
                      ADMIN_NM:userInfo.ADMIN_NM, 
                      ADMIN_EMAIL:userInfo.ADMIN_EMAIL, 
                      ADMIN_PHONE:userInfo.ADMIN_PHONE, 
                      ROLE:userInfo.ROLE},
            message:"로그인 성공"};
  } catch (error) {
    console.error(error);
    return false;
  }
}

const findId = async (name, email) => {
  try {
    const userInfo = await ADMIN_INFO.findOne({ attributes: ['ADMIN_ID'],  where: { [Op.and]: [{ ADMIN_NM: name }, { ADMIN_EMAIL: email }] }})
    if (!userInfo) return false;
    return userInfo;
  } catch (error) {
    return false;
  }
}

const changePw = async (id, pw) => {
  try {
    const changePw = await ADMIN_INFO.update({ ADMIN_PW: pw, UPDATE_AT: new Date() }, { where: { ADMIN_ID: id } });
    if (!changePw) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  signUp,
  findInfo,
  login,
  findId,
  changePw,
}

