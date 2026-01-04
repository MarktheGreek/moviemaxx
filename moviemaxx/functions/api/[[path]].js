export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const path = url.pathname.replace('/api/', '');
    const queryString = url.search;

    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    const TMDB_ACCESS_TOKEN =
      context?.env?.VITE_TMDB_READ_ACCESS_TOKEN ||
      import.meta.env?.VITE_TMDB_READ_ACCESS_TOKEN;

    if (!TMDB_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({
          success: false,
          status_code: 401,
          status_message:
            'TMDB Access Token not found (Cloudflare env or local .env)',
        }),
        {
          status: 401,
          headers: corsHeaders(),
        }
      );
    }

    const fullURL = `${TMDB_BASE_URL}/${path}${queryString}`;
    console.log('Proxying request to TMDB:', fullURL);

    const response = await fetch(fullURL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        ...corsHeaders(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        status_code: 500,
        status_message: 'Internal server error: ' + error.message,
      }),
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
