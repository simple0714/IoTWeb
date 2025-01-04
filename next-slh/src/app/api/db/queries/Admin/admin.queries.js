import { ADMIN_INFO } from '../../models/ADMIN_INFO';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export const findInfo = async (div, param) => {
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
};

export const login = async (id, pw) => {
  try {
    const userInfo = await ADMIN_INFO.findOne({ where: { ADMIN_ID: id } });
    if (!userInfo) return false;

    const compare = await bcrypt.compare(pw, userInfo.ADMIN_PW);
    if (!compare) return false;

    return {
      dataInfo: {
        ADMIN_ID: userInfo.ADMIN_ID,
        ADMIN_NM: userInfo.ADMIN_NM,
        ADMIN_EMAIL: userInfo.ADMIN_EMAIL,
        ADMIN_PHONE: userInfo.ADMIN_PHONE,
        ROLE: userInfo.ROLE,
      },
      message: '로그인 성공',
    };
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const signUp = async (id, pw, name, email, phone) => {
  try {
    const newUser = await ADMIN_INFO.create({
      ADMIN_ID: id,
      ADMIN_PW: pw,
      ADMIN_NM: name,
      ADMIN_EMAIL: email,
      ADMIN_PHONE: phone,
      ROLE: 1, // 기본 역할 설정
    });

    return newUser || false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const findId = async (name, email) => {
    try {
        const userInfo = await ADMIN_INFO.findOne({
            attributes: ['ADMIN_ID'],
            where: {
            [Op.and]: [
                { ADMIN_NM: name },
                { ADMIN_EMAIL: email },
            ],
            },
        });

        return userInfo || false;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const changePw = async (id, pw) => {
  try {
    const result = await ADMIN_INFO.update(
      { ADMIN_PW: pw, UPDATE_AT: new Date() },
      { where: { ADMIN_ID: id } }
    );

    if (result[0] === 0) return false; // 업데이트된 행이 없으면 실패로 간주
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
