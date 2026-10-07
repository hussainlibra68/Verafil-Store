/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Product, Order, ProductCategory } from '../types';
import { api } from '../src/services/api';
import { formatPKR } from '../src/utils/currency';

interface AdminDashboardProps {
  products: Product[];
  onProductsChange: () => void;
  onNavigateHome: () => void;
  onViewProduct: (product: Product) => void;
  onLockDashboard?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onProductsChange,
  onNavigateHome,
  onViewProduct,
  onLockDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State for Product Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    price: '',
    category: 'Fashion',
    customCategory: '',
    description: '',
    longDescription: '',
    featuresText: '',
    inStock: true,
  });

  // Media state: at least 4 images, at least 2 videos
  const [images, setImages] = useState<string[]>(['', '', '', '']);
  const [videos, setVideos] = useState<string[]>(['', '']);
  const [urlInputs, setUrlInputs] = useState<string[]>(['', '', '', '']);
  const [videoUrlInputs, setVideoUrlInputs] = useState<string[]>(['', '']);

  // File upload input refs
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Show notification
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Fetch orders from Cloud SQL
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      showToast('Failed to load orders from database', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 15000); // Polling for auto-update of new orders
    return () => clearInterval(interval);
  }, []);

  // Open Add Product modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      tagline: '',
      price: '',
      category: 'Fashion',
      customCategory: '',
      description: '',
      longDescription: '',
      featuresText: '',
      inStock: true,
    });
    setImages(['', '', '', '']);
    setVideos(['', '']);
    setUrlInputs(['', '', '', '']);
    setVideoUrlInputs(['', '']);
    setIsAddModalOpen(true);
  };

  // Open Edit Product modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      tagline: p.tagline || '',
      price: p.price.toString(),
      category: ['Fashion', 'Electronics', 'Home & Kitchen', 'Skincare', 'Eye Care'].includes(p.category) 
        ? p.category 
        : 'Custom',
      customCategory: ['Fashion', 'Electronics', 'Home & Kitchen', 'Skincare', 'Eye Care'].includes(p.category) 
        ? '' 
        : p.category,
      description: p.description,
      longDescription: p.longDescription || '',
      featuresText: (p.features || []).join('\n'),
      inStock: p.inStock ?? true,
    });

    const currentImgs = [...(p.gallery && p.gallery.length > 0 ? p.gallery : [p.imageUrl])];
    while (currentImgs.length < 4) currentImgs.push('');
    setImages(currentImgs);
    setUrlInputs(currentImgs);

    const currentVids = [...(p.videos || [])];
    while (currentVids.length < 2) currentVids.push('');
    setVideos(currentVids);
    setVideoUrlInputs(currentVids);

    setIsAddModalOpen(true);
  };

  // Handle image upload from computer (reads as Base64 Data URL)
  const handleFileUpload = (index: number, file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImages(prev => {
          const updated = [...prev];
          updated[index] = result;
          return updated;
        });
        setUrlInputs(prev => {
          const updated = [...prev];
          updated[index] = '[Uploaded Image File]';
          return updated;
        });
        showToast(`Image ${index + 1} uploaded successfully`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle paste image from clipboard into slot
  const handlePasteImage = async (index: number, e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileUpload(index, file);
          e.preventDefault();
          return;
        }
      }
    }
  };

  // Handle URL input change for image
  const handleImageUrlChange = (index: number, url: string) => {
    setUrlInputs(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
    setImages(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  // Handle Video URL change
  const handleVideoUrlChange = (index: number, url: string) => {
    setVideoUrlInputs(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
    setVideos(prev => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  // Add more image or video slot
  const addImageSlot = () => {
    setImages(prev => [...prev, '']);
    setUrlInputs(prev => [...prev, '']);
  };

  const addVideoSlot = () => {
    setVideos(prev => [...prev, '']);
    setVideoUrlInputs(prev => [...prev, '']);
  };

  // Submit product creation or update
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = formData.category === 'Custom' 
      ? formData.customCategory.trim() 
      : formData.category;

    if (!formData.name.trim() || !formData.price || !finalCategory) {
      showToast('Please provide product name, price, and category', 'error');
      return;
    }

    // Filter valid images
    const validImages = images.filter(img => img.trim().length > 0);
    if (validImages.length === 0) {
      showToast('Please add at least 1 image (at least 4 recommended)', 'error');
      return;
    }

    const primaryImage = validImages[0];
    const validVideos = videos.filter(v => v.trim().length > 0);
    const featuresList = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const productPayload: Partial<Product> = {
      name: formData.name.trim(),
      tagline: formData.tagline.trim(),
      price: Math.round(Number(formData.price)),
      category: finalCategory,
      description: formData.description.trim() || formData.name.trim(),
      longDescription: formData.longDescription.trim() || formData.description.trim() || formData.name.trim(),
      imageUrl: primaryImage,
      gallery: validImages,
      videos: validVideos,
      features: featuresList.length > 0 ? featuresList : ['High Quality Craftsmanship', 'Signature Finish'],
      inStock: formData.inStock,
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productPayload);
        showToast('Product updated permanently in Cloud SQL!');
      } else {
        await api.createProduct(productPayload);
        showToast('New product saved permanently in Cloud SQL!');
      }
      setIsAddModalOpen(false);
      onProductsChange();
    } catch (err: any) {
      console.error('Error saving product:', err);
      showToast(err.message || 'Failed to save product to database', 'error');
    }
  };

  // Delete product with confirmation
  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to permanently delete "${product.name}" from Cloud SQL database?`)) {
      try {
        await api.deleteProduct(product.id);
        showToast(`"${product.name}" deleted successfully.`);
        onProductsChange();
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        showToast('Failed to delete product from database', 'error');
      }
    }
  };

  // Update Order Status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast('Failed to update order status', 'error');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Delete order ${orderId}? This cannot be undone.`)) {
      try {
        await api.deleteOrder(orderId);
        setOrders(prev => prev.filter(o => o.id !== orderId));
        showToast(`Order ${orderId} removed.`);
      } catch (err: any) {
        showToast('Failed to delete order', 'error');
      }
    }
  };

  // Sharable Link Generator
  const copyProductShareLink = (product: Product) => {
    const origin = window.location.origin;
    const shareUrl = `${origin}?product=${product.id}#product-${product.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast(`Sharable link copied to clipboard!`);
    } else {
      window.prompt('Copy product share link:', shareUrl);
    }
  };

  // Category options
  const categoriesList = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#2C2A26] pt-24 pb-20 px-4 sm:px-6 md:px-12">
      {/* Toast Notification */}
      {statusMessage && (
        <div 
          className={`fixed top-24 right-6 z-50 px-6 py-3 shadow-lg rounded-sm text-sm font-medium transition-all ${
            statusMessage.type === 'success' 
              ? 'bg-[#2C2A26] text-[#F5F2EB] border-l-4 border-emerald-500' 
              : 'bg-red-800 text-white'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="max-w-[1800px] mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#D6D1C7]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C827A] font-semibold">Database Management</span>
              <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold bg-emerald-100 text-emerald-800 rounded-full">Cloud SQL Active</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tight font-medium">Store Management Dashboard</h1>
            <p className="text-sm text-[#706B63] mt-1">
              Manage live products, inventory media (4+ images, 2+ videos), and incoming customer orders in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onLockDashboard && (
              <button
                onClick={onLockDashboard}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-widest border border-stone-400 text-stone-700 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
                title="Lock Dashboard and return to storefront"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Lock Dashboard
              </button>
            )}
            <button
              onClick={onNavigateHome}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-widest border border-[#D6D1C7] hover:border-[#2C2A26] transition-colors bg-white/50"
            >
              View Live Storefront
            </button>
            <button
              onClick={openAddModal}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#2C2A26] text-[#F5F2EB] hover:bg-[#433E38] transition-colors shadow-xs flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="p-5 bg-white/70 border border-[#D6D1C7] rounded-sm">
            <div className="text-xs text-[#8C827A] uppercase tracking-wider font-semibold">Total Revenue</div>
            <div className="text-2xl md:text-3xl font-serif mt-1 font-medium">{formatPKR(totalRevenue)}</div>
            <div className="text-xs text-[#8C827A] mt-1">From all recorded orders</div>
          </div>
          <div className="p-5 bg-white/70 border border-[#D6D1C7] rounded-sm">
            <div className="text-xs text-[#8C827A] uppercase tracking-wider font-semibold">Total Orders</div>
            <div className="text-2xl md:text-3xl font-serif mt-1 font-medium">{orders.length}</div>
            <div className="text-xs text-amber-700 font-medium mt-1">{pendingOrders} Pending fulfillment</div>
          </div>
          <div className="p-5 bg-white/70 border border-[#D6D1C7] rounded-sm">
            <div className="text-xs text-[#8C827A] uppercase tracking-wider font-semibold">Live Products</div>
            <div className="text-2xl md:text-3xl font-serif mt-1 font-medium">{products.length}</div>
            <div className="text-xs text-[#8C827A] mt-1">Saved permanently in Cloud SQL</div>
          </div>
          <div className="p-5 bg-white/70 border border-[#D6D1C7] rounded-sm">
            <div className="text-xs text-[#8C827A] uppercase tracking-wider font-semibold">Categories</div>
            <div className="text-2xl md:text-3xl font-serif mt-1 font-medium">{categoriesList.length}</div>
            <div className="text-xs text-[#8C827A] mt-1">Active departmental classifications</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-[#D6D1C7] mb-8 gap-8 text-sm font-semibold uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-[#2C2A26] text-[#2C2A26]'
                : 'border-transparent text-[#8C827A] hover:text-[#2C2A26]'
            }`}
          >
            Products Catalog ({products.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              loadOrders();
            }}
            className={`pb-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#2C2A26] text-[#2C2A26]'
                : 'border-transparent text-[#8C827A] hover:text-[#2C2A26]'
            }`}
          >
            Customer Orders ({orders.length})
            {pendingOrders > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingOrders}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div>
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/70 border border-[#D6D1C7] px-4 py-2.5 text-xs text-[#2C2A26] placeholder-[#8C827A] outline-none focus:border-[#2C2A26] transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="absolute right-3 top-2.5 text-xs text-[#8C827A] hover:text-[#2C2A26]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-[#8C827A] font-semibold">Filter:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white/70 border border-[#D6D1C7] px-4 py-2.5 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                >
                  <option value="All">All Categories ({products.length})</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table / Cards */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white/50 border border-[#D6D1C7] p-12 text-center my-6">
                <p className="text-lg font-serif text-[#706B63] mb-4">No products found matching your search.</p>
                <button
                  onClick={openAddModal}
                  className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-[#2C2A26] text-[#F5F2EB]"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white/60 border border-[#D6D1C7] rounded-sm shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#D6D1C7] bg-[#EBE7DE]/70 text-[#8C827A] uppercase tracking-wider font-semibold">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price (PKR)</th>
                      <th className="py-4 px-4">Media</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D6D1C7]/60">
                    {filteredProducts.map((product) => {
                      const imageCount = (product.gallery && product.gallery.length > 0) ? product.gallery.length : 1;
                      const videoCount = (product.videos && product.videos.length > 0) ? product.videos.length : 0;

                      return (
                        <tr key={product.id} className="hover:bg-white/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded-xs border border-[#D6D1C7] bg-[#EBE7DE] shrink-0"
                              />
                              <div>
                                <div className="font-serif text-sm font-medium text-[#2C2A26]">{product.name}</div>
                                <div className="text-[11px] text-[#8C827A] truncate max-w-xs">{product.tagline || product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2.5 py-1 text-[11px] bg-[#EBE7DE] rounded-full text-[#4A4742] font-medium">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-serif text-sm font-medium">
                            {formatPKR(product.price)}
                          </td>
                          <td className="py-4 px-4 text-[11px] text-[#706B63]">
                            <div className="flex flex-col gap-0.5">
                              <span>📸 {imageCount} Images</span>
                              <span>🎥 {videoCount} Videos</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${
                              product.inStock !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Share Link Button */}
                              <button
                                onClick={() => copyProductShareLink(product)}
                                title="Copy Sharable Link"
                                className="p-2 border border-[#D6D1C7] hover:border-[#2C2A26] hover:bg-white rounded-xs transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>

                              {/* View Product on Store */}
                              <button
                                onClick={() => onViewProduct(product)}
                                title="View on Store"
                                className="p-2 border border-[#D6D1C7] hover:border-[#2C2A26] hover:bg-white rounded-xs transition-colors"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>

                              {/* Edit Button */}
                              <button
                                onClick={() => openEditModal(product)}
                                className="px-3 py-1.5 border border-[#D6D1C7] hover:border-[#2C2A26] hover:bg-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
                              >
                                Edit
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-serif">Customer Orders Recorded in Database</h2>
                <p className="text-xs text-[#706B63] mt-0.5">
                  Every order submitted via website checkout is permanently stored here with customer details, phone, address, and purchased items.
                </p>
              </div>
              <button
                onClick={loadOrders}
                disabled={loadingOrders}
                className="px-4 py-2 border border-[#D6D1C7] text-xs uppercase tracking-widest font-semibold hover:border-[#2C2A26] bg-white/60 transition-colors flex items-center gap-2"
              >
                <svg className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loadingOrders ? 'Refreshing...' : 'Refresh Orders'}
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white/50 border border-[#D6D1C7] p-16 text-center my-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EBE7DE] flex items-center justify-center text-[#8C827A]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-serif text-[#2C2A26]">No orders placed yet</h3>
                <p className="text-xs text-[#706B63] max-w-md mx-auto mt-2">
                  When customers complete checkout on the website, their details (name, email, phone number, address, and ordered items) will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/80 border border-[#D6D1C7] p-6 rounded-sm shadow-xs transition-all hover:border-[#2C2A26]/50">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#D6D1C7]/60 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-semibold text-lg text-[#2C2A26]">{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#8C827A] mt-1">
                          Date: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'} &bull; Payment: {order.paymentMethod || 'Cash on Delivery'}
                        </div>
                      </div>

                      {/* Status Selector & Delete */}
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">Status:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-white border border-[#D6D1C7] px-3 py-1.5 text-xs text-[#2C2A26] font-medium outline-none focus:border-[#2C2A26]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-900 transition-colors"
                          title="Delete Order"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                      {/* Customer Details */}
                      <div>
                        <div className="text-[11px] uppercase font-bold tracking-widest text-[#8C827A] mb-2">Customer Details</div>
                        <div className="space-y-1 text-xs">
                          <p className="font-semibold text-sm text-[#2C2A26]">{order.customerName}</p>
                          <p className="text-[#5D5A53] flex items-center gap-1.5">
                            <span>📧</span> {order.customerEmail}
                          </p>
                          <p className="text-[#2C2A26] font-medium flex items-center gap-1.5">
                            <span>📞</span> {order.customerPhone}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <div className="text-[11px] uppercase font-bold tracking-widest text-[#8C827A] mb-2">Delivery Address</div>
                        <div className="text-xs text-[#5D5A53] space-y-1">
                          <p className="text-[#2C2A26] font-medium">{order.customerAddress}</p>
                          <p>{order.city} {order.postalCode ? `, ${order.postalCode}` : ''}</p>
                          {order.orderNotes && (
                            <p className="text-xs italic bg-[#EBE7DE]/60 p-2 rounded-xs mt-2 text-[#4A4742]">
                              Note: {order.orderNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered & Total */}
                      <div>
                        <div className="text-[11px] uppercase font-bold tracking-widest text-[#8C827A] mb-2">Items Ordered</div>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {order.items && order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#D6D1C7]/40 last:border-0">
                              <div className="flex items-center gap-2 truncate">
                                {item.imageUrl && (
                                  <img src={item.imageUrl} alt="" className="w-7 h-7 object-cover rounded-xs border border-[#D6D1C7]" />
                                )}
                                <span className="truncate">{item.name} {item.quantity ? `× ${item.quantity}` : ''}</span>
                              </div>
                              <span className="font-medium shrink-0 ml-2">{formatPKR(item.price * (item.quantity || 1))}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 mt-2 border-t border-[#D6D1C7] flex justify-between items-center">
                          <span className="text-xs uppercase tracking-wider font-bold text-[#2C2A26]">Total Amount:</span>
                          <span className="text-base font-serif font-bold text-[#2C2A26]">{formatPKR(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (WITH AT LEAST 4 IMAGES & 2 VIDEOS)   */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F2EB] border border-[#D6D1C7] max-w-4xl w-full p-6 sm:p-8 rounded-sm shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-6 border-b border-[#D6D1C7] mb-6">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-[#8C827A]">Cloud SQL Storefront Inventory</span>
                <h2 className="text-2xl font-serif text-[#2C2A26] mt-0.5">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Product to Store'}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full border border-[#D6D1C7] hover:border-[#2C2A26] flex items-center justify-center text-sm font-semibold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VERAFIL Cashmere Robe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] px-4 py-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 4500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] px-4 py-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] px-4 py-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Eye Care">Eye Care</option>
                    <option value="Custom">+ Add Custom Category</option>
                  </select>
                </div>

                {formData.category === 'Custom' && (
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                      New Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fragrance / Footwear / Art"
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      className="w-full bg-white border border-[#D6D1C7] px-4 py-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                    />
                  </div>
                )}

                <div className={formData.category === 'Custom' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Tagline (Short Subtitle)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure warmth woven by hand."
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] px-4 py-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Concise overview shown in product card and summary..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] p-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Full / Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Complete narrative, crafting story, materials, and artisan provenance..."
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] p-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-[#2C2A26] mb-2">
                    Key Features / Bullet Points (One per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="100% Mongolian Cashmere&#10;Cold-Pressed Botanical Wax Finish&#10;Handmade in Kyoto"
                    value={formData.featuresText}
                    onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                    className="w-full bg-white border border-[#D6D1C7] p-3 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                  />
                </div>
              </div>

              {/* ============================================================== */}
              {/* IMAGES SECTION: AT LEAST 4 IMAGES (UPLOAD OR COPY-PASTE)      */}
              {/* ============================================================== */}
              <div className="p-6 bg-white/70 border border-[#D6D1C7] rounded-sm">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-base font-serif font-medium text-[#2C2A26]">
                      Product Images (At least 4 Images)
                    </h3>
                    <p className="text-xs text-[#706B63]">
                      Add 4 or more high-resolution images. You can <strong>Upload from device</strong> OR <strong>Copy-paste image URL / clipboard paste</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addImageSlot}
                    className="text-xs font-semibold uppercase tracking-wider text-[#2C2A26] hover:underline"
                  >
                    + Add More Image Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {images.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className="border border-[#D6D1C7] bg-[#F5F2EB]/50 p-3 rounded-xs flex flex-col justify-between"
                      onPaste={(e) => handlePasteImage(idx, e)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                          Image #{idx + 1} {idx === 0 && '(Main Cover)'}
                        </span>
                        {images.length > 4 && (
                          <button
                            type="button"
                            onClick={() => {
                              setImages(images.filter((_, i) => i !== idx));
                              setUrlInputs(urlInputs.filter((_, i) => i !== idx));
                            }}
                            className="text-rose-600 text-xs hover:text-rose-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Image Preview Window */}
                      <div className="w-full aspect-[4/5] bg-[#EBE7DE] border border-[#D6D1C7] mb-3 overflow-hidden rounded-xs flex items-center justify-center relative group">
                        {imgUrl ? (
                          <>
                            <img src={imgUrl} alt={`Slot ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                handleImageUrlChange(idx, '');
                              }}
                              className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Clear image"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-3 text-[#A8A29E]">
                            <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] uppercase tracking-wider">Empty Slot</span>
                          </div>
                        )}
                      </div>

                      {/* Action 1: Upload File Button */}
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={el => { fileInputRefs.current[idx] = el; }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(idx, e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="w-full py-1.5 px-3 border border-[#D6D1C7] bg-white text-[11px] font-semibold uppercase tracking-wider hover:border-[#2C2A26] transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload File
                        </button>

                        {/* Action 2: Paste URL or Clipboard */}
                        <input
                          type="text"
                          placeholder="Paste URL or click & paste"
                          value={urlInputs[idx] || ''}
                          onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                          className="w-full bg-white border border-[#D6D1C7] p-2 text-[11px] text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ============================================================== */}
              {/* VIDEOS SECTION: AT LEAST 2 VIDEOS PER PRODUCT                  */}
              {/* ============================================================== */}
              <div className="p-6 bg-white/70 border border-[#D6D1C7] rounded-sm">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-base font-serif font-medium text-[#2C2A26]">
                      Product Videos (At least 2 Videos)
                    </h3>
                    <p className="text-xs text-[#706B63]">
                      Provide direct MP4 video URLs or streaming embeds (e.g. showcasing product drape, texture, craftsmanship).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addVideoSlot}
                    className="text-xs font-semibold uppercase tracking-wider text-[#2C2A26] hover:underline"
                  >
                    + Add More Video Slot
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {videos.map((vidUrl, idx) => (
                    <div key={idx} className="border border-[#D6D1C7] bg-[#F5F2EB]/50 p-4 rounded-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C827A]">
                          Video #{idx + 1}
                        </span>
                        {videos.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              setVideos(videos.filter((_, i) => i !== idx));
                              setVideoUrlInputs(videoUrlInputs.filter((_, i) => i !== idx));
                            }}
                            className="text-rose-600 text-xs hover:text-rose-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Video Player Preview if URL provided */}
                      <div className="w-full aspect-video bg-[#EBE7DE] border border-[#D6D1C7] mb-3 overflow-hidden rounded-xs flex items-center justify-center">
                        {vidUrl ? (
                          <video
                            src={vidUrl}
                            controls
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.warn('Video failed to load:', vidUrl);
                            }}
                          />
                        ) : (
                          <div className="text-center p-3 text-[#A8A29E]">
                            <svg className="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[10px] uppercase tracking-wider">No Video URL Added</span>
                          </div>
                        )}
                      </div>

                      <input
                        type="url"
                        placeholder="e.g. https://example.com/craft-video.mp4"
                        value={videoUrlInputs[idx] || ''}
                        onChange={(e) => handleVideoUrlChange(idx, e.target.value)}
                        className="w-full bg-white border border-[#D6D1C7] p-2.5 text-xs text-[#2C2A26] outline-none focus:border-[#2C2A26]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-[#2C2A26]"
                />
                <label htmlFor="inStockCheck" className="text-xs font-semibold uppercase tracking-wider text-[#2C2A26]">
                  Available in Stock for Immediate Delivery
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#D6D1C7]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 border border-[#D6D1C7] text-xs uppercase tracking-widest font-semibold hover:border-[#2C2A26] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-semibold hover:bg-[#433E38] transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product to Cloud SQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
