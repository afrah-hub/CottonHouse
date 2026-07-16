import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiBox, FiShoppingBag, FiDollarSign, FiPlus, FiEdit, FiTrash, FiEye, FiLoader, FiCheckCircle, FiUploadCloud, FiX, FiImage } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, products, categories, orders

  // Data states
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: 0, stock: 0, size: '', color: '', brand: '', categoryId: '', subCategoryId: '', imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  
  // Subcategory management state
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCatName, setNewSubCatName] = useState('');
  const [newSubCatParentId, setNewSubCatParentId] = useState('');

  // Load Admin Data
  const loadData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data);

      const allowedCategories = ["Shirts", "T-Shirts", "Jeans", "Pants", "Jackets", "Traditional Wear"];

      const productsRes = await api.get('/products');
      const filteredProducts = productsRes.data.filter(p => allowedCategories.includes(p.categoryName));
      setProducts(filteredProducts);

      const categoriesRes = await api.get('/categories');
      const filteredCategories = categoriesRes.data.filter(cat => allowedCategories.includes(cat.categoryName));
      setCategories(filteredCategories);

      const subCategoriesRes = await api.get('/subcategories');
      setSubCategories(subCategoriesRes.data);

      const ordersRes = await api.get('/admin/orders');
      setOrders(ordersRes.data);
    } catch (error) {
      console.error("Failed to load admin panel data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product Actions
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    let finalImageUrl = productForm.imageUrl;

    // If a local file was chosen, upload it to our backend upload API
    if (imageFile) {
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('files', imageFile);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalImageUrl = uploadRes.data.imageUrl;
      } catch (uploadErr) {
        console.error('Upload failed:', uploadErr);
        alert(`Image upload failed: ${uploadErr.message}`);
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    // Send JSON to the backend — no multipart needed anymore
    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      stock: productForm.stock,
      size: productForm.size,
      color: productForm.color,
      brand: productForm.brand,
      categoryId: productForm.categoryId,
      subCategoryId: productForm.subCategoryId ? parseInt(productForm.subCategoryId) : null,
      imageUrl: finalImageUrl,
    };

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.productId}`, payload);
        alert("Product updated!");
      } else {
        await api.post('/admin/products', payload);
        alert("Product added!");
      }
      setShowProductModal(false);
      setImageFile(null);
      setImagePreview(null);
      setEditingProduct(null);
      await loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save product details.");
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', description: '', price: 0, stock: 10, size: 'S,M,L,XL', color: 'Black', brand: '', categoryId: categories[0]?.categoryId || '', subCategoryId: '', imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setShowProductModal(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      size: prod.size,
      color: prod.color,
      brand: prod.brand,
      categoryId: prod.categoryId,
      subCategoryId: prod.subCategoryId || '',
      imageUrl: prod.imageUrl
    });
    setImageFile(null);
    setImagePreview(prod.imageUrl || null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      await loadData();
    } catch (err) {
      alert("Failed to delete product.");
    }
  };

  // Category Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.post('/admin/categories', { categoryName: newCatName.trim() });
      setNewCatName('');
      await loadData();
    } catch (err) {
      alert("Failed to add category.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCat || !editingCat.categoryName.trim()) return;
    try {
      await api.put(`/admin/categories/${editingCat.categoryId}`, { categoryName: editingCat.categoryName.trim() });
      setEditingCat(null);
      await loadData();
    } catch (err) {
      alert("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Deleting this category will delete all related products. Continue?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      await loadData();
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  // Subcategory Actions
  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!newSubCatName.trim() || !newSubCatParentId) return;
    try {
      await api.post('/admin/subcategories', {
        name: newSubCatName.trim(),
        categoryId: parseInt(newSubCatParentId)
      });
      setNewSubCatName('');
      await loadData();
      alert("Subcategory created!");
    } catch (err) {
      console.error(err);
      alert("Failed to add subcategory.");
    }
  };


  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      await loadData();
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <FiLoader className="animate-spin text-indigo-500" size={30} />
          <span className="text-sm font-semibold">Loading Admin Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-10">
      
      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-100 uppercase tracking-tight">Admin Console</h1>
        <p className="text-xs text-slate-500">Welcome, {user?.name}. Manage products, categories, shipping orders, and monitor sales.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-900 gap-6 text-sm font-bold">
        {['dashboard', 'products', 'categories', 'orders'].map((tab) => (
          <button
            id={`tab-admin-${tab}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize transition-all relative ${
              activeTab === tab ? 'text-indigo-400 font-extrabold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab contents */}
      <div className="min-h-[50vh]">
        
        {/* Tab 1: Dashboard Panel */}
        {activeTab === 'dashboard' && stats && (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Stats count grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card border border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Customers</span>
                  <span className="text-3xl font-extrabold text-slate-200">{stats.totalUsers}</span>
                </div>
                <div className="p-4 bg-indigo-950/40 text-indigo-400 rounded-2xl border border-indigo-900/30">
                  <FiUsers size={22} />
                </div>
              </div>

              <div className="glass-card border border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Products</span>
                  <span className="text-3xl font-extrabold text-slate-200">{stats.totalProducts}</span>
                </div>
                <div className="p-4 bg-indigo-950/40 text-indigo-400 rounded-2xl border border-indigo-900/30">
                  <FiBox size={22} />
                </div>
              </div>

              <div className="glass-card border border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Orders</span>
                  <span className="text-3xl font-extrabold text-slate-200">{stats.totalOrders}</span>
                </div>
                <div className="p-4 bg-indigo-950/40 text-indigo-400 rounded-2xl border border-indigo-900/30">
                  <FiShoppingBag size={22} />
                </div>
              </div>

              <div className="glass-card border border-slate-900 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Gross Income</span>
                  <span className="text-3xl font-extrabold text-indigo-400">${stats.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="p-4 bg-indigo-950/40 text-indigo-400 rounded-2xl border border-indigo-900/30">
                  <FiDollarSign size={22} />
                </div>
              </div>

            </div>

            {/* Quick overview panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
              
              {/* Product inventory stock levels warnings */}
              <div className="glass-card border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <h3 className="text-base font-bold text-slate-300 uppercase tracking-wider">Inventory Alerts</h3>
                <div className="flex flex-col gap-3">
                  {products.filter(p => p.stock < 10).slice(0, 5).map(p => (
                    <div key={p.productId} className="flex justify-between items-center bg-slate-950/50 rounded-xl p-3 border border-slate-900/60 text-xs">
                      <span className="text-slate-300 font-semibold">{p.name}</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        p.stock === 0 ? 'bg-red-950 text-red-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {p.stock === 0 ? "Out of Stock" : `${p.stock} Left`}
                      </span>
                    </div>
                  ))}
                  {products.filter(p => p.stock < 10).length === 0 && (
                    <p className="text-xs text-slate-500">All products are healthy in inventory!</p>
                  )}
                </div>
              </div>

              {/* Recent Orders logs */}
              <div className="glass-card border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
                <h3 className="text-base font-bold text-slate-300 uppercase tracking-wider">Recent Orders</h3>
                <div className="flex flex-col gap-3">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.orderId} className="flex justify-between items-center bg-slate-950/50 rounded-xl p-3 border border-slate-900/60 text-xs">
                      <div>
                        <span className="font-bold text-slate-300 block">#CH-{o.orderId}</span>
                        <span className="text-slate-500 block mt-0.5">{new Date(o.createdDate).toLocaleDateString()}</span>
                      </div>
                      <span className="font-bold text-slate-300">${o.totalAmount.toFixed(2)}</span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-xs text-slate-500">No recent orders yet.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Products panel */}
        {activeTab === 'products' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Product Inventory</h3>
              <button
                id="btn-admin-add-product"
                onClick={openAddProduct}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <FiPlus size={14} />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Table grid */}
            <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-950">
                    <th className="p-4">Product Info</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-900 text-slate-400">
                  {products.map((p) => (
                    <tr key={p.productId} className="hover:bg-slate-900/30">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-8 aspect-[3/4] object-cover bg-slate-900 rounded shrink-0" />
                        <div>
                          <span className="font-bold text-slate-200 block max-w-xs truncate">{p.name}</span>
                          <span className="text-[10px] text-slate-500 block">Sizes: {p.size} &bull; Color: {p.color}</span>
                        </div>
                      </td>
                      <td className="p-4">{p.brand}</td>
                      <td className="p-4">{p.categoryName}</td>
                      <td className="p-4 font-semibold text-slate-300">${p.price.toFixed(2)}</td>
                      <td className="p-4 font-mono font-semibold">{p.stock}</td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            id={`btn-admin-edit-prod-${p.productId}`}
                            onClick={() => openEditProduct(p)}
                            className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            id={`btn-admin-delete-prod-${p.productId}`}
                            onClick={() => handleDeleteProduct(p.productId)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Categories Panel */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in items-start">
            
            {/* Create Category form */}
            <div className="md:col-span-1 glass-card border border-slate-900 rounded-3xl p-6 flex flex-col gap-4">
              <h3 className="text-base font-bold text-slate-300 uppercase tracking-wider border-b border-slate-900 pb-2">
                {editingCat ? "Edit Category" : "Add Category"}
              </h3>
              
              {editingCat ? (
                <form onSubmit={handleUpdateCategory} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="cat-edit-name-input">Category Name</label>
                    <input
                      id="cat-edit-name-input"
                      type="text"
                      value={editingCat.categoryName}
                      onChange={(e) => setEditingCat({ ...editingCat, categoryName: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button id="btn-cat-save" type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs">Save</button>
                    <button id="btn-cat-cancel" type="button" onClick={() => setEditingCat(null)} className="flex-1 bg-slate-900 border border-slate-800 text-slate-300 font-bold py-2 rounded-xl text-xs">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-6">
                  <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="cat-add-name-input">Category Name</label>
                      <input
                        id="cat-add-name-input"
                        type="text"
                        placeholder="e.g. Traditional Wear"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                      />
                    </div>
                    <button id="btn-cat-add-submit" type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                      <FiPlus />
                      <span>Create Category</span>
                    </button>
                  </form>

                  <div className="border-t border-slate-900 pt-4 flex flex-col gap-4">
                    <h3 className="text-base font-bold text-slate-300 uppercase tracking-wider border-b border-slate-900 pb-2">
                      Add Subcategory
                    </h3>
                    <form onSubmit={handleAddSubCategory} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="subcat-parent-select">Category</label>
                        <select
                          id="subcat-parent-select"
                          value={newSubCatParentId}
                          onChange={(e) => setNewSubCatParentId(e.target.value)}
                          className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(c => (
                            <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="subcat-add-name-input">Subcategory Name</label>
                        <input
                          id="subcat-add-name-input"
                          type="text"
                          placeholder="e.g. Formal Shirts"
                          value={newSubCatName}
                          onChange={(e) => setNewSubCatName(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 focus:outline-none"
                          required
                        />
                      </div>
                      <button id="btn-subcat-add-submit" type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1">
                        <FiPlus />
                        <span>Create Subcategory</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Category List */}
            <div className="md:col-span-2 overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-950">
                    <th className="p-4">Category ID</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-900 text-slate-400">
                  {categories.map((c) => (
                    <tr key={c.categoryId} className="hover:bg-slate-900/30">
                      <td className="p-4 font-mono font-semibold">{c.categoryId}</td>
                      <td className="p-4 text-slate-200 font-semibold">{c.categoryName}</td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            id={`btn-admin-edit-cat-${c.categoryId}`}
                            onClick={() => setEditingCat(c)}
                            className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            id={`btn-admin-delete-cat-${c.categoryId}`}
                            onClick={() => handleDeleteCategory(c.categoryId)}
                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <FiTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Tab 4: Orders Panel */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">All Customer Purchases</h3>

            {/* Orders Table */}
            <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-950">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Delivery Status</th>
                    <th className="p-4 text-center">Change Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-slate-900 text-slate-400">
                  {orders.map((o) => (
                    <tr key={o.orderId} className="hover:bg-slate-900/30">
                      <td className="p-4 font-mono font-bold text-slate-200">#CH-{o.orderId}</td>
                      <td className="p-4">{new Date(o.createdDate).toLocaleDateString()}</td>
                      <td className="p-4 font-semibold text-slate-300">${o.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          o.paymentStatus === 'Paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          o.orderStatus === 'Delivered' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 
                          o.orderStatus === 'Cancelled' ? 'bg-red-950/40 text-red-400 border border-red-900/30' : 'bg-slate-900 text-slate-300 border border-slate-800'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <select
                            id={`select-order-status-${o.orderId}`}
                            value={o.orderStatus}
                            onChange={(e) => handleOrderStatusChange(o.orderId, e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded p-1 text-slate-300 focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

      {/* Product CRUD Modal Overlay dialog */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-scale-in my-8 max-h-[85vh] overflow-y-auto">
            
            <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider border-b border-slate-900 pb-3">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-4 text-xs">
              
              {/* Product Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-name-input">Product Title</label>
                <input
                  id="modal-prod-name-input"
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                  required
                />
              </div>

              {/* Brand, Category & SubCategory Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-brand-input">Brand</label>
                  <input
                    id="modal-prod-brand-input"
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-cat-select">Category</label>
                  <select
                    id="modal-prod-cat-select"
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: parseInt(e.target.value) })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    required
                  >
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-subcat-select">Subcategory</label>
                  <select
                    id="modal-prod-subcat-select"
                    value={productForm.subCategoryId}
                    onChange={(e) => setProductForm({ ...productForm, subCategoryId: e.target.value })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories.filter(sc => sc.categoryId === productForm.categoryId).map(sc => (
                      <option key={sc.subCategoryId} value={sc.subCategoryId}>{sc.subCategoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-price-input">Price ($)</label>
                  <input
                    id="modal-prod-price-input"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-stock-input">Stock Quantity</label>
                  <input
                    id="modal-prod-stock-input"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Sizes & Colors Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-size-input">Sizes (comma split)</label>
                  <input
                    id="modal-prod-size-input"
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    placeholder="e.g. S,M,L"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-color-input">Color</label>
                  <input
                    id="modal-prod-color-input"
                    type="text"
                    value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                    className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-500 uppercase tracking-widest" htmlFor="modal-prod-desc-textarea">Product Description</label>
                <textarea
                  id="modal-prod-desc-textarea"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none h-20"
                  required
                />
              </div>

              {/* Image Upload — Cloudinary */}
              <div className="flex flex-col gap-3 border-t border-slate-900 pt-4">
                <label className="font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FiUploadCloud size={14} />
                  Product Image
                </label>

                {/* Dropzone / file picker */}
                <label
                  htmlFor="modal-prod-image-file"
                  className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-xl p-4 cursor-pointer transition-colors bg-slate-900/40"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-36 object-contain rounded-lg"
                      />
                      <span className="text-[10px] text-slate-500">Click to change image</span>
                    </>
                  ) : (
                    <>
                      <FiImage size={28} className="text-slate-600" />
                      <span className="text-xs text-slate-500 text-center">
                        Click to pick an image<br />
                        <span className="text-[10px] text-slate-600">PNG, JPG, WEBP — uploaded to Cloudinary</span>
                      </span>
                    </>
                  )}
                  <input
                    id="modal-prod-image-file"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                      // Clear the manual URL if a file is chosen
                      setProductForm(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  />
                </label>

                {/* Clear selection */}
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(editingProduct?.imageUrl || null); }}
                    className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 self-start"
                  >
                    <FiX size={11} /> Remove selected file
                  </button>
                )}

                {/* Divider */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">or paste URL</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                {/* Manual URL fallback */}
                <input
                  id="modal-prod-image-url"
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => {
                    setProductForm({ ...productForm, imageUrl: e.target.value });
                    if (e.target.value) {
                      setImageFile(null);
                      setImagePreview(e.target.value);
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-slate-300 focus:outline-none text-xs placeholder-slate-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4 border-t border-slate-900 pt-4">
                <button
                  id="btn-admin-modal-submit"
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {uploadingImage ? (
                    <><FiLoader className="animate-spin" size={13} /><span>Uploading...</span></>
                  ) : (
                    <span>Save Product</span>
                  )}
                </button>
                <button
                  id="btn-admin-modal-close"
                  type="button"
                  onClick={() => { setShowProductModal(false); setImageFile(null); setImagePreview(null); }}
                  className="flex-1 bg-slate-900 border border-slate-850 text-slate-300 font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
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
