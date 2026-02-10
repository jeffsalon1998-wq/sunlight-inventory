import { neon } from '@neondatabase/serverless';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Use 'export default' with this specific signature
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return res.status(500).json({ error: "DATABASE_URL is not defined" });
  }

  const sql = neon(databaseUrl);

  try {
    const result = await sql`SELECT NOW() as now`;
    return res.status(200).json({
      success: true,
      message: "Connection verified!",
      time: result[0].now
    });
  } catch (error: any) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}