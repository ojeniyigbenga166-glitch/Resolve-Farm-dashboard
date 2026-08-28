import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Plus, 
  Grid, 
  List, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  ShoppingBag, 
  Check,
  Folder,
  Eye,
  EyeOff
} from 'lucide-react';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Ref for local system file upload
  const productFileInputRef = useRef(null);

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' or 'edit'
  const [editingProductId, setEditingProductId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    status: 'published',
    img: ''
  });

  const fetchProducts = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products from Supabase:', err.message);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Unique categories list for filters
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Stats calculation
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'published').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;
  const totalCategoriesCount = new Set(products.map(p => p.category)).size;

  // Status toggle handler
  const handleToggleStatus = async (id) => {
    let nextStatus = 'published';
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === id) {
          nextStatus = product.status === 'published' ? 'draft' : 'published';
          return { ...product, status: nextStatus };
        }
        return product;
      })
    );

    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('products')
          .update({ status: nextStatus })
          .eq('id', id);
        if (error) throw error;
      }
    } catch (err) {
      console.error('Error toggling product status in Supabase:', err);
    }
  };

  // Delete product handler
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the product list?`)) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

      try {
        if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
          if (error) throw error;
        }
      } catch (err) {
        console.error('Error deleting product from Supabase:', err);
      }
    }
  };

  // Open Add Drawer
  const handleOpenAddDrawer = () => {
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      status: 'published',
      img: ''
    });
    setDrawerMode('add');
    setEditingProductId(null);
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      status: product.status,
      img: product.img
    });
    setDrawerMode('edit');
    setEditingProductId(product.id);
    setIsDrawerOpen(true);
  };

  // Close Drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Local System Upload: Select and compress local crop photo
  const handleProductFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8); // 0.8 quality
          setFormData(prev => ({ ...prev, img: compressedBase64 }));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submit handler
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Product name is required.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      alert('Please enter a valid positive price.');
      return;
    }

    const savedProduct = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      unit: formData.unit,
      status: formData.status,
      img: formData.img || '' // Fallback
    };

    if (drawerMode === 'add') {
      savedProduct.qty = 0;
      savedProduct.min = 50;
      savedProduct.max = 500;
    } else {
      const current = products.find(p => p.id === editingProductId);
      if (current) {
        savedProduct.qty = current.qty;
        savedProduct.min = current.min;
        savedProduct.max = current.max;
      }
    }

    // Optimistic UI updates
    if (drawerMode === 'add') {
      const localId = Date.now();
      setProducts(prev => [{ id: localId, ...savedProduct }, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === editingProductId ? { id: editingProductId, ...savedProduct } : p));
    }
    
    setIsDrawerOpen(false);

    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        if (drawerMode === 'add') {
          const { error } = await supabase
            .from('products')
            .insert([savedProduct]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('products')
            .update(savedProduct)
            .eq('id', editingProductId);
          if (error) throw error;
        }
        fetchProducts(); // reload from DB to sync IDs
      }
    } catch (err) {
      console.error('Error saving product to Supabase:', err);
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Products Management</h1>
        <p className="page-subtitle">Add, edit, and publish crops to your storefront catalog.</p>
      </div>

      {/* Summary Ribbon */}
      <div className="products-summary-ribbon">
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Catalog Products</span>
            <span className="summary-card-value">{totalProducts}</span>
          </div>
          <div className="summary-card-icon">
            <ShoppingBag size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Live on Store</span>
            <span className="summary-card-value" style={{ color: 'var(--color-success)' }}>
              {activeProducts}
            </span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(79, 138, 91, 0.08)', color: 'var(--color-success)' }}>
            <Eye size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Hidden / Drafts</span>
            <span className="summary-card-value" style={{ color: 'var(--color-text-muted)' }}>
              {draftProducts}
            </span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: '#F0F0F0', color: 'var(--color-text-muted)' }}>
            <EyeOff size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Active Categories</span>
            <span className="summary-card-value">{totalCategoriesCount}</span>
          </div>
          <div className="summary-card-icon">
            <Folder size={16} />
          </div>
        </div>
      </div>

      {/* Filter and Action bar */}
      <div className="products-top-bar">
        <div className="products-filters-left">
          <div className="search-input-wrapper">
            <Search size={16} className="search-input-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="products-actions-right">
          <div className="view-toggle-buttons">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          <button className="primary-btn" onClick={handleOpenAddDrawer}>
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {viewMode === 'grid' ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card-image-container">
                <img src={product.img} alt={product.name} className="product-card-img" />
                <span className="product-card-category-tag">{product.category}</span>
              </div>
              
              <div className="product-card-body">
                <h3 className="product-card-title">{product.name}</h3>
                <span className="product-card-price">₦{product.price.toLocaleString()} / {product.unit}</span>
                
                <div className="product-card-footer">
                  {/* Toggle Switch */}
                  <div className="status-toggle-wrapper">
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={product.status === 'published'} 
                        onChange={() => handleToggleStatus(product.id)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className={`status-toggle-label ${product.status === 'published' ? 'active' : 'draft'}`}>
                      {product.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="product-card-actions">
                    <button 
                      className="icon-action-btn"
                      onClick={() => handleOpenEditDrawer(product)}
                      title="Edit Product"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="icon-action-btn delete"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="dashboard-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <div className="products-table-card">
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Visibility</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-table-cell-info">
                        <img src={product.img} alt={product.name} className="product-table-img" />
                        <div className="product-table-name-meta">
                          <span className="product-table-name">{product.name}</span>
                          <span className="product-table-category">{product.unit} unit size</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td style={{ fontWeight: 600 }}>₦{product.price.toLocaleString()}</td>
                    <td>
                      <div className="status-toggle-wrapper">
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={product.status === 'published'} 
                            onChange={() => handleToggleStatus(product.id)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className={`status-toggle-label ${product.status === 'published' ? 'active' : 'draft'}`} style={{ fontSize: '0.75rem' }}>
                          {product.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="product-card-actions" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="icon-action-btn"
                          onClick={() => handleOpenEditDrawer(product)}
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="icon-action-btn delete"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-out Sidebar Drawer Form Markup */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={handleCloseDrawer}
      ></div>

      <div className={`product-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">
            {drawerMode === 'add' ? 'Add New Product' : 'Edit Product Details'}
          </h2>
          <button className="drawer-close-btn" onClick={handleCloseDrawer}>
            <X size={18} />
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleSaveProduct}>
          <div className="form-group">
            <label>Product Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="e.g. Habanero Pepper"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Peppers">Peppers</option>
                <option value="Tomatoes">Tomatoes</option>
                <option value="Corn">Corn</option>
                <option value="Tubers">Tubers</option>
                <option value="Grains">Grains</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            <div className="form-group">
              <label>Unit size</label>
              <select 
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
              >
                <option value="kg">kg (Kilogram)</option>
                <option value="bag">bag (Large Sack)</option>
                <option value="bunch">bunch</option>
                <option value="ears">ears</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Unit Price</label>
            <div className="price-input-wrapper">
              <span>₦</span>
              <input 
                type="number" 
                name="price" 
                placeholder="1500"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Storefront Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="published">Published (Visible online)</option>
              <option value="draft">Draft (Hidden in store)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Product Image</label>
            {formData.img ? (
              <div className="uploaded-preview-container">
                <img src={formData.img} alt="Uploaded product preview" className="uploaded-preview-img" />
                <button 
                  type="button" 
                  className="remove-preview-btn"
                  onClick={() => setFormData(prev => ({ ...prev, img: '' }))}
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="image-upload-dropzone" onClick={() => productFileInputRef.current?.click()}>
                <div className="upload-icon-wrapper">
                  <Upload size={22} />
                </div>
                <span className="upload-text-main">Choose Farm Image</span>
                <span className="upload-text-sub">Supports PNG, JPG, or JPEG</span>
              </div>
            )}
            <input 
              type="file" 
              ref={productFileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleProductFileChange} 
              accept="image/*"
            />
          </div>

          <div className="drawer-footer">
            <button type="button" className="secondary-btn" onClick={handleCloseDrawer}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: 'center' }}>
              <Check size={16} />
              <span>Save Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
