import { getSearch } from '../../db/queries/Search/search.queries';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const TABLE_NAME = searchParams.get('TABLE_NAME');
    const searchType = searchParams.get('searchType');
    const searchValue = searchParams.get('searchValue');

    if (!TABLE_NAME || !searchType) {
      return new Response(
        JSON.stringify({ error: 'Missing required query parameters' }),
        { status: 400 }
      );
    }

    const searchList = await getSearch(TABLE_NAME, searchType, searchValue);

    return new Response(
      JSON.stringify({ dataInfo: searchList }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
