import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import farmerAvatar from '../../assets/farmer_avatar.png';

export default function Header({ onToggleMenu }) {
  const location = useLocation();
  
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard Overview';
      case '/products':
        return 'Products Management';
      case '/inventory':
        return 'Inventory Tracking';
      case '/orders':
        return 'Orders Processing';
      case '/farm-activities':
        return 'Farm Activities Log';
      case '/activity-gallery':
        return 'Farm Gallery';
      case '/settings':
        return 'System Settings';
      default:
        return 'Resolve Farm Admin';
    }
  };

  const isDashboard = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle-btn" onClick={onToggleMenu}>
          <Menu size={20} />
        </button>
        <div className="header-title-container">
          <h1 className="header-title">
            {getPageTitle(location.pathname)}
          </h1>
          {isDashboard && (
            <p className="header-subtitle">
              Welcome back! Here's what's happening on your farm today.
            </p>
          )}
        </div>
      </div>
      
      <div className="header-actions">
        <button className="header-icon-btn">
          <Search size={20} />
        </button>
        
        <button className="header-icon-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="header-divider"></div>
        
        <div className="user-profile-dropdown">
          <img 
            src={farmerAvatar} 
            alt="Farm Manager" 
            className="user-avatar-img" 
          />
          <span className="user-name-text">Farm Manager</span>
          <span className="user-role-chevron">
            <ChevronDown size={16} />
          </span>
        </div>
      </div>
    </header>
  );
}
