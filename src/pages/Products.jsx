import React, { useState } from 'react';
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

import habaneroImg from '../assets/habanero_pepper.png';
import cornImg from '../assets/african_corn.png';
import tomatoesImg from '../assets/roma_tomatoes.png';
import pepperImg from '../assets/yellow_bell_pepper.png';
import cassavaImg from '../assets/cassava_tubers.png';
import potatoesImg from '../assets/sweet_potatoes.png';

// Initial Mock Product Data
const initialProducts = [
  {
    id: 1,
    name: 'Habanero Pepper',
    category: 'Peppers',
    price: 1800,
    unit: 'kg',
    status: 'published',
    img: habaneroImg
  },
  {
    id: 2,
    name: 'African Corn',
    category: 'Corn',
    price: 2200,
    unit: 'bag',
    status: 'published',
    img: cornImg
  },
  {
    id: 3,
    name: 'Roma Tomatoes',
    category: 'Tomatoes',
    price: 1500,
    unit: 'kg',
    status: 'published',
    img: tomatoesImg
  },
  {
    id: 4,
    name: 'Yellow Bell Pepper',
    category: 'Peppers',
    price: 2000,
    unit: 'kg',
    status: 'draft',
    img: pepperImg
  },
  {
    id: 5,
    name: 'Cassava Tubers',
    category: 'Tubers',
    price: 900,
    unit: 'bag',
    status: 'published',
    img: cassavaImg
  },
  {
    id: 6,
    name: 'Sweet Potatoes',
    category: 'Tubers',
    price: 1100,
    unit: 'kg',
    status: 'draft',
    img: potatoesImg
  }
];

// Predefined available product images for mock uploads
const availableProductImages = [
  { name: 'Habanero Pepper', url: habaneroImg },
  { name: 'African Corn', url: cornImg },
  { name: 'Roma Tomatoes', url: tomatoesImg },
  { name: 'Yellow Bell Pepper', url: pepperImg },
  { name: 'Cassava Tubers', url: cassavaImg },
  { name: 'Sweet Potatoes', url: potatoesImg }
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
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

  // Unique categories list for filters
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Stats calculation
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'published').length;
  const draftProducts = products.filter(p => p.status === 'draft').length;
  const totalCategoriesCount = new Set(products.map(p => p.category)).size;

  // Status toggle handler
  const handleToggleStatus = (id) => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === id) {
          const nextStatus = product.status === 'published' ? 'draft' : 'published';
          return { ...product, status: nextStatus };
        }
        return product;
      })
    );
  };

  // Delete product handler
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the product list?`)) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
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

  // Mock Upload: Pick an image corresponding to product name or default
  const handleMockImageUpload = () => {
    // Attempt to match keywords in name, otherwise cycle
    const nameKeyword = formData.name.toLowerCase();
    const matched = availableProductImages.find(img => 
      nameKeyword.includes(img.name.toLowerCase()) || 
      img.name.toLowerCase().includes(nameKeyword)
    );
    
    if (matched && nameKeyword.length > 0) {
      setFormData(prev => ({ ...prev, img: matched.url }));
    } else {
      // Pick random
      const randomIdx = Math.floor(Math.random() * availableProductImages.length);
      setFormData(prev => ({ ...prev, img: availableProductImages[randomIdx].url }));
    }
  };

  // Form submit handler
  const handleSaveProduct = (e) => {
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
      id: drawerMode === 'add' ? Date.now() : editingProductId,
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      unit: formData.unit,
      status: formData.status,
      img: formData.img || habaneroImg // Fallback
    };

    if (drawerMode === 'add') {
      setProducts(prev => [savedProduct, ...prev]);
    } else {
      setProducts(prev => prev.map(p => p.id === editingProductId ? savedProduct : p));
    }
    
    setIsDrawerOpen(false);
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
              <div className="image-upload-dropzone" onClick={handleMockImageUpload}>
                <div className="upload-icon-wrapper">
                  <Upload size={22} />
                </div>
                <span className="upload-text-main">Choose Farm Image</span>
                <span className="upload-text-sub">Supports PNG, JPG, or JPEG</span>
              </div>
            )}
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
