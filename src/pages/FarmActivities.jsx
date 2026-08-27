import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Grid, 
  Calendar, 
  Clock, 
  Check, 
  AlertTriangle, 
  Edit2, 
  Trash2, 
  X, 
  Sprout
} from 'lucide-react';

// Predefined Staff List for Assigments
const staffList = [
  { name: 'Baba Tunde', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
  { name: 'Ngozi Obi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  { name: 'Musa Haruna', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
  { name: 'Chioma Ade', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' }
];

// Predefined Crops List for associations
const cropList = [
  'None',
  'Habanero Pepper',
  'African Corn',
  'Roma Tomatoes',
  'Yellow Bell Pepper',
  'Cassava Tubers',
  'Sweet Potatoes'
];

// Initial mock activities data
const initialActivities = [
  {
    id: 1,
    title: 'Transplanting Roma Tomato Seedlings',
    category: 'Planting',
    priority: 'High',
    status: 'completed',
    crop: 'Roma Tomatoes',
    date: '2026-08-25',
    operator: staffList[0],
    subtasks: [
      { id: 101, text: 'Prepare soil beds in Field Block A', completed: true },
      { id: 102, text: 'Check drip line emitters water flow', completed: true },
      { id: 103, text: 'Apply root stimulant solution', completed: true },
      { id: 104, text: 'Transplant 120 seedlings from greenhouse', completed: true }
    ],
    notes: 'Seedlings are extremely healthy. Transplanted during overcast morning to reduce stress. Soil moisture is at optimal 72%.'
  },
  {
    id: 2,
    title: 'Weeding Habanero Pepper Plot',
    category: 'Weeding',
    priority: 'Medium',
    status: 'in-progress',
    crop: 'Habanero Pepper',
    date: '2026-08-27',
    operator: staffList[1],
    subtasks: [
      { id: 201, text: 'Remove broadleaf weeds along Row 1-6', completed: true },
      { id: 202, text: 'Hand-weed around root zones in Row 7-12', completed: false },
      { id: 203, text: 'Check for signs of leaf miners or aphids', completed: false }
    ],
    notes: 'Focus on close weed removal near roots. Keep an eye out for early whitefly or leaf miner infestations. Report any crop yellowing.'
  },
  {
    id: 3,
    title: 'Irrigation Pump Filter Cleaning',
    category: 'Maintenance',
    priority: 'High',
    status: 'scheduled',
    crop: 'None',
    date: '2026-08-28',
    operator: staffList[2],
    subtasks: [
      { id: 301, text: 'Shut down Main Pump A', completed: false },
      { id: 302, text: 'Flush disc filters with pressurized water', completed: false },
      { id: 303, text: 'Check pressure release valves', completed: false },
      { id: 304, text: 'Restart pump and verify system pressure (2.4 bar)', completed: false }
    ],
    notes: 'Critical monthly maintenance. Pump has been showing slight pressure drop, likely due to filter sediment buildup.'
  },
  {
    id: 4,
    title: 'Fertilizer Application (NPK 15-15-15)',
    category: 'Fertilizing',
    priority: 'Low',
    status: 'scheduled',
    crop: 'African Corn',
    date: '2026-08-30',
    operator: staffList[3],
    subtasks: [
      { id: 401, text: 'Measure NPK quantities for Block C', completed: false },
      { id: 402, text: 'Load fertilizer into venturi injector system', completed: false },
      { id: 403, text: 'Run fertigation cycle for 45 minutes', completed: false }
    ],
    notes: 'Apply according to maize growth cycle plan. Ensure soil is moderately pre-moistened.'
  },
  {
    id: 5,
    title: 'Neem Oil Pest Spraying',
    category: 'Pest Control',
    priority: 'High',
    status: 'delayed',
    crop: 'Roma Tomatoes',
    date: '2026-08-26',
    operator: staffList[1],
    subtasks: [
      { id: 501, text: 'Mix neem oil with mild dish soap emulsifier', completed: true },
      { id: 502, text: 'Spray underside of foliage in Block A', completed: false },
      { id: 503, text: 'Clean spray equipment and safety gear', completed: false }
    ],
    notes: 'Delayed due to heavy rainfall on Aug 26. Need to execute as soon as foliage is dry to prevent dilution.'
  },
  {
    id: 6,
    title: 'Sweet Potato Harvesting',
    category: 'Harvesting',
    priority: 'Medium',
    status: 'completed',
    crop: 'Sweet Potatoes',
    date: '2026-08-22',
    operator: staffList[0],
    subtasks: [
      { id: 601, text: 'Mow vine foliage in Block D', completed: true },
      { id: 602, text: 'Lift tubers with harvesting forks', completed: true },
      { id: 603, text: 'Grade tubers and bag in 50kg sacks', completed: true },
      { id: 604, text: 'Log yield weight and move to storage', completed: true }
    ],
    notes: 'Successfully harvested. Yielded 14 bags. Quality is high, low pest puncture rate.'
  }
];

export default function FarmActivities() {
  const [activities, setActivities] = useState(initialActivities);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' or 'edit'
  const [editingActivityId, setEditingActivityId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Planting',
    priority: 'Medium',
    crop: 'None',
    date: '',
    operatorName: 'Baba Tunde',
    notes: ''
  });

  const [subtasksFormList, setSubtasksFormList] = useState([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Stats calculation
  const totalActivities = activities.length;
  const inProgressCount = activities.filter(a => a.status === 'in-progress').length;
  const completedCount = activities.filter(a => a.status === 'completed').length;
  const delayedCount = activities.filter(a => a.status === 'delayed').length;

  // Toggle individual checklist subtask
  const handleToggleSubtask = (activityId, subtaskId) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === activityId) {
          const updatedSubtasks = activity.subtasks.map(sub => {
            if (sub.id === subtaskId) {
              return { ...sub, completed: !sub.completed };
            }
            return sub;
          });

          // Automatically set status to in-progress if a subtask is toggled and it was scheduled
          let nextStatus = activity.status;
          if (activity.status === 'scheduled') {
            nextStatus = 'in-progress';
          }
          
          // If all subtasks are completed, do NOT auto-complete just in case, but keep track
          return { ...activity, subtasks: updatedSubtasks, status: nextStatus };
        }
        return activity;
      })
    );
  };

  // Mark task as fully completed
  const handleMarkCompleted = (id) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === id) {
          // Check all subtasks
          const completedSubtasks = activity.subtasks.map(sub => ({ ...sub, completed: true }));
          return { ...activity, status: 'completed', subtasks: completedSubtasks };
        }
        return activity;
      })
    );
  };

  // Delete activity handler
  const handleDeleteActivity = (id, title) => {
    if (window.confirm(`Are you sure you want to delete the activity "${title}"?`)) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  // Drawer Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Subtasks list editor in Form
  const handleAddFormSubtask = () => {
    if (newSubtaskInput.trim()) {
      setSubtasksFormList(prev => [
        ...prev,
        { id: Date.now() + Math.random(), text: newSubtaskInput.trim(), completed: false }
      ]);
      setNewSubtaskInput('');
    }
  };

  const handleRemoveFormSubtask = (id) => {
    setSubtasksFormList(prev => prev.filter(item => item.id !== id));
  };

  // Open Add Drawer
  const handleOpenAddDrawer = () => {
    setFormData({
      title: '',
      category: 'Planting',
      priority: 'Medium',
      crop: 'None',
      date: new Date().toISOString().split('T')[0], // Default to today
      operatorName: 'Baba Tunde',
      notes: ''
    });
    setSubtasksFormList([]);
    setNewSubtaskInput('');
    setDrawerMode('add');
    setEditingActivityId(null);
    setIsDrawerOpen(true);
  };

  // Open Edit Drawer
  const handleOpenEditDrawer = (activity) => {
    setFormData({
      title: activity.title,
      category: activity.category,
      priority: activity.priority,
      crop: activity.crop,
      date: activity.date,
      operatorName: activity.operator.name,
      notes: activity.notes
    });
    setSubtasksFormList([...activity.subtasks]);
    setNewSubtaskInput('');
    setDrawerMode('edit');
    setEditingActivityId(activity.id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Save Activity Form submission
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Activity title is required.');
      return;
    }
    if (!formData.date) {
      alert('Scheduled date is required.');
      return;
    }

    const assignedOperator = staffList.find(s => s.name === formData.operatorName) || staffList[0];

    const savedActivity = {
      id: drawerMode === 'add' ? Date.now() : editingActivityId,
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
      crop: formData.crop,
      date: formData.date,
      operator: assignedOperator,
      subtasks: subtasksFormList,
      notes: formData.notes.trim(),
      status: drawerMode === 'add' ? 'scheduled' : activities.find(a => a.id === editingActivityId)?.status || 'scheduled'
    };

    if (drawerMode === 'add') {
      setActivities(prev => [savedActivity, ...prev]);
    } else {
      setActivities(prev => prev.map(a => a.id === editingActivityId ? { ...a, ...savedActivity } : a));
    }

    setIsDrawerOpen(false);
  };

  // Filtered Activities
  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          act.operator.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || act.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending (latest first)

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Farm Activities</h1>
        <p className="page-subtitle">Schedule, track, and log operations across your farm blocks.</p>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="products-summary-ribbon" style={{ marginBottom: '1.5rem' }}>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Total Activities</span>
            <span className="summary-card-value">{totalActivities}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' }}>
            <Calendar size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">In Progress</span>
            <span className="summary-card-value" style={{ color: 'var(--color-warning)' }}>{inProgressCount}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(216, 163, 26, 0.08)', color: 'var(--color-warning)' }}>
            <Clock size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Completed</span>
            <span className="summary-card-value" style={{ color: 'var(--color-success)' }}>{completedCount}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(79, 138, 91, 0.08)', color: 'var(--color-success)' }}>
            <Check size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Delayed / Alerts</span>
            <span className="summary-card-value" style={{ color: 'var(--color-tomato)' }}>{delayedCount}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(217, 74, 56, 0.08)', color: 'var(--color-tomato)' }}>
            <AlertTriangle size={16} />
          </div>
        </div>
      </div>

      {/* Filter and Action bar */}
      <div className="products-top-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="products-filters-left">
          <div className="search-input-wrapper">
            <Search size={16} className="search-input-icon" />
            <input 
              type="text" 
              placeholder="Search tasks, crops, operators..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Planting">Planting</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Weeding">Weeding</option>
            <option value="Fertilizing">Fertilizing</option>
            <option value="Pest Control">Pest Control</option>
            <option value="Harvesting">Harvesting</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <select 
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>

        <div className="products-actions-right">
          <div className="view-toggle-buttons">
            <button 
              className={`view-toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              title="Timeline View"
            >
              <Clock size={16} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card View"
            >
              <Grid size={16} />
            </button>
          </div>

          <button className="primary-btn" onClick={handleOpenAddDrawer}>
            <Plus size={16} />
            <span>Schedule Activity</span>
          </button>
        </div>
      </div>

      {/* Main Timeline View */}
      {viewMode === 'timeline' ? (
        <div className="activity-timeline">
          {filteredActivities.map((act) => {
            const totalSub = act.subtasks.length;
            const completedSub = act.subtasks.filter(s => s.completed).length;
            const percent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
            
            return (
              <div key={act.id} className="timeline-item">
                <div className={`timeline-node ${act.status}`}></div>
                
                <div className={`timeline-card border-priority-${act.priority.toLowerCase()}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span className={`status-badge ${act.status}`}>
                          {act.status === 'in-progress' ? 'In Progress' : act.status.charAt(0).toUpperCase() + act.status.slice(1)}
                        </span>
                        <span className={`priority-badge ${act.priority.toLowerCase()}`}>{act.priority} Priority</span>
                        <span className="gallery-tag category" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>{act.category}</span>
                        {act.crop !== 'None' && (
                          <span className="crop-tag-indicator">
                            <Sprout size={10} />
                            {act.crop}
                          </span>
                        )}
                      </div>
                      
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.25rem 0' }}>{act.title}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={12} className="text-muted" />
                        {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="operator-badge" title={`Assigned to ${act.operator.name}`}>
                        <img src={act.operator.avatar} alt={act.operator.name} className="operator-avatar" />
                        <span>{act.operator.name}</span>
                      </div>
                      
                      <div className="product-card-actions">
                        <button className="icon-action-btn" onClick={() => handleOpenEditDrawer(act)} title="Edit Task">
                          <Edit2 size={13} />
                        </button>
                        <button className="icon-action-btn delete" onClick={() => handleDeleteActivity(act.id, act.title)} title="Delete Task">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {act.notes && (
                    <p style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--color-text-muted)', 
                      backgroundColor: '#F8F9FA', 
                      padding: '0.65rem 0.85rem', 
                      borderRadius: '6px', 
                      margin: '0.75rem 0 0.5rem 0', 
                      fontStyle: 'italic', 
                      borderLeft: '3px solid #E0E0E0',
                      lineHeight: '1.4'
                    }}>
                      {act.notes}
                    </p>
                  )}
                  
                  {totalSub > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div className="progress-container">
                        <span style={{ fontWeight: 600 }}>Task Checklist</span>
                        <span style={{ flexGrow: 1, textAlign: 'right' }}>{completedSub}/{totalSub} Completed ({percent}%)</span>
                      </div>
                      <div className="progress-track-bg">
                        <div className="progress-track-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                      
                      <div className="subtasks-list">
                        {act.subtasks.map((sub) => (
                          <label key={sub.id} className="subtask-item">
                            <input 
                              type="checkbox" 
                              checked={sub.completed}
                              onChange={() => handleToggleSubtask(act.id, sub.id)}
                              disabled={act.status === 'completed'}
                            />
                            <span className={sub.completed ? 'subtask-text-completed' : ''}>
                              {sub.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {act.status !== 'completed' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #EEEEEE', paddingTop: '0.75rem' }}>
                      <button 
                        className="secondary-btn" 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', fontSize: '0.75rem', flex: 'none' }}
                        onClick={() => handleMarkCompleted(act.id)}
                      >
                        <Check size={12} />
                        <span>Mark as Complete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredActivities.length === 0 && (
            <div className="dashboard-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>No farm activities found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : (
        /* Card Grid View */
        <div className="products-grid">
          {filteredActivities.map((act) => {
            const totalSub = act.subtasks.length;
            const completedSub = act.subtasks.filter(s => s.completed).length;
            const percent = totalSub > 0 ? Math.round((completedSub / totalSub) * 100) : 0;
            
            return (
              <div key={act.id} className={`timeline-card border-priority-${act.priority.toLowerCase()}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className={`status-badge ${act.status}`}>
                      {act.status === 'in-progress' ? 'In Progress' : act.status.charAt(0).toUpperCase() + act.status.slice(1)}
                    </span>
                    <span className={`priority-badge ${act.priority.toLowerCase()}`}>{act.priority} Priority</span>
                  </div>
                  
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest)', margin: '0.25rem 0' }}>{act.title}</h3>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.35rem 0' }}>
                    <span className="gallery-tag category" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>{act.category}</span>
                    {act.crop !== 'None' && (
                      <span className="crop-tag-indicator" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                        <Sprout size={10} />
                        {act.crop}
                      </span>
                    )}
                  </div>
                  
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <Calendar size={11} />
                    {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>

                  {act.notes && (
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--color-text-muted)', 
                      backgroundColor: '#F8F9FA', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      margin: '0.5rem 0', 
                      fontStyle: 'italic', 
                      borderLeft: '2px solid #E0E0E0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {act.notes}
                    </p>
                  )}
                  
                  {totalSub > 0 && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <div className="progress-container" style={{ margin: '0.25rem 0', fontSize: '0.7rem' }}>
                        <span style={{ fontWeight: 600 }}>Progress</span>
                        <span style={{ flexGrow: 1, textAlign: 'right' }}>{completedSub}/{totalSub} ({percent}%)</span>
                      </div>
                      <div className="progress-track-bg" style={{ height: '4px' }}>
                        <div className="progress-track-fill" style={{ width: `${percent}%` }}></div>
                      </div>
                      
                      <div className="subtasks-list" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {act.subtasks.map((sub) => (
                          <label key={sub.id} className="subtask-item">
                            <input 
                              type="checkbox" 
                              checked={sub.completed}
                              onChange={() => handleToggleSubtask(act.id, sub.id)}
                              disabled={act.status === 'completed'}
                            />
                            <span className={sub.completed ? 'subtask-text-completed' : ''}>
                              {sub.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #EEEEEE', paddingTop: '0.75rem' }}>
                  {act.status !== 'completed' && (
                    <button 
                      className="secondary-btn" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                      onClick={() => handleMarkCompleted(act.id)}
                    >
                      <Check size={11} />
                      <span>Complete Task</span>
                    </button>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="operator-badge" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}>
                      <img src={act.operator.avatar} alt={act.operator.name} className="operator-avatar" />
                      <span>{act.operator.name.split(' ')[0]}</span>
                    </div>
                    
                    <div className="product-card-actions">
                      <button className="icon-action-btn" onClick={() => handleOpenEditDrawer(act)} title="Edit Task">
                        <Edit2 size={13} />
                      </button>
                      <button className="icon-action-btn delete" onClick={() => handleDeleteActivity(act.id, act.title)} title="Delete Task">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredActivities.length === 0 && (
            <div className="dashboard-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)' }}>No farm activities found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Slide-out Sidebar Drawer Form Markup */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={handleCloseDrawer}
      ></div>

      <div className={`product-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">
            {drawerMode === 'add' ? 'Schedule Farm Activity' : 'Edit Activity Details'}
          </h2>
          <button className="drawer-close-btn" onClick={handleCloseDrawer}>
            <X size={18} />
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleSaveActivity}>
          <div className="form-group">
            <label>Activity Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g. Drip Irrigation Installation"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Planting">Planting</option>
                <option value="Irrigation">Irrigation</option>
                <option value="Weeding">Weeding</option>
                <option value="Fertilizing">Fertilizing</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Associated Crop</label>
              <select 
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
              >
                {cropList.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Scheduled Date</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Assigned Operator</label>
            <select 
              name="operatorName"
              value={formData.operatorName}
              onChange={handleInputChange}
            >
              {staffList.map((staff, idx) => (
                <option key={idx} value={staff.name}>{staff.name}</option>
              ))}
            </select>
          </div>

          {/* Subtask checklist manager */}
          <div className="form-group">
            <label>Task Checklist (Sub-tasks)</label>
            <div className="checklist-creator-wrapper">
              <div className="checklist-creator-input-row">
                <input 
                  type="text" 
                  placeholder="Add a checklist item (e.g. Check pump pressure)"
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFormSubtask();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="primary-btn" 
                  style={{ padding: '0.4rem 0.75rem', flex: 'none' }}
                  onClick={handleAddFormSubtask}
                >
                  Add
                </button>
              </div>

              {subtasksFormList.length > 0 ? (
                <div className="checklist-creator-items-list">
                  {subtasksFormList.map((item) => (
                    <div key={item.id} className="checklist-creator-item">
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                        {item.text}
                      </span>
                      <button 
                        type="button" 
                        style={{ color: 'var(--color-tomato)', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        onClick={() => handleRemoveFormSubtask(item.id)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic', textAlign: 'center', padding: '0.5rem 0' }}>
                  No checklist items added yet.
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Notes / Instructions</label>
            <textarea 
              name="notes"
              placeholder="Provide operation details, block info, or safety measures..."
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              style={{
                width: '100%',
                backgroundColor: 'var(--color-white)',
                border: '1px solid var(--color-border)',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--color-text)',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>

          <div className="drawer-footer">
            <button type="button" className="secondary-btn" onClick={handleCloseDrawer}>
              Cancel
            </button>
            <button type="submit" className="primary-btn" style={{ flex: 1, justifyContent: 'center' }}>
              <Check size={16} />
              <span>Save Activity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
