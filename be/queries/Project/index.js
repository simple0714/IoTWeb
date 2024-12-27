const { PROJECT, PROJECT_IMG, sequelize } = require('../../models');
const { Op } = require('sequelize');

const getProjectListAll = async (page , size, title) => {
  try{
    let where = {};
    if(title) {
      where = {
        TITLE: {
          [Op.like]: `%${title}%`
        }
      }
    }
    const projectList = await PROJECT.findAll({
      where,
      order: [['PROJECT_NB', 'ASC']],
      offset: (page-1)*size,
      limit: size
    });

    if(projectList.length === 0) return false
    return projectList;
  } catch (error) {
    console.error("프로젝트 리스트 조회 실패");
    return false
  }
};

const getProjectFindOne = async ({ projectNb }) => {
  try{
    const projectInfo = await PROJECT.findOne({ where: { PROJECT_NB: projectNb } });
    if(!projectInfo) return false;
    return projectInfo;
  } catch (error) {
    console.error("프로젝트 정보 조회 실패");
    return false
  }
}

const getProjectFiles = async ({ projectNb }) => {
  try{  
    const projectFiles = await PROJECT_IMG.findAll({ where: { PROJECT_NB: projectNb } });
    if(!projectFiles) return false;
    return projectFiles;
  } catch (error) {
    console.error("프로젝트 파일 조회 실패");
    return false
  }
}

const postProjectInfo = async ({ title, subTitle, projectImg, stackObj, projectInfo, files }) => {
  try{
    const result = await sequelize.query(`SELECT MAX(PROJECT_NB) AS PROJECT_NB FROM PROJECT`, { type: sequelize.QueryTypes.SELECT });
    const PROJECT_NB = result[0].PROJECT_NB ? result[0].PROJECT_NB + 1 : 1;
    const project = await PROJECT.create({ 
      PROJECT_NB : PROJECT_NB,
      TITLE : title,
      SUB_TITLE : subTitle, 
      PROJECT_IMG : projectImg, 
      STACK : stackObj, 
      PROJECT_INFO : projectInfo 
    });

    for (const file of files) {
      const projectFiles = await PROJECT_IMG.create({
        PROJECT_NB: PROJECT_NB,
        PROJECT_IMG: file.url,
        SORT: file.sort
      });
      if (!projectFiles) return false;
    }

    if(!project) return false;
    return project;
  } catch (error) {
    console.log(error)
    console.error("프로젝트 추가 실패");
    return false
  }
}

const updateProjectInfo = async ({ projectNb, title, subTitle, projectImg, stackObj, projectInfo, files }) => {
  const t = await sequelize.transaction();
  try {
    // 파일 수정
    const project = await PROJECT.update({ 
      TITLE : title,
      SUB_TITLE : subTitle, 
      PROJECT_IMG : projectImg, 
      STACK : stackObj, 
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
    // 파일 삭제
    await PROJECT_IMG.destroy({
      where: { PROJECT_NB: projectNb },
      transaction: t
    });

    // 파일 추기
    if (files && files.length > 0) {
      const created = await PROJECT_IMG.bulkCreate(
        files.map(file => ({
          PROJECT_NB: projectNb,
          PROJECT_IMG: file.PROJECT_IMG,
          SORT: file.SORT
        })),
        { transaction: t }
      );
      
      if (!created) {
        await t.rollback();
        return false;
      }
    }

    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();
    console.log(error);
    console.error("프로젝트 정보 수정 실패");
    return false;
  }
}

const deleteProjectInfo = async ({ projectNb }) => {
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

module.exports = {
  getProjectListAll,
  getProjectFindOne,
  getProjectFiles,
  postProjectInfo,  
  updateProjectInfo,
  deleteProjectInfo,
};
