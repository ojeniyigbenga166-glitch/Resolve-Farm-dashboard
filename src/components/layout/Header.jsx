import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, ChevronDown, X, ShoppingCart, AlertCircle, Inbox } from 'lucide-react';
import farmerAvatar from '../../assets/farmer_avatar.png';

export default function Header({ 
  onToggleMenu, 
  profile, 
  notifications = [], 
  onDismissNotification, 
  onClearAllNotifications 
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleNotificationClick = (item) => {
    // Navigate with target routing states (e.g. highlightOrderId or searchQuery)
    navigate(item.path, { state: item.state });
    onDismissNotification(item.id);
    setIsDropdownOpen(false);
  };

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
        
        {/* Dynamic Notification Wrapper */}
        <div className="header-notification-wrapper" ref={dropdownRef}>
          <button 
            className={`header-icon-btn ${isDropdownOpen ? 'active' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Toggle Notifications"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="notification-dropdown glassmorphic-dropdown">
              <div className="notification-dropdown-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={onClearAllNotifications}
                    className="clear-all-btn"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="notification-dropdown-body">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div 
                      key={item.id} 
                      className="notification-item"
                      onClick={() => handleNotificationClick(item)}
                    >
                      <div className={`notification-item-icon ${item.type}`}>
                        {item.type === 'low-stock' ? (
                          <AlertCircle size={14} />
                        ) : (
                          <ShoppingCart size={14} />
                        )}
                      </div>
                      
                      <div className="notification-item-content">
                        <span className="notification-item-title">{item.title}</span>
                        <span className="notification-item-desc">{item.description}</span>
                        <span className="notification-item-time">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <button 
                        className="notification-item-dismiss"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismissNotification(item.id);
                        }}
                        title="Dismiss"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="notification-empty-state">
                    <Inbox size={32} />
                    <p>All caught up!</p>
                    <span>No unread notifications</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="header-divider"></div>
        
        <div 
          className="user-profile-dropdown" 
          onClick={() => navigate('/settings')}
          title="View Settings"
        >
          <img 
            src={profile?.avatar || farmerAvatar} 
            alt={profile?.name || "Farm Manager"} 
            className="user-avatar-img" 
          />
          <span className="user-name-text">{profile?.name || "Farm Manager"}</span>
          <span className="user-role-chevron">
            <ChevronDown size={16} />
          </span>
        </div>
      </div>
    </header>
  );
}
