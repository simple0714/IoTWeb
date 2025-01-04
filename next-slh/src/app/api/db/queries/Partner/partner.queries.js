import { PARTNER, sequelize } from '../../models/PARTNER';
import { Op } from 'sequelize';

export const getPartnerInfo = async (page, size, name, useYn) => {
  try {
    let where = { USE_YN: useYn };
    if (name) {
      where = {
        ...where,
        PARTNER_NM: {
          [Op.like]: `%${name}%`,
        },
      };
    }

    const partnerList = await PARTNER.findAll({
      where,
      order: [
        ['SORT', 'ASC'],
        ['ID', 'ASC'],
        ['CREATE_AT', 'DESC'],
      ],
      offset: (page - 1) * size,
      limit: size,
    });

    if (partnerList.length === 0) return false;

    return partnerList;
  } catch (error) {
    console.error("협력사 리스트 조회 실패", error);
    return false;
  }
};

export const findOnePartnerInfo = async ({ id }) => {
  try {
    const partner = await PARTNER.findOne({
      where: { ID: id },
    });

    if (!partner) {
      return false;
    }

    return partner;
  } catch (error) {
    console.error('협력사 조회 실패', error);
    return false;
  }
};

export const postPartnerInfo = async (partnerNm, imgUrl, partnerUrl, sort) => {
  try {
    const sortItem = await PARTNER.findOne({
      attributes: ['SORT'],
      order: [['SORT', 'DESC'],['CREATE_AT', 'DESC'],],
    });
    const sort = sortItem ? parseInt(sortItem.dataValues.SORT) + 1 : 1;
    const addPartnerInfo = await PARTNER.create({
      PARTNER_NM: partnerNm,
      PARTNER_IMG: imgUrl,
      PARTNER_URL: partnerUrl,
      SORT: sort,
      USE_YN: 1
    });
    if (!addPartnerInfo) return false;
    return addPartnerInfo;
  } catch (error) {
    console.error("협력사 정보 추가 실패");
    return false;
  }
};

export const updatePartnerInfo = async (id, partnerNm, imgUrl, partnerUrl, sort, useYn) => {
  try {
    const currentPartner = await PARTNER.findOne({
      where: { ID: id },
    });

    if (!currentPartner) {
      console.error("협력사를 찾을 수 없습니다.");
      return false;
    }

    await PARTNER.update(
      { PARTNER_NM: partnerNm,
        PARTNER_IMG: imgUrl,
        PARTNER_URL: partnerUrl,
        SORT: sort,
        USE_YN: useYn,
        UPDATE_AT: new Date()
      },
      { where: { ID: id } }
    );

    return currentPartner;
  } catch (error) {
    console.error("협력사 정보 수정 실패:", error);
    return false;
  }
};

export const deletePartnerInfo = async (id) => {
  try {
    const partnerInfo = await PARTNER.destroy({ where: { ID: id } });
    if (!partnerInfo) return false;
    return partnerInfo;
  } catch (error) {
    console.error("협력사 정보 삭제 실패");
    return false;
  }
};