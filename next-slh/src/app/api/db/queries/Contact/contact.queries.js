import { CONTACT } from '../../models/CONTACT';
import { Op } from 'sequelize';

export const contactCreate = async ({ orgNm, name, phone, email, serviceCd, budget, schedule, description }) => {
  try {
    const contact = await CONTACT.create({
      ORG_NM: orgNm,
      USER_NM: name,
      PHONE: phone,
      EMAIL: email,
      SERVICE_CD: serviceCd,
      BUDGET: budget,
      SCHEDULE: schedule,
      PROJECT_INFO: description,
      REPLY_STATUS: 0
    });
    if (!contact) return false;
    return contact;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getContactInfo = async (page, size, userNm, phone, email) => {
  try {
    let where = {};
    if (userNm) {
      where.USER_NM = { [Op.like]: `%${userNm}%` };
    }
    if (phone) {
      where.PHONE = { [Op.like]: `%${phone}%` };
    }
    if (email) {
      where.EMAIL = { [Op.like]: `%${email}%` };
    }

    const contactList = await CONTACT.findAndCountAll({
      where,
      order: [
        ['ID', 'DESC'],
        ['CREATE_AT', 'DESC'],
      ],
      offset: (page - 1) * size,
      limit: size,
    });

    return contactList.count > 0 ? contactList : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getContactFindOne = async (id) => {
  try {
    const contact = await CONTACT.findOne({ where: { ID: id } });
    return contact || false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
