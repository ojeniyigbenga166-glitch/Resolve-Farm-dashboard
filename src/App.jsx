import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import ActivityGallery from './pages/ActivityGallery';
import Settings from './pages/Settings';
import { supabase } from './supabaseClient';

// Layout wrapper structure utilizing React Router's Outlet
function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const fetchProfileSettings = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return null;
      }
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (error) throw error;
      if (data) {
        const loadedProfile = {
          name: data.profile_name,
          email: data.profile_email,
          phone: data.profile_phone || '',
          role: data.profile_role,
          location: data.profile_location || '',
          avatar: data.profile_avatar,
          lowStockAlert: data.low_stock_alert,
          orderSuccessAlert: data.order_success_alert,
          weeklyReport: data.weekly_report
        };
        setProfile(loadedProfile);
        return loadedProfile;
      }
    } catch (err) {
      console.warn('Could not load profile settings from Supabase:', err.message);
    }
    return null;
  };

  const fetchNotifications = async (profileData) => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return;
      }
      const alerts = [];

      // 1. Fetch low stock items if enabled
      const showLowStockAlert = profileData ? profileData.lowStockAlert : true;
      if (showLowStockAlert) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        if (!productsError && productsData) {
          productsData.forEach(item => {
            if (item.qty <= item.min) {
              alerts.push({
                id: `stock-${item.id}`,
                type: 'low-stock',
                title: 'Low Stock Alert',
                description: `${item.name} (${item.qty} ${item.unit || 'kg'} left)`,
                path: '/inventory',
                state: { searchQuery: item.name },
                timestamp: item.created_at ? new Date(item.created_at) : new Date()
              });
            }
          });
        }
      }

      // 2. Fetch pending orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending');
      
      if (!ordersError && ordersData) {
        ordersData.forEach(o => {
          alerts.push({
            id: `order-${o.id}`,
            type: 'new-order',
            title: 'Pending Order',
            description: `Order #${o.id} placed by ${o.customer?.name || 'N/A'}`,
            path: '/orders',
            state: { highlightOrderId: o.id },
            timestamp: new Date(`${o.date} ${o.time}`)
          });
        });
      }

      // Sort by timestamp desc
      alerts.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(alerts);
    } catch (err) {
      console.warn('Could not compile notifications:', err.message);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const currentProfile = await fetchProfileSettings();
      await fetchNotifications(currentProfile);
    };
    initData();
  }, []);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <Header 
          onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
          profile={profile}
          notifications={notifications}
          onDismissNotification={dismissNotification}
          onClearAllNotifications={clearAllNotifications}
        />
        {isSidebarOpen && (
          <div 
            className="mobile-sidebar-overlay" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <main className="page-content">
          <Outlet context={{ profile, setProfile, fetchProfileSettings, notifications, setNotifications, fetchNotifications }} />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="activity-gallery" element={<ActivityGallery />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
