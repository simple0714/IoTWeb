import { Op } from 'sequelize';
import { ABOUT } from '../../models/ABOUT';
import { CONTACT } from '../../models/CONTACT';
import { PARTNER } from '../../models/PARTNER';
import { PROJECT } from '../../models/PROJECT';
import { ADMIN_INFO } from '../../models/ADMIN_INFO';
import { SERVICE } from '../../models/SERVICE';
import { STACK } from '../../models/STACK';

export const getSearch = async (TABLE_NAME, searchType, searchValue) => {
  try {
    let model;
    if(TABLE_NAME === 'ABOUT') {
        model = ABOUT;
    } else if (TABLE_NAME === 'CONTACT') {
        model = CONTACT;
    } else if (TABLE_NAME === 'PARTNER') {
        model = PARTNER;
    } else if (TABLE_NAME === 'PROJECT') {
        model = PROJECT;
    } else if (TABLE_NAME === 'ADMIN_INFO') {
      model = ADMIN_INFO;
    } else if (TABLE_NAME === 'SERVICE') {
        model = SERVICE;
    } else if (TABLE_NAME === 'STACK') {
        model = STACK;
    }
    if (!model) throw new Error(`Model ${TABLE_NAME} does not exist`);

    console.log('--------------model check------------');
    console.log(model);
    console.log(searchType);
    console.log(searchValue);

    const getOrderArray = (model) => {
      const orderArray = [];
      
      // 각 컬럼이 모델에 존재하는지 확인하고 존재하는 경우에만 정렬 조건 추가
      if (Object.keys(model.rawAttributes).includes('SORT')) {
        orderArray.push(['SORT', 'ASC']);
      }
      if (Object.keys(model.rawAttributes).includes('ID')) {
        orderArray.push(['ID', 'DESC']);
      }
      if (Object.keys(model.rawAttributes).includes('PROJECT_NB')) {
        orderArray.push(['PROJECT_NB', 'ASC']);
      }
      if (Object.keys(model.rawAttributes).includes('CREATE_AT')) {
        orderArray.push(['CREATE_AT', 'DESC']);
      }
      
      return orderArray;
    };

    const searchList = await model.findAll({
      where: searchValue !== '' ? {
        [searchType]: { [Op.like]: `%${searchValue}%` },
      } : {[searchType]: { [Op.like]: '%' }},
      order: getOrderArray(model),
    });

    return searchList;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
