import { STACK } from '../../models/STACK';

export const getStackInfo = async () => {
  try {
    const stacks = await STACK.findAll();
    if (stacks.length === 0) return false;
    return stacks;
  } catch (error) {
    console.error(error);
    return false;
  }
};