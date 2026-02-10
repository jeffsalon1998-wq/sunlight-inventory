import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).end();
  const sql = neon(process.env.DATABASE_URL!);

  try {
    const [items, batches, txs, users, cats, depts, zones] = await Promise.all([
      sql`SELECT * FROM inventory_items`,
      sql`SELECT * FROM stock_batches`,
      sql`SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 50`,
      sql`SELECT * FROM users`,
      sql`SELECT * FROM categories`,
      sql`SELECT * FROM departments`,
      sql`SELECT * FROM zones`
    ]);

    // Reconstruct inventory objects for React
    const inventory = items.map(item => ({
      ...item,
      unitCost: Number(item.unit_cost),
      isFastMoving: item.is_fast_moving,
      parStock: item.par_stock,
      batches: batches.filter(b => b.item_id === item.id),
      stock: batches.filter(b => b.item_id === item.id).reduce((acc: any, b) => {
        acc[b.zone] = (acc[b.zone] || 0) + b.quantity;
        return acc;
      }, {})
    }));

    res.status(200).json({ 
      inventory, 
      transactions: txs,
      users,
      categories: cats.map(c => c.name),
      departments: depts.map(d => d.name),
      zones: zones.map(z => z.name)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}