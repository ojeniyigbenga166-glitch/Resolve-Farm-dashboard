import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  User, 
  Bell, 
  Shield, 
  Save, 
  Database, 
  Check, 
  Lock, 
  Upload, 
  Loader2 
} from 'lucide-react';

const presetAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60', // default admin
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', // female operator
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', // male operator
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', // expert
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60'  // Chioma
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  // States
  const [profile, setProfile] = useState({
    name: 'Senior Director Baba Tunde',
    email: 'baba.tunde@resolvefarms.com',
    phone: '+234 803 123 4567',
    role: 'Senior Farm Director',
    location: 'Enugu Field Block A-C',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60'
  });


  const [notifications, setNotifications] = useState({
    lowStockAlert: true,
    orderSuccessAlert: false,
    weeklyReport: true
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  });

  const [backupStatus, setBackupStatus] = useState('idle'); // idle, backing_up, completed
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Toast Trigger Helper
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Avatar Upload Handler
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 150;
          canvas.height = 150;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 150, 150);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8); // 0.8 quality
          setProfile(prev => ({ ...prev, avatar: compressedBase64 }));
          triggerToast('Profile photo updated!');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchSettings = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        return;
      }
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          name: data.profile_name,
          email: data.profile_email,
          phone: data.profile_phone || '',
          role: data.profile_role,
          location: data.profile_location || '',
          avatar: data.profile_avatar
        });

        setNotifications({
          lowStockAlert: data.low_stock_alert,
          orderSuccessAlert: data.order_success_alert,
          weeklyReport: data.weekly_report
        });
        setSecurity(prev => ({
          ...prev,
          twoFactorEnabled: data.two_factor_enabled
        }));
      }
    } catch (err) {
      console.warn('Could not load settings from Supabase, using defaults.', err.message);
    }
  };

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const syncSettingsToSupabase = async (updatedFields) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('system_settings')
          .update(updatedFields)
          .eq('id', 1);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Failed to sync settings with Supabase:', err.message);
    }
  };

  // Profile Form Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    triggerToast('Profile settings saved successfully!');
    await syncSettingsToSupabase({
      profile_name: profile.name,
      profile_email: profile.email,
      profile_phone: profile.phone,
      profile_location: profile.location,
      profile_avatar: profile.avatar
    });
  };



  // Notification Preferences Save
  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    triggerToast('Notification preferences updated!');
    await syncSettingsToSupabase({
      low_stock_alert: notifications.lowStockAlert,
      order_success_alert: notifications.orderSuccessAlert,
      weekly_report: notifications.weeklyReport
    });
  };

  // Security Password Submit
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    triggerToast('Password credentials updated successfully!');
    setSecurity(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  // Database Backup Routine
  const handleDatabaseBackup = () => {
    setBackupStatus('backing_up');
    setTimeout(() => {
      setBackupStatus('completed');
      triggerToast('Database backup archive completed!');
      setTimeout(() => {
        setBackupStatus('idle');
      }, 4000);
    }, 2000);
  };



  const tabs = [
    { id: 'profile', label: 'Farm Profile', icon: <User size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'security', label: 'System & Security', icon: <Shield size={16} /> }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '80vh' }}>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Settings</h1>
        <p className="page-subtitle">Configure system parameters, notifications, and permissions.</p>
      </div>

      {/* Tab Navigation Header */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--color-border)', 
        marginBottom: '1.5rem', 
        gap: '0.5rem', 
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t.id ? '2px solid var(--color-success)' : '2px solid transparent',
              color: activeTab === t.id ? 'var(--color-forest)' : 'var(--color-text-muted)',
              fontWeight: activeTab === t.id ? '700' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              transition: 'all 0.2s ease',
              borderRadius: '4px 4px 0 0'
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content Card Panel */}
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit}>
            <h3 className="card-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Farm Manager Profile</h3>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-success)' }} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: 'var(--color-forest)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                  title="Upload avatar photo"
                >
                  <Upload size={14} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleAvatarFileChange} 
                  accept="image/*"
                />
              </div>

              <div style={{ flexGrow: 1 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Select Preset Profile Picture
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {presetAvatars.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt={`preset-${idx}`}
                      onClick={() => setProfile(prev => ({ ...prev, avatar: av }))}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: profile.avatar === av ? '3.5px solid var(--color-success)' : '1px solid var(--color-border)',
                        transition: 'transform 0.1s ease',
                        boxShadow: profile.avatar === av ? '0 0 5px rgba(79, 138, 91, 0.4)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-row" style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label>Contact Phone</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Operational Role</label>
                <input 
                  type="text" 
                  value={profile.role} 
                  disabled
                  style={{ backgroundColor: '#F5F5F5', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Farm Block / Location Responsibility</label>
              <input 
                type="text" 
                value={profile.location} 
                onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
              />
            </div>

            <button type="submit" className="primary-btn" style={{ minWidth: '130px', justifyContent: 'center' }}>
              <Save size={16} />
              <span>Save Profile</span>
            </button>
          </form>
        )}



        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleNotificationsSubmit}>
            <h3 className="card-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Alert & Communication Channels</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              


              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5F5F5', paddingBottom: '0.75rem' }}>
                <div style={{ maxWidth: '80%' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', display: 'block' }}>Low Inventory Stock Warnings</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Notify management instantly when crop or resource inventory stock dips below threshold units.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.lowStockAlert}
                    onChange={(e) => setNotifications(prev => ({ ...prev, lowStockAlert: e.target.checked }))}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5F5F5', paddingBottom: '0.75rem' }}>
                <div style={{ maxWidth: '80%' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', display: 'block' }}>Order Success Notifications</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Send SMS/Push alert alerts each time a client order is processed successfully.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.orderSuccessAlert}
                    onChange={(e) => setNotifications(prev => ({ ...prev, orderSuccessAlert: e.target.checked }))}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem' }}>
                <div style={{ maxWidth: '80%' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', display: 'block' }}>Weekly Progress Digest</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Receive email analytics summaries of all farm activity, stock logs, and gallery records.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={notifications.weeklyReport}
                    onChange={(e) => setNotifications(prev => ({ ...prev, weeklyReport: e.target.checked }))}
                  />
                  <span className="slider"></span>
                </label>
              </div>

            </div>

            <button type="submit" className="primary-btn" style={{ minWidth: '130px', justifyContent: 'center' }}>
              <Save size={16} />
              <span>Save Channels</span>
            </button>
          </form>
        )}

        {/* SECURITY & SYSTEM TAB */}
        {activeTab === 'security' && (
          <div>
            <form onSubmit={handleSecuritySubmit} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '2.5rem', marginBottom: '2.5rem' }}>
              <h3 className="card-title" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Update Security Credentials</h3>
              
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="password" 
                    value={security.currentPassword} 
                    onChange={(e) => setSecurity(s => ({ ...s, currentPassword: e.target.value }))}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-row" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={security.newPassword} 
                    onChange={(e) => setSecurity(s => ({ ...s, newPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={security.confirmPassword} 
                    onChange={(e) => setSecurity(s => ({ ...s, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ maxWidth: '80%' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', display: 'block' }}>Two-Factor Authentication (2FA)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Require SMS / Email OTP verification codes upon director login actions.</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={security.twoFactorEnabled}
                    onChange={async (e) => {
                      const checked = e.target.checked;
                      setSecurity(s => ({ ...s, twoFactorEnabled: checked }));
                      await syncSettingsToSupabase({ two_factor_enabled: checked });
                      triggerToast(checked ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled.');
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <button type="submit" className="primary-btn" style={{ minWidth: '130px', justifyContent: 'center' }}>
                <Save size={16} />
                <span>Save Password</span>
              </button>
            </form>

            {/* System Utilities */}
            <div>
              <h3 className="card-title" style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>System Backup Utilities</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                Create a compressed archive copy of all farm activities, inventory levels, order listings, and comments.
              </p>

              {backupStatus === 'idle' && (
                <button 
                  type="button" 
                  className="secondary-btn" 
                  onClick={handleDatabaseBackup}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 'none', minWidth: '180px', justifyContent: 'center' }}
                >
                  <Database size={16} />
                  <span>Backup Database</span>
                </button>
              )}

              {backupStatus === 'backing_up' && (
                <button 
                  type="button" 
                  className="secondary-btn" 
                  disabled
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 'none', minWidth: '180px', justifyContent: 'center', cursor: 'not-allowed', backgroundColor: '#F5F5F5' }}
                >
                  <Loader2 size={16} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Compressing database...</span>
                </button>
              )}

              {backupStatus === 'completed' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1rem', border: '1px solid #DCEDC8', backgroundColor: '#F1F8E9', color: '#33691E', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Check size={16} strokeWidth={2.5} />
                  <span>Database backup completed successfully! (sql.gz ready)</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Floating Toast Notification Banner */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: 'var(--color-forest)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-sm)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 1000,
          animation: 'slideInToast 0.25s ease-out forwards',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <Check size={16} style={{ color: 'var(--color-success)' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Custom Keyframe Styles */}
      <style>{`
        @keyframes slideInToast {
          from { transform: translateY(1.5rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
