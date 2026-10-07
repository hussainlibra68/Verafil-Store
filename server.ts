import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from './src/db/products.ts';
import { 
  getAllOrders, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder 
} from './src/db/orders.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { optionalAuth } from './src/middleware/auth.ts';
import { PRODUCTS } from './constants.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable JSON body parsing with large payload limit for base64 images and attachments
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Helper: Seed default catalog if database is fresh
async function seedCatalogIfEmpty() {
  try {
    const existing = await getAllProducts();
    if (existing.length === 0 && PRODUCTS && PRODUCTS.length > 0) {
      console.log('Seeding initial products into Cloud SQL...');
      for (const p of PRODUCTS) {
        await createProduct({
          id: p.id,
          name: p.name,
          tagline: p.tagline,
          description: p.description,
          longDescription: p.longDescription,
          price: p.price,
          category: p.category,
          imageUrl: p.imageUrl,
          gallery: p.gallery || [p.imageUrl],
          videos: [],
          features: p.features || [],
          inStock: true,
        });
      }
      console.log(`Seeded ${PRODUCTS.length} initial products successfully.`);
    }
  } catch (error) {
    console.error('Note: Catalog initial check or seed bypassed:', error);
  }
}

// Seed on startup asynchronously
seedCatalogIfEmpty();

// ==========================================
// Product API Routes
// ==========================================

// Get all products
app.get('/api/products', async (_req, res) => {
  try {
    const productsList = await getAllProducts();
    if (productsList && productsList.length > 0) {
      return res.json(productsList);
    }
    return res.json(PRODUCTS);
  } catch (error: any) {
    console.warn('Database query failed for products, falling back to catalog:', error?.message || error);
    res.json(PRODUCTS);
  }
});

// Get single product by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    const product = await getProductById(id);
    if (product) {
      return res.json(product);
    }
    const fallback = PRODUCTS.find(p => p.id === id);
    if (fallback) {
      return res.json(fallback);
    }
    res.status(404).json({ error: 'Product not found' });
  } catch (error: any) {
    console.warn(`Database query failed for product ${req.params.id}, falling back:`, error?.message || error);
    const fallback = PRODUCTS.find(p => p.id === String(req.params.id));
    if (fallback) {
      return res.json(fallback);
    }
    res.status(500).json({ error: error.message || 'Failed to fetch product' });
  }
});

// Create product (Management Dashboard)
app.post('/api/products', optionalAuth, async (req, res) => {
  try {
    const { 
      name, 
      tagline, 
      description, 
      longDescription, 
      price, 
      category, 
      imageUrl, 
      gallery, 
      videos, 
      features, 
      inStock 
    } = req.body;

    if (!name || !price || !category || !imageUrl) {
      return res.status(400).json({ error: 'Missing required product fields (name, price, category, imageUrl)' });
    }

    const id = req.body.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    const newProduct = await createProduct({
      id,
      name,
      tagline: tagline || '',
      description: description || name,
      longDescription: longDescription || description || name,
      price: Number(price),
      category,
      imageUrl,
      gallery: Array.isArray(gallery) ? gallery : [imageUrl],
      videos: Array.isArray(videos) ? videos : [],
      features: Array.isArray(features) ? features : [],
      inStock: inStock !== undefined ? Boolean(inStock) : true,
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: error.message || 'Failed to create product' });
  }
});

// Update product
app.put('/api/products/:id', optionalAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const updated = await updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error(`Failed to update product ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to update product' });
  }
});

// Delete product permanently
app.delete('/api/products/:id', optionalAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted permanently', id });
  } catch (error: any) {
    console.error(`Failed to delete product ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// ==========================================
// Orders API Routes
// ==========================================

// Get all orders (for Store Management Dashboard)
app.get('/api/orders', async (_req, res) => {
  try {
    const ordersList = await getAllOrders();
    res.json(ordersList);
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch orders' });
  }
});

// Create new customer order (from Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      city,
      postalCode,
      orderNotes,
      items,
      subtotal,
      total,
      paymentMethod
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !city || !items || !items.length) {
      return res.status(400).json({ error: 'Missing required order fields (customer name, email, phone, address, city, items)' });
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const savedOrder = await createOrder({
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      city,
      postalCode: postalCode || '',
      orderNotes: orderNotes || '',
      items,
      subtotal: Number(subtotal),
      total: Number(total),
      paymentMethod: paymentMethod || 'Cash on Delivery',
    });

    res.status(201).json(savedOrder);
  } catch (error: any) {
    console.error('Failed to save order:', error);
    res.status(500).json({ error: error.message || 'Failed to save order' });
  }
});

// Update order status (Pending -> Confirmed -> Shipped -> Delivered)
app.patch('/api/orders/:id/status', optionalAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const id = String(req.params.id);
    const updated = await updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error(`Failed to update order ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
});

// Delete order
app.delete('/api/orders/:id', optionalAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const deleted = await deleteOrder(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted', id });
  } catch (error: any) {
    console.error(`Failed to delete order ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to delete order' });
  }
});

// ==========================================
// User Profile Sync Route
// ==========================================
app.post('/api/auth/sync', optionalAuth, async (req: any, res) => {
  try {
    const uid = req.user?.uid || req.body.uid;
    const email = req.user?.email || req.body.email;
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email required' });
    }
    const user = await getOrCreateUser(uid, email);
    res.json(user);
  } catch (error: any) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

// ==========================================
// Frontend / Vite Integration
// ==========================================
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`VERAFIL Full-Stack server running on port ${PORT}`);
});
