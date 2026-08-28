import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  X, 
  Check, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle,
  Plus,
  ShoppingBag,
  Inbox
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';

export default function Inventory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // 'All', 'in-stock', 'low', 'out-of-stock'

  // Stock Update Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qtyInput, setQtyInput] = useState('');

  const fetchInventory = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error('Error fetching inventory from Supabase:', err.message);
    }
  };

  // Fetch inventory data on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Auto-search for specific crop if passed from dashboard state
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      // Clear the navigation state from browser history to avoid keeping search on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Dynamically calculate statuses
  const getItemStatus = (item) => {
    if (item.qty === 0) return 'out-of-stock';
    if (item.qty <= item.min) return 'low';
    return 'in-stock';
  };

  // Recalculate Stats counters
  const totalItems = inventory.length;
  const inStockCount = inventory.filter(item => getItemStatus(item) === 'in-stock').length;
  const lowStockCount = inventory.filter(item => getItemStatus(item) === 'low').length;
  const outOfStockCount = inventory.filter(item => getItemStatus(item) === 'out-of-stock').length;

  const categories = ['All', ...new Set(inventory.map(item => item.category))];

  // Stat Card click toggles filter
  const handleStatCardClick = (filterType) => {
    setSelectedStatusFilter(filterType);
  };

  // Open update modal
  const handleOpenUpdateModal = (item) => {
    setSelectedItem(item);
    setQtyInput(item.qty);
    setIsModalOpen(true);
  };

  // Save updated stock quantity
  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (qtyInput === '' || isNaN(qtyInput) || Number(qtyInput) < 0) {
      alert('Please enter a valid stock level (0 or positive).');
      return;
    }

    // Optimistic UI updates
    setInventory(prevInventory => 
      prevInventory.map(item => 
        item.id === selectedItem.id ? { ...item, qty: Number(qtyInput) } : item
      )
    );
    setIsModalOpen(false);

    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('products')
          .update({ qty: Number(qtyInput) })
          .eq('id', selectedItem.id);
        
        if (error) throw error;
        fetchInventory(); // reload to sync
      }
    } catch (err) {
      console.error('Error updating stock level in Supabase:', err);
    }
  };

  // Filter logic
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    const status = getItemStatus(item);
    const matchesStatus = selectedStatusFilter === 'All' || 
                          (selectedStatusFilter === 'in-stock' && status === 'in-stock') ||
                          (selectedStatusFilter === 'low' && status === 'low') ||
                          (selectedStatusFilter === 'out-of-stock' && status === 'out-of-stock');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Inventory Tracking</h1>
        <p className="page-subtitle">Monitor product availability, safety thresholds, and manage farm stock levels.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="stat-cards-grid">
        <div 
          onClick={() => handleStatCardClick('All')}
          style={{ cursor: 'pointer' }}
        >
          <StatCard 
            label="Total Products" 
            value={totalItems} 
            icon={<ShoppingBag size={20} />} 
            iconBgType="green-bg"
            footer={{ prefix: selectedStatusFilter === 'All' ? 'Showing All' : 'Click to reset filter' }}
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('in-stock')}
          style={{ cursor: 'pointer' }}
        >
          <StatCard 
            label="In Stock" 
            value={inStockCount} 
            icon={<CheckCircle size={20} />} 
            iconBgType="green-bg"
            footer={{ prefix: selectedStatusFilter === 'in-stock' ? 'Filter Active' : 'Click to filter' }}
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('low')}
          style={{ cursor: 'pointer' }}
        >
          <StatCard 
            label="Low Stock" 
            value={lowStockCount} 
            icon={<AlertTriangle size={20} />} 
            iconBgType="red-bg"
            footer={{ prefix: selectedStatusFilter === 'low' ? 'Filter Active' : 'Click to filter' }}
          />
        </div>
        <div 
          onClick={() => handleStatCardClick('out-of-stock')}
          style={{ cursor: 'pointer' }}
        >
          <StatCard 
            label="Out of Stock" 
            value={outOfStockCount} 
            icon={<Inbox size={20} />} 
            iconBgType="red-bg"
            footer={{ prefix: selectedStatusFilter === 'out-of-stock' ? 'Filter Active' : 'Click to filter' }}
          />
        </div>
      </div>

      {/* Toolbar controls */}
      <div className="products-top-bar">
        <div className="products-filters-left">
          <div className="search-input-wrapper">
            <Search size={16} className="search-input-icon" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
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

          {selectedStatusFilter !== 'All' && (
            <button 
              className="secondary-btn" 
              onClick={() => setSelectedStatusFilter('All')}
              style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Clear Filter ({selectedStatusFilter === 'in-stock' ? 'In Stock' : selectedStatusFilter === 'low' ? 'Low Stock' : 'Out of Stock'})
            </button>
          )}
        </div>

        <div className="products-actions-right">
          <button className="primary-btn" onClick={() => navigate('/products')}>
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="inventory-grid">
        {filteredInventory.map((item) => {
          const status = getItemStatus(item);
          const fillPercentage = Math.min((item.qty / item.max) * 100, 100);
          
          return (
            <div key={item.id} className={`inventory-card ${status}`}>
              {/* Status Badge */}
              <span className={`inventory-status-badge ${status}`}>
                {status === 'in-stock' ? 'In Stock' : status === 'low' ? 'Low' : 'Out of Stock'}
              </span>

              {/* Product Info */}
              <div className="inventory-card-top">
                <div className="inventory-card-img-wrapper">
                  <img src={item.img} alt={item.name} className="inventory-card-img" />
                </div>
                <div className="inventory-card-meta">
                  <h3 className="inventory-card-title" title={item.name}>{item.name}</h3>
                  <span className="inventory-card-category">{item.category}</span>
                </div>
              </div>

              {/* Stock Meter */}
              <div className="stock-meter-container">
                <div className="stock-meter-header">
                  <span className="stock-meter-label">Stock Level</span>
                  <span className="stock-meter-qty">{item.qty} {item.unit}</span>
                </div>

                <div className="stock-meter-bar-track">
                  <div 
                    className={`stock-meter-bar-fill ${status}`}
                    style={{ width: `${fillPercentage}%` }}
                  ></div>
                </div>

                <div className="stock-meter-footer">
                  {status === 'low' && (
                    <div className="stock-meter-min-info">
                      <AlertCircle size={12} />
                      <span>Min required: {item.min} {item.unit}</span>
                    </div>
                  )}
                  {status === 'out-of-stock' && (
                    <div className="stock-meter-min-info" style={{ color: 'var(--color-tomato)' }}>
                      <AlertTriangle size={12} />
                      <span>Requires immediate restocking (Min: {item.min})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="inventory-card-footer">
                <button 
                  className="inventory-action-link"
                  onClick={() => handleOpenUpdateModal(item)}
                >
                  Update Stock
                </button>
              </div>
            </div>
          );
        })}
        {filteredInventory.length === 0 && (
          <div className="dashboard-card" style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <p>No inventory items match your search or filter settings.</p>
          </div>
        )}
      </div>

      {/* Stock Update Dialog Modal */}
      {isModalOpen && selectedItem && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Inventory Stock</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveStock}>
              <div className="modal-body">
                <div className="modal-product-summary">
                  <img src={selectedItem.img} alt={selectedItem.name} className="modal-product-img" />
                  <div className="modal-product-meta">
                    <span className="modal-product-name">{selectedItem.name}</span>
                    <span className="modal-product-category">{selectedItem.category}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Current Stock Quantity</label>
                  <div className="modal-qty-input-row">
                    <div className="qty-input-wrapper">
                      <input 
                        type="number"
                        value={qtyInput}
                        onChange={(e) => setQtyInput(e.target.value)}
                        required
                        min="0"
                      />
                      <span className="qty-input-unit-label">{selectedItem.unit}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
                    Safety threshold for this crop is set to <strong>{selectedItem.min} {selectedItem.unit}</strong>.
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="secondary-btn" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 'none', width: '90px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-btn"
                  style={{ width: '130px', justifyContent: 'center' }}
                >
                  <Check size={16} />
                  <span>Save Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
