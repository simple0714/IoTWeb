const { CONTACT, sequelize } = require('../../models');
const { Op } = require('sequelize');


const contactCreate = async ({orgNm, name, phone, email, serviceCd, budget, schedule, description}) => {
  try{
    const contact = await CONTACT.create({
      ORG_NM: orgNm,
      USER_NM: name,
      PHONE: phone,
      EMAIL: email,
      SERVICE_CD: serviceCd,
      BUDGET: budget,
      SCHEDULE: schedule,
      PROJECT_INFO: description,
      REPLY_STATUS : 0
    });
    if(!contact) return false
    return contact;
  } catch (error) {
    console.error(error);
    return false
  }
}

const contactFindList = async ( page, size, userNm, phone, email ) => {
  try{
    let where = {};
    if(userNm) {
      where = {
        ...where,
        USER_NM: {
          [Op.like]: `%${userNm}%`
        }
      }
    }
    if(phone) {
      where = {
        ...where,
        PHONE: {
          [Op.like]: `%${phone}%`
        }
      }
    }
    if(email) {
      where = {
        ...where,
        EMAIL: {
          [Op.like]: `%${email}%`
        }
      }
    }
    const contactList = await CONTACT.findAndCountAll({
      where,
      order: [['ID', 'DESC']],
      offset: (page-1)*size,
      limit: size
    });
    if(contactList.length === 0) return false
    return contactList;
  } catch (error) {
    console.error(error);
    return false
  }
}

const contactFindOne = async (id) => {
  try{
    const contact = await CONTACT.findOne({where: {ID: id}});
    if(!contact) return false
    return contact;
  } catch (error) {
    console.error(error);
    return false
  }
}


module.exports = {
  contactCreate,
  contactFindList,
  contactFindOne,
};