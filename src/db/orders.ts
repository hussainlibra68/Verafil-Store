import { db, withDbRetry } from './index.ts';
import { orders } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
  category?: string;
}

export interface CreateOrderInput {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  postalCode?: string;
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod?: string;
}

export async function getAllOrders() {
  try {
    const rows = await withDbRetry(() =>
      db.select().from(orders).orderBy(desc(orders.createdAt))
    );
    return rows.map(r => ({
      ...r,
      items: r.items 
        ? (typeof r.items === 'string' ? (() => { try { return JSON.parse(r.items); } catch { return []; } })() : r.items)
        : [],
    }));
  } catch (error) {
    console.error('Failed to get orders:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const safeSubtotal = Math.max(0, Math.round(Number(input.subtotal) || 0));
    const safeTotal = Math.max(0, Math.round(Number(input.total) || safeSubtotal));

    const [inserted] = await withDbRetry(() =>
      db.insert(orders).values({
        id: input.id,
        customerName: input.customerName || 'Customer',
        customerEmail: input.customerEmail || 'orders@verafil.store',
        customerPhone: input.customerPhone || '',
        customerAddress: input.customerAddress || '',
        city: input.city || 'Pakistan',
        postalCode: input.postalCode || '',
        orderNotes: input.orderNotes || '',
        items: typeof input.items === 'string' ? input.items : JSON.stringify(input.items || []),
        subtotal: safeSubtotal,
        total: safeTotal,
        status: 'Pending',
        paymentMethod: input.paymentMethod || 'Cash on Delivery',
      }).returning()
    );

    return {
      ...inserted,
      items: inserted.items 
        ? (typeof inserted.items === 'string' ? (() => { try { return JSON.parse(inserted.items); } catch { return []; } })() : inserted.items)
        : [],
    };
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order in database.', { cause: error });
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const [updated] = await withDbRetry(() =>
      db.update(orders)
        .set({ status })
        .where(eq(orders.id, id))
        .returning()
    );

    if (!updated) return null;
    return {
      ...updated,
      items: updated.items ? JSON.parse(updated.items) : [],
    };
  } catch (error) {
    console.error(`Failed to update order status for ${id}:`, error);
    throw new Error('Failed to update order in database.', { cause: error });
  }
}

export async function deleteOrder(id: string) {
  try {
    const [deleted] = await withDbRetry(() =>
      db.delete(orders).where(eq(orders.id, id)).returning()
    );
    return deleted || null;
  } catch (error) {
    console.error(`Failed to delete order ${id}:`, error);
    throw new Error('Failed to delete order from database.', { cause: error });
  }
}

