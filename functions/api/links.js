export async function onRequestGet(context) {
  try {
    const { env } = context;
    const { results } = await env.DB.prepare('SELECT * FROM links ORDER BY order_index ASC').all();

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
