import { Product, Order } from '../../types.ts';

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        console.warn(`Products API returned status ${res.status}, using local catalog`);
        return [];
      }
      return await res.json();
    } catch (err) {
      console.warn('Network issue fetching products from API, using catalog fallback:', err);
      return [];
    }
  },

  async getProduct(id: string): Promise<Product> {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create product');
    }
    return await res.json();
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update product');
    }
    return await res.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete product');
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to fetch orders from API:', err);
      throw err;
    }
  },

  async createOrder(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    city: string;
    postalCode?: string;
    orderNotes?: string;
    items: any[];
    subtotal: number;
    total: number;
    paymentMethod?: string;
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to place order');
    }
    return await res.json();
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update order status');
    }
    return await res.json();
  },

  async deleteOrder(id: string): Promise<void> {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete order');
    }
  },
};
