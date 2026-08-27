import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import FarmActivities from './pages/FarmActivities';
import ActivityGallery from './pages/ActivityGallery';
import Settings from './pages/Settings';

// Layout wrapper structure utilizing React Router's Outlet
function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <Header onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} />
        {isSidebarOpen && (
          <div 
            className="mobile-sidebar-overlay" 
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <main className="page-content">
          <Outlet />
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
          <Route path="farm-activities" element={<FarmActivities />} />
          <Route path="activity-gallery" element={<ActivityGallery />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
