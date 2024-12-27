const Project = require('../../queries/Project');

exports.getProjectListAll = async (req, res) => {
  const { page = 1 , size = 50, title } = req.query;
  try {
    const projectList = await Project.getProjectListAll(parseInt(page) , parseInt(size), title);
    if(!projectList) return res.status(400).json({ error: "프로젝트 정보조회에 실패하였습니다." });
    res.status(200).json({dataInfo: { count:projectList.length, currentPage:page ,projectList }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getProjectFindOne = async (req, res) => {
  try {
    const { projectNb } = req.query;
    const projectInfo = await Project.getProjectFindOne({ projectNb });
    if(!projectInfo) return res.status(400).json({ error: "프로젝트 정보조회에 실패하였습니다." });
    const projectFiles = await Project.getProjectFiles({ projectNb });
    if(!projectFiles) return res.status(400).json({ error: "프로젝트 파일 조회에 실패하였습니다." });
    res.status(200).json({dataInfo: { projectInfo, projectFiles }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.postProjectInfo = async (req, res) => {
  try {
    const { title, subTitle, projectImg, stack, projectInfo, files } = req.body;
    let stackObj = '';
    if(Array.isArray(stack)) stackObj = { stack: stack };
    else return res.status(400).json({ error: "서비스 코드가 올바르지 않습니다." });
    const project = await Project.postProjectInfo({ title, subTitle, projectImg, stackObj, projectInfo, files });
    if(!project) return res.status(400).json({ error: "프로젝트 정보 추가에 실패하였습니다." });
    res.status(200).json({dataInfo: project});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateProjectInfo = async (req, res) => {
  try {
    const { projectNb, title, subTitle, projectImg, stack, projectInfo, files } = req.body;
    let stackObj = '';
    if(Array.isArray(stack)) stackObj = { stack: stack };
    else return res.status(400).json({ error: "서비스 코드가 올바르지 않습니다." });
    const project = await Project.updateProjectInfo({ projectNb, title, subTitle, projectImg, stackObj, projectInfo, files });
    if(!project) return res.status(400).json({ error: "프로젝트 정보 수정에 실패하였습니다." });
    res.status(200).json({dataInfo: project});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deleteProjectInfo = async (req, res) => {
  try {
    const { projectNb } = req.query;
    const project = await Project.deleteProjectInfo({ projectNb });
    if(!project) return res.status(400).json({ error: "프로젝트 정보 삭제에 실패하였습니다." });
    res.status(200).json({dataInfo: project});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 
