/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export type ProductCategory = 'Fashion' | 'Electronics' | 'Home & Kitchen' | 'Skincare' | 'Eye Care' | string;

export interface CategoryInfo {
  id: string;
  name: ProductCategory;
  subtitle?: string;
  count: number;
  imageUrl: string;
  link?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  gallery?: string[];
  videos?: string[];
  features: string[];
  inStock?: boolean;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  imageUrl?: string;
  category?: string;
}

export interface Order {
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
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
  paymentMethod?: string;
  createdAt?: string;
}

export interface JournalArticle {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: React.ReactNode; // Allowing JSX for rich formatting/poems
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'shop'; selectedCategory?: string; searchQuery?: string }
  | { type: 'about' }
  | { type: 'contact' }
  | { type: 'product'; product: Product }
  | { type: 'checkout' }
  | { type: 'admin' };

