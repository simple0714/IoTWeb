import { getProjectFindOne, getProjectFiles } from '../../../db/queries/Project/project.queries';

export async function GET(req, { params }) {
  const { projectNb } = await params;

  try {
    // 프로젝트 정보 조회
    const projectInfo = await getProjectFindOne({ projectNb });
    if (!projectInfo) {
      return new Response(
        JSON.stringify({ error: '프로젝트 정보조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    // 프로젝트 파일 조회
    const projectFiles = await getProjectFiles({ projectNb });
    if (!projectFiles) {
      return new Response(
        JSON.stringify({ error: '프로젝트 파일 조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ dataInfo: { projectInfo, projectFiles } }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
