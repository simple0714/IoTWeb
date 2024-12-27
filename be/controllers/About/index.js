const About = require('../../queries/About');

exports.getAboutInfo = async (req, res) => {
  try {
    const aboutInfo = await About.getAboutInfo();
    if(!aboutInfo) return res.status(400).json({ error: "소개글 조회에 실패하였습니다." });
    res.status(200).json({dataInfo: aboutInfo});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postAboutInfo = async (req, res) => {
  try{
    const { sort, title, subTitle, icon  } = req.body;
    const aboutInfo = await About.postAboutInfo({ sort, title, subTitle, icon });
    if(!aboutInfo) return res.status(400).json({ error: "저장에 실패하였습니다." });
    res.status(200).json({dataInfo: aboutInfo});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findOneAboutInfo = async (req, res) => {
  try{
    const { id = 1 } = req.query;
    const aboutInfo = await About.findOneAboutInfo({ id });
    if(!aboutInfo) return res.status(400).json({ error: "조회에 실패하였습니다." });
    res.status(200).json({dataInfo: aboutInfo});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.updateAboutInfo = async (req, res) => {
  try{
    const { id, sort, title, subTitle, icon } = req.body;
    const aboutInfo = await About.updateAboutInfo({ id, sort, title, subTitle, icon });
    if(!aboutInfo) return res.status(400).json({ error: "수정에 실패하였습니다." });
    res.status(200).json({dataInfo: aboutInfo});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deleteAboutInfo = async (req, res) => {
  try{
    const { id } = req.query;
    const aboutInfo = await About.deleteAboutInfo({ id });
    if(!aboutInfo) return res.status(400).json({ error: "삭제에 실패하였습니다." });
    res.status(200).json({dataInfo: aboutInfo});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
