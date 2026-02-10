import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  // Only allow GET requests for reading data
  if (req.method !== 'GET') return res.status(405).end();

  const sql = neon(process.env.DATABASE_URL!);
  try {
    const result = await sql`SELECT content FROM sunlight_inventory WHERE id = 'latest'`;
    
    if (result.length === 0) {
      return res.status(200).json(null);
    }

    // This sends the saved inventory back to your React app
    res.status(200).json(result[0].content);
  } catch (error) {
    console.error('Read Error:', error);
    res.status(500).json({ error: 'Database Read Error' });
  }
}