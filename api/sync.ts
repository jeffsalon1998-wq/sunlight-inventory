import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const sql = neon(process.env.DATABASE_URL!);
  const { inventory, transactions, users, categories, departments, zones } = req.body.data;

  try {
    await sql.transaction(tx => [
      // 1. Sync Configuration (Overwrite existing with current frontend state)
      tx`DELETE FROM categories`,
      ...categories.map((c: string) => tx`INSERT INTO categories (name) VALUES (${c})`),
      
      tx`DELETE FROM departments`,
      ...departments.map((d: string) => tx`INSERT INTO departments (name) VALUES (${d})`),
      
      tx`DELETE FROM zones`,
      ...zones.map((z: string) => tx`INSERT INTO zones (name) VALUES (${z})`),

      // 2. Sync Users
      tx`DELETE FROM users`,
      ...users.map((u: any) => tx`INSERT INTO users (id, name, role) VALUES (${u.id}, ${u.name}, ${u.role})`),

      // 3. Sync Inventory Items
      ...inventory.map((item: any) => tx`
        INSERT INTO inventory_items (id, sku, name, category, uom, unit_cost, par_stock, is_fast_moving)
        VALUES (${item.id}, ${item.sku}, ${item.name}, ${item.category}, ${item.uom}, ${item.unitCost}, ${item.parStock}, ${item.isFastMoving})
        ON CONFLICT (id) DO UPDATE SET 
          unit_cost = EXCLUDED.unit_cost, 
          par_stock = EXCLUDED.par_stock,
          is_fast_moving = EXCLUDED.is_fast_moving;
      `),

      // 4. Clear and Replace Batches
      ...inventory.flatMap((item: any) => [
        tx`DELETE FROM stock_batches WHERE item_id = ${item.id}`,
        ...item.batches.map((batch: any) => tx`
          INSERT INTO stock_batches (id, item_id, expiry, quantity, zone)
          VALUES (${batch.id}, ${item.id}, ${batch.expiry}, ${batch.quantity}, ${batch.zone})
        `)
      ]),

      // 5. Transactions (Append Only)
      ...transactions.map((t: any) => tx`
        INSERT INTO transactions (id, timestamp, actor, action, qty, item_sku, item_name, source_zone, dest_zone, department, receiver_name, signature)
        VALUES (${t.id}, ${t.timestamp}, ${t.user}, ${t.action}, ${t.qty}, ${t.itemSku}, ${t.itemName}, ${t.sourceZone}, ${t.destZone}, ${t.department}, ${t.receiverName}, ${t.signature})
        ON CONFLICT (id) DO NOTHING;
      `)
    ]);

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Relational Sync Error:', error);
    res.status(500).json({ error: error.message });
  }
}