import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const sql = neon(process.env.DATABASE_URL!);
  const body = req.body;

  try {
    await sql`
      INSERT INTO sunlight_inventory (id, content) 
      VALUES ('latest', ${JSON.stringify(body.data)})
      ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content
    `;
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Database Write Error' });
  }
}