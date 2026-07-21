export async function onRequest(context) {
  try {
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database binding not found" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM skills ORDER BY order_index ASC"
    ).all();

    const skills = results.map(row => ({
      name: row.name,
      level: row.level
    }));

    return new Response(JSON.stringify(skills), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60, s-maxage=300'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
