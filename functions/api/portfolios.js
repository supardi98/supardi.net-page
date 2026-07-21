export async function onRequest(context) {
  try {
    // Check if the DB binding exists (it won't in local dev without wrangler, but we'll handle that on frontend)
    if (!context.env.DB) {
      return new Response(JSON.stringify({ error: "Database binding not found" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM portfolios ORDER BY order_index ASC"
    ).all();

    // Parse tech string back into an array for the frontend
    const portfolios = results.map(row => ({
      id: row.id,
      title: row.title,
      desc: row.desc,
      fullDesc: row.full_desc,
      tech: JSON.parse(row.tech),
      image: row.image_url
    }));

    return new Response(JSON.stringify(portfolios), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60, s-maxage=300' // Edge caching for performance
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
