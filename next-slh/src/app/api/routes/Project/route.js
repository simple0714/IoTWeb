import { getProjectInfo, postProjectInfo, updateProjectInfo, deleteProjectInfo } from '../../db/queries/Project/project.queries';

export async function GET(req, res) {
  // URLSearchParams를 사용하여 쿼리 파라미터 추출
  const queryParams = new URLSearchParams(req.url.split('?')[1]);

  const page = queryParams.get('page') || 1; // 기본값 설정
  const size = queryParams.get('size') || 50; // 기본값 설정
  const title = queryParams.get('title') || ''; // 기본값 설정

  try {
    // page와 size를 정수로 변환
    const pageNumber = parseInt(page, 10) || 1;
    const sizeNumber = parseInt(size, 10) || 50;

    // 프로젝트 정보 조회
    const projectList = await getProjectInfo(pageNumber, sizeNumber, title);

    if (!projectList || projectList.length === 0) {
      return new Response(
        JSON.stringify({ error: '프로젝트 정보조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ dataInfo: { count: projectList.length, currentPage: pageNumber, projectList } }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req, res) {
  try {
    const body = await req.json(); // req.body 대신 req.json() 사용
    const { title, subTitle, projectImg, stack, projectInfo, files } = body;

    let stackObj = '';
    if(Array.isArray(stack)) stackObj = { stack: stack };
    else return new Response(JSON.stringify({ error: "서비스 코드가 올바르지 않습니다." }), { status: 400 });
    const project = await postProjectInfo({ title, subTitle, projectImg, stackObj, projectInfo, files });
    if(!project) return new Response(JSON.stringify({ error: "프로젝트 정보 추가에 실패하였습니다." }), { status: 400 });
    return new Response(JSON.stringify({ dataInfo: project }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req, res) {
  try {
    const body = await req.json(); // req.body 대신 req.json() 사용
    const { projectNb, title, subTitle, projectImg, stack, projectInfo, files } = body;

    console.log('---------------업데이트 라우트-----------------');
    console.log(projectNb, title, subTitle, projectImg, stack, projectInfo);
    console.log(files);


    let stackObj = '';
    if(Array.isArray(stack)) stackObj = { stack: stack };
    else return new Response(JSON.stringify({ error: "서비스 코드가 올바르지 않습니다." }), { status: 400 });
    const project = await updateProjectInfo({ projectNb, title, subTitle, projectImg, stackObj, projectInfo, files });
    if(!project) return new Response(JSON.stringify({ error: "프로젝트 정보 수정에 실패하였습니다." }), { status: 400 });
    return new Response(JSON.stringify({ dataInfo: project }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const queryParams = new URLSearchParams(req.url.split('?')[1]);
  const projectNb = queryParams.get('id');

  try {
    const project = await deleteProjectInfo({ projectNb });
    if(!project) return new Response(JSON.stringify({ error: "프로젝트 정보 삭제에 실패하였습니다." }), { status: 400 });
    return new Response(JSON.stringify({ dataInfo: project }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 