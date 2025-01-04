import { ABOUT } from '../../models/ABOUT';
import { Op } from 'sequelize';

export const getAboutInfo = async () => {
  try {
    const about = await ABOUT.findAndCountAll({
      order: [
        ['SORT', 'ASC'],
        ['CREATE_AT', 'DESC'],
      ],
    });

    if (about.count === 0) {
      return false;
    }

    return about;
  } catch (error) {
    console.error('About 조회 실패', error);
    return false;
  }
};

export const findOneAboutInfo = async ({ id }) => {
  try {
    const about = await ABOUT.findOne({
      where: { ID: id },
    });

    if (!about) {
      return false;
    }

    return about;
  } catch (error) {
    console.error('About 조회 실패', error);
    return false;
  }
};

export const postAboutInfo = async ({ title, subtitle, imgUrl }) => {
  try {
    const sortIndex = await ABOUT.max('SORT');
    const sort = sortIndex ? sortIndex + 1 : 1;

    const about = await ABOUT.create({
      SORT: sort,
      TITLE: title,
      SUB_TITLE: subtitle,
      ICON: imgUrl, //TODO : 이미지 변환 후 image 로 변경해서 저장하기
    });

    if (!about) {
      return false;
    }

    return about;
  } catch (error) {
    console.error('About 저장 실패', error);
    return false;
  }
};

export const updateAboutInfo = async ({ id, sort, title, subtitle, imgUrl }) => {
  try {
    const about = await ABOUT.update(
      {
        SORT: sort,
        TITLE: title,
        SUB_TITLE: subtitle,
        ICON: imgUrl,
        UPDATED_AT: new Date(),
      },
      { where: { ID: id } }
    );

    if (!about) {
      return false;
    }

    return about;
  } catch (error) {
    console.error('About 수정 실패', error);
    return false;
  }
};

export const deleteAboutInfo = async ({ id }) => {
  try {
    const about = await ABOUT.destroy({
      where: { ID: id },
    });

    if (!about) {
      return false;
    }

    return about;
  } catch (error) {
    console.error('About 삭제 실패', error);
    return false;
  }
};