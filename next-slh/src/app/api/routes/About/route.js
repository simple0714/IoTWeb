import { getAboutInfo, postAboutInfo, updateAboutInfo, deleteAboutInfo } from '../../db/queries/About/about.queries';

export async function GET() {
  try {
    const aboutInfo = await getAboutInfo();

    if (!aboutInfo) {
      return new Response(
        JSON.stringify({ error: '소개글 조회에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ dataInfo: aboutInfo }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  const { title, subtitle, imgUrl } = await req.json();

  console.log(imgUrl);
  try {
    const aboutInfo = await postAboutInfo({ title, subtitle, imgUrl });

    if (!aboutInfo) {
      return new Response(
        JSON.stringify({ error: '저장에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ dataInfo: aboutInfo }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(req) {
  const { id, sort, title, subtitle, imgUrl } = await req.json();

  try {
    const aboutInfo = await updateAboutInfo({ id, sort, title, subtitle, imgUrl });

    if (!aboutInfo) {
      return new Response(
        JSON.stringify({ error: '수정에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ dataInfo: aboutInfo }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const aboutInfo = await deleteAboutInfo({ id });

    if (!aboutInfo) {
      return new Response(
        JSON.stringify({ error: '삭제에 실패하였습니다.' }),
        { status: 400 }
      );
    }

    return new Response(JSON.stringify({ dataInfo: aboutInfo }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
