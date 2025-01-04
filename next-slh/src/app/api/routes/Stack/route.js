import { getStackInfo } from '../../db/queries/Stack/stack.queries';

export async function GET(req, res) {
  try {
    const stacks = await getStackInfo();
    if (!stacks) {
      return new Response(
        JSON.stringify({ error: '스택정보 조회 실패' }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify(stacks), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}
