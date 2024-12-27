const { ABOUT, sequelize } = require('../../models');
const { Op } = require('sequelize');

const getAboutInfo = async () => {
  try{
    const about = await ABOUT.findAndCountAll({order: [['SORT', 'ASC']]});
    if(about.count === 0) return false
    return about;
  } catch (error) {
    console.error("About 조회 실패");
    return false
  }
};

const postAboutInfo = async ({ sort, title, subTitle, icon }) => {
  try{
    const about = await ABOUT.create({
      SORT: sort,
      TITLE: title,
      SUB_TITLE: subTitle,
      ICON: icon
    });
      if(!about) return false;
    return about;
  } catch (error) {
    console.error("About 저장 실패");
    return false
  }
};

const findOneAboutInfo = async ({ id }) => {
  try{
    const about = await ABOUT.findOne({ where: { ID: id } });
    if(!about) return false;
    return about;
  } catch (error) {
    console.error("About 조회 실패");
    return false
  }
};

const updateAboutInfo = async ({ id, sort, title, subTitle, icon }) => {
  try{
    const about = await ABOUT.update({
      SORT: sort,
      TITLE: title,
      SUB_TITLE: subTitle,
      ICON: icon,
      UPDATED_AT: new Date()
    }, { where: { ID: id } });
    if(!about) return false;
    return about;
  } catch (error) {
    console.error("About 수정 실패");
    return false
  }
}

const deleteAboutInfo = async ({ id }) => {
  try{
    const about = await ABOUT.destroy({ where: { ID: id } });
    if(!about) return false;
    return about;
  } catch (error) {
    console.error("About 삭제 실패");
    return false
  }
}

module.exports = {
  getAboutInfo,
  postAboutInfo,
  findOneAboutInfo,
  updateAboutInfo,
  deleteAboutInfo,
};
