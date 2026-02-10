import { neon } from '@neondatabase/serverless';
import { VercelRequest, VercelResponse } from '@vercel/node';

// Use 'export default' so Vercel knows this is the main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const sql = neon(process.env.DATABASE_URL!);
  
  try {
    const result = await sql`SELECT NOW() as now`;
    return res.status(200).json({ 
      success: true, 
      message: "Connection verified!",
      time: result[0].now 
    });
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}