import { PROJECT } from '../../models/PROJECT';
import { PROJECT_IMG } from '../../models/PROJECT_IMG';
import { Op } from 'sequelize';
import sequelize from '../../connection';

// 전체 조회 쿼리
export const getProjectInfo = async (page, size, title) => {
  try {
    let where = {};
    if (title) {
      where = {
        TITLE: {
          [Op.like]: `%${title}%`,
        },
      };
    }

    const projectList = await PROJECT.findAll({
      where,
      order: [
        ['PROJECT_NB', 'ASC'],
        ['CREATE_AT', 'DESC'],
      ],
      offset: (page - 1) * size,
      limit: size,
    });

    if (projectList.length === 0) {
      return false;
    }

    return projectList;
  } catch (error) {
    console.error('프로젝트 리스트 조회 실패', error);
    return false;
  }
};

// 단일 조회 쿼리
export const getProjectFindOne = async ({ projectNb }) => {
  try {
    const projectInfo = await PROJECT.findOne({
      where: { PROJECT_NB: projectNb },
    });

    if (!projectInfo) {
      return false;
    }

    return projectInfo;
  } catch (error) {
    console.error('프로젝트 정보 조회 실패:', error);
    return false;
  }
};
// 파일 조회 쿼리
export const getProjectFiles = async ({ projectNb }) => {
  try {
    const projectFiles = await PROJECT_IMG.findAll({
      where: { PROJECT_NB: projectNb },
    });

    if (!projectFiles) {
      return false;
    }

    return projectFiles;
  } catch (error) {
    console.error('프로젝트 파일 조회 실패:', error);
    return false;
  }
};

// 프로젝트 추가 쿼리
export const postProjectInfo = async ({ title, subTitle, projectImg, stackObj, projectInfo, files }) => {
  try {

    console.log('---------------추가 쿼리문-----------------');
    console.log(title, subTitle, projectImg, stackObj, projectInfo);
    console.log(files);

    // 현재 최대 PROJECT_NB 가져오기
    const result = await sequelize.query(
      'SELECT MAX(PROJECT_NB) AS PROJECT_NB FROM PROJECT',
      { type: sequelize.QueryTypes.SELECT }
    );
    const PROJECT_NB = result[0].PROJECT_NB ? result[0].PROJECT_NB + 1 : 1;

    // 스택데이터 string으로 변환
    const stackJsonString = JSON.stringify(stackObj);

    // PROJECT 데이터 생성
    const project = await PROJECT.create({
      PROJECT_NB,
      TITLE: title,
      SUB_TITLE: subTitle,
      PROJECT_IMG: projectImg,
      STACK: stackJsonString, // Use the JSON string
      PROJECT_INFO: projectInfo,
    });

    
    if (!project) return false;
    
    // 관련 파일 생성
    // for (const file of files) {
    //   const projectFiles = await PROJECT_IMG.create({
    //     PROJECT_NB,
    //     PROJECT_IMG: file,
    //     SORT: file.sort,
    //   });
      
    //   if (!projectFiles) return false;
    // }
    for (const [index, file] of files.entries()) {
      const projectFiles = await PROJECT_IMG.create({
        PROJECT_NB,
        PROJECT_IMG: file,
        SORT: index + 1,
      });
      
      if (!projectFiles) return false;
    }

    return project;
  } catch (error) {
    console.error('프로젝트 추가 실패:', error);
    return false;
  }
};


export const updateProjectInfo = async ({ projectNb, title, subTitle, projectImg, stackObj, projectInfo, files }) => {
  const t = await sequelize.transaction();
  try {

    console.log('---------------업데이트 쿼리문-----------------');
    console.log(projectNb, title, subTitle, projectImg, stackObj, projectInfo);
    console.log(files);

    // 스택데이터 string으로 변환
    const stackJsonString = JSON.stringify(stackObj);

    const project = await PROJECT.update({ 
      TITLE : title,
      SUB_TITLE : subTitle, 
      PROJECT_IMG : projectImg, 
      STACK : stackJsonString, 
      PROJECT_INFO : projectInfo,
      UPDATE_AT : new Date()
    }, { 
      where: { PROJECT_NB: projectNb },
      transaction: t 
    });
    if(!project) {
      await t.rollback();
      return false;
    }

    // 기존 데이터 삭제
    const deleteFiles = await PROJECT_IMG.destroy({
      where: { PROJECT_NB: projectNb },
      transaction: t 
    });
    if(!deleteFiles) {
      await t.rollback();
      return false;
    }

    // 프로젝트 데이터 수정
    console.log('---------------파일 수정하기 직전------------');
    console.log(projectNb, '/' ,  files, files.length);
    // if(files && files.length > 0) {
    //   const created = await PROJECT_IMG.bulkCreate(
    //     files.map(file => ({
    //     PROJECT_NB: projectNb,
    //     PROJECT_IMG: file,
    //     SORT: file.SORT,
    //   })),
    //     { transaction: t }
    //   );
    //   if (!created) {
    //     await t.rollback();
    //     return false;
    //   }
    // }
    if(files && files.length > 0) {
      const created = await PROJECT_IMG.bulkCreate(
        files.map((file, index) => ({
        PROJECT_NB: projectNb,
        PROJECT_IMG: file,
        SORT: index + 1,
      })),
        { transaction: t }
      );
      if (!created) {
        await t.rollback();
        return false;
      }
    }

    await t.commit();
    console.log('프로젝트 업데이트 성공');
    return project;
  } catch (error) {
    await t.rollback();
    console.log(error);
    console.error("프로젝트 정보 수정 실패");
    return false;
  }
}

export const deleteProjectInfo = async ({ projectNb }) => {
  const t = await sequelize.transaction();
  try {
    const project = await PROJECT.destroy({ 
      where: { PROJECT_NB: projectNb },
      transaction: t 
    });
    if (!project) {
      await t.rollback();
      return false;
    }
    
    await PROJECT_IMG.destroy({ 
      where: { PROJECT_NB: projectNb },
      transaction: t 
    });

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.error("프로젝트 정보 삭제 실패");
    return false;
  }
}