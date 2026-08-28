import React from 'react';

export default function StatCard({ label, value, icon, iconBgType = 'green-bg', footer }) {
  const isLowStock = label.toLowerCase().includes('low stock');
  
  return (
    <div className="stat-card">
      <div className="stat-card-details">
        <span className="stat-card-label">{label}</span>
        <span 
          className="stat-card-value" 
          style={isLowStock ? { color: 'var(--color-tomato)' } : {}}
        >
          {value}
        </span>
        {footer && (
          <div className="stat-card-footer">
            {footer.prefix && <span style={{ color: 'var(--color-text-muted)' }}>{footer.prefix}</span>}
            {footer.badgeText && (
              <span className={`stat-card-badge ${footer.badgeType || 'up'}`}>
                {footer.badgeText}
              </span>
            )}
            {footer.suffix && <span style={{ color: 'var(--color-text-muted)' }}>{footer.suffix}</span>}
            {footer.linkText && (
              <span 
                className={`stat-card-link ${footer.linkClass || ''}`}
                onClick={footer.onClick}
                style={footer.onClick ? { cursor: 'pointer' } : {}}
              >
                {footer.linkText}
              </span>
            )}
          </div>
        )}
      </div>
      {icon && (
        <div className={`stat-card-icon-container ${iconBgType}`}>
          {icon}
        </div>
      )}
    </div>
  );
}
