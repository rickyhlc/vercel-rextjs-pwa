
export async function GET(request) {
  console.log("Vercel trigger cron job now...");

  return Response.json({ ok: true });

}