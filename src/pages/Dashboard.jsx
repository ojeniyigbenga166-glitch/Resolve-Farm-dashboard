import React from 'react';
import StatCard from '../components/ui/StatCard';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Sprout, 
  Plus, 
  Image as ImageIcon, 
  Check, 
  AlertCircle,
  FileText
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

import habaneroImg from '../assets/habanero_pepper.png';
import cornImg from '../assets/african_corn.png';
import tomatoesImg from '../assets/roma_tomatoes.png';
import pepperImg from '../assets/yellow_bell_pepper.png';

export default function Dashboard() {
  // Sales Line Chart Data
  const salesData = [
    { name: 'May 1', sales: 100000 },
    { name: 'May 3', sales: 220000 },
    { name: 'May 6', sales: 180000 },
    { name: 'May 8', sales: 290000 },
    { name: 'May 11', sales: 490000 },
    { name: 'May 13', sales: 380000 },
    { name: 'May 16', sales: 580000 },
    { name: 'May 18', sales: 490000 },
    { name: 'May 21', sales: 620000 },
    { name: 'May 23', sales: 550000 },
    { name: 'May 26', sales: 790000 },
    { name: 'May 28', sales: 720000 },
    { name: 'May 31', sales: 980000 }
  ];

  // Doughnut Chart Data
  const statusData = [
    { name: 'Pending', value: 28, percentage: '20.9%', color: '#FBC02D' },
    { name: 'Processing', value: 38, percentage: '28.4%', color: '#81C784' },
    { name: 'Delivered', value: 56, percentage: '41.8%', color: '#163A24' },
    { name: 'Cancelled', value: 12, percentage: '9.0%', color: '#D94A38' }
  ];

  // Recent Orders Data
  const recentOrders = [
    { 
      id: 'RF-2024-0134', 
      customer: 'John Smith', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
      date: 'May 30, 2024', 
      status: 'pending', 
      total: '₦45,500' 
    },
    { 
      id: 'RF-2024-0133', 
      customer: 'Mary Johnson', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      date: 'May 30, 2024', 
      status: 'processing', 
      total: '₦32,000' 
    },
    { 
      id: 'RF-2024-0132', 
      customer: 'David Brown', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
      date: 'May 29, 2024', 
      status: 'delivered', 
      total: '₦78,000' 
    },
    { 
      id: 'RF-2024-0131', 
      customer: 'Sarah Williams', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
      date: 'May 29, 2024', 
      status: 'delivered', 
      total: '₦21,500' 
    },
    { 
      id: 'RF-2024-0130', 
      customer: 'Michael Davis', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      date: 'May 28, 2024', 
      status: 'cancelled', 
      total: '₦12,000' 
    }
  ];

  // Low Stock Items Data
  const lowStockItems = [
    { name: 'Habanero Pepper', category: 'Peppers', qty: 5, img: habaneroImg },
    { name: 'African Corn', category: 'Corn', qty: 7, img: cornImg },
    { name: 'Roma Tomatoes', category: 'Tomatoes', qty: 12, img: tomatoesImg },
    { name: 'Yellow Bell Pepper', category: 'Peppers', qty: 15, img: pepperImg }
  ];

  // Recent Activities Data
  const recentActivities = [
    {
      id: 1,
      text: <span>New order <strong>#RF-2024-0134</strong></span>,
      time: '2 minutes ago',
      icon: <Plus size={14} />,
      colorClass: 'green'
    },
    {
      id: 2,
      text: <span>Product <strong>"Habanero Pepper"</strong> stock updated</span>,
      time: '15 minutes ago',
      icon: <FileText size={14} />,
      colorClass: 'green'
    },
    {
      id: 3,
      text: <span>New photos added to <strong>Tomato Harvesting</strong></span>,
      time: '1 hour ago',
      icon: <ImageIcon size={14} />,
      colorClass: 'green'
    },
    {
      id: 4,
      text: <span>Low stock alert for <strong>African Corn</strong></span>,
      time: '2 hours ago',
      icon: <AlertCircle size={14} />,
      colorClass: 'red'
    },
    {
      id: 5,
      text: <span>Order <strong>#RF-2024-0131</strong> delivered</span>,
      time: '3 hours ago',
      icon: <Check size={14} />,
      colorClass: 'green'
    }
  ];

  const handleQuickAction = (actionName) => {
    alert(`Quick Action: "${actionName}" triggered! (Demo placeholder)`);
  };

  return (
    <div>
      {/* KPI Cards Grid */}
      <div className="stat-cards-grid">
        <StatCard 
          label="Total Revenue" 
          value="₦4,250,000" 
          icon={<DollarSign size={20} />} 
          iconBgType="green-bg"
          footer={{ prefix: 'This Month ', badgeText: '↑ 18.5%', badgeType: 'up', suffix: ' vs last month' }}
        />
        <StatCard 
          label="Total Orders" 
          value="134" 
          icon={<ShoppingCart size={20} />} 
          iconBgType="green-bg"
          footer={{ prefix: 'This Month ', badgeText: '↑ 12.6%', badgeType: 'up', suffix: ' vs last month' }}
        />
        <StatCard 
          label="Low Stock Items" 
          value="8" 
          icon={<Package size={20} />} 
          iconBgType="red-bg"
          footer={{ prefix: 'Needs Attention ', linkText: 'View Items', linkClass: 'red-link' }}
        />
        <StatCard 
          label="Active Products" 
          value="56" 
          icon={<Sprout size={20} />} 
          iconBgType="green-bg"
          footer={{ prefix: 'Published ', linkText: 'View All', linkClass: 'green-link' }}
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
                  <span className="pie-chart-center-value">134</span>
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
              <div key={act.id} className="activity-item">
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
            <span className="card-header-link">View All</span>
          </div>
          
          <div className="low-stock-list">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="low-stock-item">
                <div className="low-stock-product-info">
                  <img src={item.img} alt={item.name} className="low-stock-product-img" />
                  <div className="low-stock-product-meta">
                    <span className="low-stock-product-name">{item.name}</span>
                    <span className="low-stock-product-category">{item.category}</span>
                  </div>
                </div>
                <div className="low-stock-qty-badge">
                  {item.qty} in stock
                </div>
              </div>
            ))}
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
              onClick={() => handleQuickAction('Add New Product')}
            >
              <div className="quick-action-icon-circle">
                <Plus size={18} />
              </div>
              <span className="quick-action-label">Add New Product</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('View Orders')}
            >
              <div className="quick-action-icon-circle">
                <ShoppingCart size={18} />
              </div>
              <span className="quick-action-label">View Orders</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('Add Activity')}
            >
              <div className="quick-action-icon-circle">
                <Sprout size={18} />
              </div>
              <span className="quick-action-label">Add Activity</span>
            </button>
            <button 
              className="quick-action-btn"
              onClick={() => handleQuickAction('Upload Photos')}
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
