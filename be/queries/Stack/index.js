const { STACK, sequelize } = require('../../models');
const { Op } = require('sequelize');

const findAll = async () => {
  try {
    const stacks = await STACK.findAll();
    if(stacks.length === 0) return false;
    return stacks;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const addStack = async ({ name, url }) => {
  try {
    const stack = await STACK.create({ STACK_NM:name, ICON:url });
    if(!stack) return false;
    return stack;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const updateStack = async ({ id, name, url }) => {
  try {
    let set = {};
    if(!name && !url) return false;
    if(name && url) set = { STACK_NM:name, ICON:url }
    else if(!name) set = { ICON:url };
    else if(!url) set = { STACK_NM:name };
    const stack = await STACK.update(set, { where: { ID:id } });
    if(stack[0] === 0) return false;
    return stack;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  findAll,
  addStack,
  updateStack
}
