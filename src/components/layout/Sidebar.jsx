import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Layers, 
  ShoppingCart, 
  Image as ImageIcon, 
  Settings, 
  LogOut 
} from 'lucide-react';
import sidebarFarmerImg from '../../assets/sidebar_farmer.jpg';
import logoImg from '../../assets/logo.png';

export default function Sidebar({ isOpen, onClose }) {
  const menuGroups = [
    {
      title: "Shop Management",
      items: [
        { name: "Products", path: "/products", icon: <ShoppingBag size={18} /> },
        { name: "Inventory", path: "/inventory", icon: <Layers size={18} /> }
      ]
    },
    {
      title: "Order Management",
      items: [
        { name: "Orders", path: "/orders", icon: <ShoppingCart size={18} /> }
      ]
    },
    {
      title: "Farm Management",
      items: [
        { name: "Activity Gallery", path: "/activity-gallery", icon: <ImageIcon size={18} /> }
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
        { name: "Logout", path: "/logout", icon: <LogOut size={18} />, isAction: true }
      ]
    }
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    if (onClose) onClose();
    alert('Logout clicked (Placeholder action)');
  };

  const handleItemClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-top">
        {/* Logo area with transparent background */}
        <div className="sidebar-logo" style={{ padding: '1.25rem 1rem' }}>
          <img 
            src={logoImg} 
            alt="Resolve Farms Logo" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>
        
        <nav className="sidebar-menu">
          {/* Dashboard NavLink */}
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `sidebar-item${isActive ? ' active' : ''}`
            }
            end
            onClick={handleItemClick}
            style={{ marginBottom: '1.5rem' }}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>

          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="sidebar-group">
              <h3 className="sidebar-group-title">{group.title}</h3>
              {group.items.map((item, itemIdx) => {
                if (item.isAction) {
                  return (
                    <a 
                      key={itemIdx} 
                      href="#logout" 
                      onClick={handleLogout} 
                      className="sidebar-item"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </a>
                  );
                }
                return (
                  <NavLink 
                    key={itemIdx} 
                    to={item.path} 
                    className={({ isActive }) => 
                      `sidebar-item${isActive ? ' active' : ''}`
                    }
                    onClick={handleItemClick}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Farmer Banner Card at the bottom */}
      <div className="sidebar-farmer-container">
        <div 
          className="sidebar-farmer-card" 
          style={{ backgroundImage: `url(${sidebarFarmerImg})` }}
        >
          <div className="sidebar-farmer-overlay"></div>
          <div className="sidebar-farmer-text">
            <h4>Real Farms.<br /><span className="green-highlight">Real Impact.</span></h4>
          </div>
        </div>
      </div>
    </aside>
  );
}
