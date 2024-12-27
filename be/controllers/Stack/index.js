const Stack = require('../../queries/Stack');

exports.getStacks = async (req, res) => {
  try {
    const stacks = await Stack.findAll();
    if(!stacks) return res.status(400).json({ error: '스택정보 조회 실패' });
    res.status(200).json(stacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.postAddStack = async (req, res) => {
  const { name, url } = req.body;
  try {
    const stack = await Stack.addStack({ name, url });
    if(!stack) return res.status(400).json({ error: '스택 추가 실패' });
    res.status(200).json(stack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.putUpdateStack = async (req, res) => {
  const { id, name, url } = req.body;
  try {
    const stack = await Stack.updateStack({ id, name, url });
    if(!stack) return res.status(400).json({ error: '스택 수정 실패' });
    res.status(200).json(stack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

