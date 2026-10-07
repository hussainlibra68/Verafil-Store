import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Define the 'users' table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'products' table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tagline: text('tagline').default(''),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  price: integer('price').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  gallery: text('gallery').default('[]'), // JSON string array of 4+ images
  videos: text('videos').default('[]'),   // JSON string array of 2+ videos
  features: text('features').default('[]'), // JSON string array of feature points
  inStock: boolean('in_stock').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Define the 'orders' table
export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerAddress: text('customer_address').notNull(),
  city: text('city').notNull(),
  postalCode: text('postal_code').default(''),
  orderNotes: text('order_notes').default(''),
  items: text('items').notNull(), // JSON array of items { id, name, price, quantity, imageUrl }
  subtotal: integer('subtotal').notNull(),
  total: integer('total').notNull(),
  status: text('status').default('Pending'), // 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
  paymentMethod: text('payment_method').default('Cash on Delivery'),
  createdAt: timestamp('created_at').defaultNow(),
});
