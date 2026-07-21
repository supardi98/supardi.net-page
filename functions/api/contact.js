export async function onRequestPost(context) {
  try {
    const data = await context.request.json()
    const { name, email, message } = data

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
    }

    const { success } = await context.env.DB.prepare(
      `INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, datetime('now'))`
    ).bind(name, email, message).run()

    if (success) {
      return new Response(JSON.stringify({ success: true }), { status: 200 })
    } else {
      return new Response(JSON.stringify({ error: 'Database insert failed' }), { status: 500 })
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
