import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import StatCard from '../components/ui/StatCard';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Settings, 
  Sprout, 
  Plus, 
  Image as ImageIcon, 
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [galleryLogs, setGalleryLogs] = useState([]);
  const defaultTime = useMemo(() => new Date(), []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          return;
        }

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');
        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        // Fetch latest gallery logs for homepage recent activity logs feed
        const { data: logsData, error: logsError } = await supabase
          .from('gallery_logs')
          .select('id, title, author_name, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        if (!logsError) {
          setGalleryLogs(logsData || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
      }
    };
    fetchDashboardData();
  }, []);

  // Filter low stock items: quantity is less than or equal to warning minimum limit
  const lowStockItems = products.filter(item => item.qty <= item.min);
  const lowStockCount = lowStockItems.length;
  const activeProductsCount = products.filter(item => item.status === 'published').length;

  // Calculate dynamic Total Revenue
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (order.status === 'cancelled') return sum;
      const itemsTotal = (order.items || []).reduce((itemSum, item) => itemSum + (item.price * item.qty), 0);
      const deliveryFee = Number(order.delivery_fee || 0);
      return sum + itemsTotal + deliveryFee;
    }, 0);
  }, [orders]);

  // Dynamic status distribution for Pie Chart
  const statusData = useMemo(() => {
    const counts = { pending: 0, processing: 0, delivered: 0, cancelled: 0 };
    orders.forEach(o => {
      const s = o.status?.toLowerCase();
      if (counts[s] !== undefined) {
        counts[s]++;
      } else {
        counts.pending++;
      }
    });
    
    const total = orders.length || 1;
    
    return [
      { name: 'Pending', value: counts.pending, percentage: `${((counts.pending / total) * 100).toFixed(1)}%`, color: '#FBC02D' },
      { name: 'Processing', value: counts.processing, percentage: `${((counts.processing / total) * 100).toFixed(1)}%`, color: '#81C784' },
      { name: 'Delivered', value: counts.delivered, percentage: `${((counts.delivered / total) * 100).toFixed(1)}%`, color: '#163A24' },
      { name: 'Cancelled', value: counts.cancelled, percentage: `${((counts.cancelled / total) * 100).toFixed(1)}%`, color: '#D94A38' }
    ];
  }, [orders]);

  // Dynamic recent orders table feed (latest 5 orders)
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        customer: o.customer?.name || 'N/A',
        avatar: o.customer?.avatar || '',
        date: o.date,
        status: o.status,
        total: `₦${((o.items || []).reduce((itemSum, item) => itemSum + (item.price * item.qty), 0) + Number(o.delivery_fee || 0)).toLocaleString()}`
      }));
  }, [orders]);

  // Dynamic Sales Over Time Line Chart
  const salesData = useMemo(() => {
    const grouped = {};
    orders.forEach(o => {
      if (o.status === 'cancelled') return;
      let label = o.date;
      try {
        const d = new Date(o.date);
        if (!isNaN(d.getTime())) {
          label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
      } catch {}
      
      const itemsTotal = (o.items || []).reduce((itemSum, item) => itemSum + (item.price * item.qty), 0);
      const deliveryFee = Number(o.delivery_fee || 0);
      const orderTotal = itemsTotal + deliveryFee;
      
      grouped[label] = (grouped[label] || 0) + orderTotal;
    });

    const list = Object.keys(grouped).map(date => ({
      name: date,
      sales: grouped[date]
    }));

    list.sort((a, b) => new Date(a.name) - new Date(b.name));

    if (list.length === 0) {
      return [
        { name: 'No Data', sales: 0 }
      ];
    }
    return list;
  }, [orders]);

  // Dynamic recent activity events stream
  const recentActivities = useMemo(() => {
    const list = [];

    orders.forEach(o => {
      list.push({
        id: `order-${o.id}`,
        timestamp: new Date(`${o.date} ${o.time}`),
        text: <span>New order <strong>#{o.id}</strong> placed by {o.customer?.name}</span>,
        time: `${o.date}, ${o.time}`,
        icon: <Plus size={14} />,
        colorClass: 'green',
        onClick: () => navigate('/orders', { state: { highlightOrderId: o.id } })
      });
    });

    lowStockItems.forEach(item => {
      list.push({
        id: `stock-${item.id}`,
        timestamp: item.created_at ? new Date(item.created_at) : defaultTime,
        text: <span>Low stock warning: <strong>{item.name}</strong> ({item.qty} {item.unit} left)</span>,
        time: 'Needs harvest/restock',
        icon: <AlertCircle size={14} />,
        colorClass: 'red',
        onClick: () => navigate('/inventory', { state: { searchQuery: item.name } })
      });
    });

    galleryLogs.forEach(log => {
      list.push({
        id: `log-${log.id}`,
        timestamp: log.created_at ? new Date(log.created_at) : defaultTime,
        text: <span>New photo log <strong>"{log.title}"</strong> uploaded</span>,
        time: log.author_name ? `by ${log.author_name}` : 'Recent upload',
        icon: <ImageIcon size={14} />,
        colorClass: 'green',
        onClick: () => navigate('/activity-gallery', { state: { highlightLogId: log.id } })
      });
    });

    return list
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  }, [orders, lowStockItems, galleryLogs, defaultTime, navigate]);

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="stat-cards-grid">
        <StatCard 
          label="Total Revenue" 
          value={`₦${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign size={20} />} 
          iconBgType="green-bg"
          footer={{ prefix: 'Cumulative Storefront Earnings' }}
        />
        <StatCard 
          label="Total Orders" 
          value={orders.length} 
          icon={<ShoppingCart size={20} />} 
          iconBgType="green-bg"
          footer={{ prefix: 'Total Sales Leads Captured' }}
        />
        <StatCard 
          label="Low Stock Items" 
          value={lowStockCount} 
          icon={<Package size={20} />} 
          iconBgType="red-bg"
          footer={{ prefix: 'Needs Attention ', linkText: 'View Items', linkClass: 'red-link', onClick: () => navigate('/inventory') }}
        />
        <StatCard 
          label="Active Products" 
          value={activeProductsCount} 
          icon={<Sprout size={20} />} 
          iconBgType="green-bg"
          footer={{ prefix: 'Published ', linkText: 'View All', linkClass: 'green-link', onClick: () => navigate('/products') }}
        />
      </div>

      {/* Middle Row: Sales Overview & Recent Activities */}
      <div className="dashboard-row-middle">
        {/* Sales Overview Card */}
        <div className="dashboard-card">
          <div className="card-header-container">
            <h2 className="card-title">Sales Overview</h2>
            <select className="card-select-dropdown" defaultValue="This Month">
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          
          <div className="sales-overview-content">
            {/* Line Chart */}
            <div className="sales-line-chart-section">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEEEEE" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
                    tickFormatter={(value) => {
                      if (value === 0) return '₦0';
                      if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
                      return `₦${(value / 1000).toFixed(0)}K`;
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [`₦${value.toLocaleString()}`, 'Sales']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #EEEEEE', fontFamily: 'var(--font-body)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--color-forest)" 
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: 'var(--color-forest)', stroke: 'var(--color-forest)', strokeWidth: 1 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Doughnut Chart */}
            <div className="sales-pie-chart-section">
              <h3 className="card-title" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', alignSelf: 'center' }}>
                Orders by Status
              </h3>
              
              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="pie-chart-center-label">
                  <span className="pie-chart-center-value">{orders.length}</span>
                  <span className="pie-chart-center-text">Total</span>
                </div>
              </div>

              {/* Pie Chart Legend */}
              <div className="pie-chart-legend">
                {statusData.map((item, idx) => (
                  <div key={idx} className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{item.value} ({item.percentage})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Card */}
        <div className="dashboard-card">
          <div className="card-header-container">
            <h2 className="card-title">Recent Activities</h2>
            <span className="card-header-link">View All</span>
          </div>
          
          <div className="activities-list">
            {recentActivities.map((act) => (
              <div 
                key={act.id} 
                className={`activity-item ${act.onClick ? 'clickable' : ''}`}
                onClick={act.onClick}
              >
                <div className={`activity-icon-wrapper ${act.colorClass}`}>
                  {act.icon}
                </div>
                <div className="activity-details">
                  <span className="activity-text">{act.text}</span>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders, Low Stock Alerts, Quick Actions */}
      <div className="dashboard-row-bottom">
        {/* Recent Orders Card */}
        <div className="dashboard-card">
          <div className="card-header-container">
            <h2 className="card-title">Recent Orders</h2>
            <span className="card-header-link">View All</span>
          </div>
          
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.id}</td>
                    <td>
                      <div className="customer-cell">
                        <img src={order.avatar} alt={order.customer} className="customer-avatar" />
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="dashboard-card">
          <div className="card-header-container">
            <h2 className="card-title">Low Stock Alerts</h2>
            <span className="card-header-link" onClick={() => navigate('/inventory')} style={{ cursor: 'pointer' }}>View All</span>
          </div>
          
          <div className="low-stock-list">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 4).map((item, idx) => (
                <div key={idx} className="low-stock-item">
                  <div className="low-stock-product-info">
                    <div className="low-stock-product-img-wrapper" style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-border)' }}>
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="low-stock-product-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '1rem' }}>📦</span>
                      )}
                    </div>
                    <div className="low-stock-product-meta" style={{ marginLeft: '0.75rem' }}>
                      <span className="low-stock-product-name">{item.name}</span>
                      <span className="low-stock-product-category">{item.category}</span>
                    </div>
                  </div>
                  <div className="low-stock-qty-badge">
                    {item.qty} {item.unit || 'kg'} in stock
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                🎉 All stock levels are healthy!
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card">
          <div className="card-header-container" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title">Quick Actions</h2>
          </div>
          
          <div className="quick-actions-grid">
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/products')}
            >
              <div className="quick-action-icon-circle">
                <Plus size={18} />
              </div>
              <span className="quick-action-label">Add New Product</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/orders')}
            >
              <div className="quick-action-icon-circle">
                <ShoppingCart size={18} />
              </div>
              <span className="quick-action-label">View Orders</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/settings')}
            >
              <div className="quick-action-icon-circle">
                <Settings size={18} />
              </div>
              <span className="quick-action-label">System Settings</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => navigate('/activity-gallery')}
            >
              <div className="quick-action-icon-circle">
                <ImageIcon size={18} />
              </div>
              <span className="quick-action-label">Upload Photos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
