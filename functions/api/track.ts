export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const { linkId, url } = data;

    if (!linkId || !url) {
      return new Response('Bad Request', { status: 400 });
    }

    const { DB } = context.env;
    await DB.prepare(
      'INSERT INTO clicks (link_id, url) VALUES (?1, ?2)'
    ).bind(linkId, url).run();

    return new Response('OK', { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
