// api/inventory.ts
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    // Fetch items and their batches in one go
    const items = await sql`
      SELECT i.*, 
      (SELECT json_agg(b.*) FROM stock_batches b WHERE b.item_id = i.id) as batches
      FROM inventory_items i
    `;
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    // Logic for handleFinalIssue: Update batches and log transaction
    // This is where the FEFO logic moves to the server for safety
  }
}