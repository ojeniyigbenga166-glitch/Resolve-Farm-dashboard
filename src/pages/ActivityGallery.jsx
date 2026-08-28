import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Plus, 
  Search, 
  X, 
  Send, 
  User, 
  Image as ImageIcon,
  Trash2, 
  Sprout,
  Check
} from 'lucide-react';

// Import image assets
import habaneroImg from '../assets/habanero_pepper.png';
import cornImg from '../assets/african_corn.png';
import tomatoesImg from '../assets/roma_tomatoes.png';
import pepperImg from '../assets/yellow_bell_pepper.png';
import cassavaImg from '../assets/cassava_tubers.png';
import potatoesImg from '../assets/sweet_potatoes.png';

// Predefined available categories
const categoriesList = [
  'Growth Progress',
  'Harvesting',
  'Pests & Diseases',
  'Infrastructure',
  'Soil & Irrigation'
];

// Predefined Crops List
const cropsList = [
  'Roma Tomatoes',
  'Habanero Pepper',
  'African Corn',
  'Cassava Tubers',
  'Sweet Potatoes',
  'Yellow Bell Pepper',
  'Organic Carrots',
  'Green Beans',
  'Sweet Corn',
  'None'
];

// Predefined staff list
const staffList = [
  { name: 'Ngozi Obi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' },
  { name: 'Baba Tunde', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60' },
  { name: 'Musa Haruna', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60' },
  { name: 'Chioma Ade', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' }
];

// Initial mock gallery logs
const initialGalleryLogs = [
  {
    id: 1,
    title: 'Tomato Flowering Stage in Block A',
    crop: 'Roma Tomatoes',
    category: 'Growth Progress',
    img: tomatoesImg,
    date: '2026-08-25',
    author: staffList[0],
    description: 'First flowering nodes observed in row 3 to 10 of Field Block A. Soil moisture levels are hovering around 70%. Pollinator activity is excellent. No pests observed.',
    telemetry: {
      stage: 'Flowering',
      moisture: '70%',
      ph: '6.4',
      temp: '28°C'
    },
    comments: [
      { id: 1001, author: 'Baba Tunde', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', text: 'Flower density looks much better than last season.', time: '2 days ago' },
      { id: 1002, author: 'Chioma Ade', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', text: 'Keep moisture high this week to prevent early bud drop.', time: '1 day ago' }
    ]
  },
  {
    id: 2,
    title: 'Habanero Peppers Color Turn',
    crop: 'Habanero Pepper',
    category: 'Growth Progress',
    img: habaneroImg,
    date: '2026-08-24',
    author: staffList[1],
    description: 'Peppers are starting to ripen and change color from dark green to bright orange/red. Harvesting scheduled to begin next Monday.',
    telemetry: {
      stage: 'Ripening',
      moisture: '65%',
      ph: '6.2',
      temp: '30°C'
    },
    comments: [
      { id: 2001, author: 'Ngozi Obi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Ready to pick on Monday. I will prepare the crates.', time: '2 days ago' }
    ]
  },
  {
    id: 3,
    title: 'Maize Height Performance Block C',
    crop: 'African Corn',
    category: 'Growth Progress',
    img: cornImg,
    date: '2026-08-22',
    author: staffList[2],
    description: 'Corn stands have reached average heights of 1.8m. Stalk width is excellent. Color is deep forest green, indicating adequate nitrogen availability.',
    telemetry: {
      stage: 'Vegetative (V8)',
      moisture: '68%',
      ph: '6.5',
      temp: '29°C'
    },
    comments: [
      { id: 3001, author: 'Chioma Ade', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', text: 'Fertigation cycle in Block C is showing great results.', time: '3 days ago' }
    ]
  },
  {
    id: 4,
    title: 'Cassava Harvest Selection Block B',
    crop: 'Cassava Tubers',
    category: 'Harvesting',
    img: cassavaImg,
    date: '2026-08-19',
    author: staffList[3],
    description: 'First block harvest. Tuber sizing checked. Average weight per plant stands at 4.2kg, exceeding our 3.8kg baseline.',
    telemetry: {
      stage: 'Harvest Ready',
      moisture: '58%',
      ph: '5.9',
      temp: '27°C'
    },
    comments: [
      { id: 4001, author: 'Baba Tunde', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', text: 'Tubers are large and firm. Excellent starch quality.', time: '1 week ago' }
    ]
  },
  {
    id: 5,
    title: 'Sweet Potato Grading after Harvest',
    crop: 'Sweet Potatoes',
    category: 'Harvesting',
    img: potatoesImg,
    date: '2026-08-18',
    author: staffList[1],
    description: 'Tubers dug from Field Block D have been spread in storage shed to dry. Grade A yield is estimated at 75%.',
    telemetry: {
      stage: 'Post-Harvest',
      moisture: '50%',
      ph: '6.0',
      temp: '26°C'
    },
    comments: [
      { id: 5001, author: 'Musa Haruna', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', text: 'No signs of wireworm or rot. Good work.', time: '1 week ago' }
    ]
  },
  {
    id: 6,
    title: 'Bell Peppers in shade greenhouse 2',
    crop: 'Yellow Bell Pepper',
    category: 'Infrastructure',
    img: pepperImg,
    date: '2026-08-21',
    author: staffList[0],
    description: 'Shade net settings adjusted. Greenhouse temperature drop of 3.5 degrees logged. Peppers sizing up uniformly.',
    telemetry: {
      stage: 'Fruiting',
      moisture: '75%',
      ph: '6.3',
      temp: '25°C'
    },
    comments: [
      { id: 6001, author: 'Ngozi Obi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60', text: 'Ripening expected in about 12 days.', time: '5 days ago' }
    ]
  }
];

export default function ActivityGallery() {
  const [logs, setLogs] = useState(initialGalleryLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Lightbox modal State
  const [activeLog, setActiveLog] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Custom File Uploader State
  const fileInputRef = React.useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 0.7 quality
        setFormData(prev => ({
          ...prev,
          imgUrl: compressedBase64
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Drawer Upload State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    crop: 'Roma Tomatoes',
    category: 'Growth Progress',
    description: '',
    authorName: 'Ngozi Obi',
    imgUrl: ''
  });

  const fetchLogs = async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        setLogs(initialGalleryLogs);
        return;
      }

      // Fetch logs from table
      const { data: logsData, error: logsError } = await supabase
        .from('gallery_logs')
        .select('*')
        .order('id', { ascending: false });

      if (logsError) throw logsError;

      // Fetch comments from table
      const { data: commentsData, error: commentsError } = await supabase
        .from('gallery_comments')
        .select('*');

      if (commentsError) throw commentsError;

      // Format and join logs with their comments
      const formattedLogs = logsData.map(log => {
        const logComments = (commentsData || [])
          .filter(c => c.log_id === log.id)
          .map(c => ({
            id: c.id,
            author: c.author,
            avatar: c.avatar,
            text: c.text,
            time: c.time
          }));

        return {
          id: log.id,
          title: log.title,
          crop: log.crop,
          category: log.category,
          img: log.img,
          date: log.date,
          author: {
            name: log.author_name,
            avatar: log.author_avatar
          },
          description: log.description,
          telemetry: log.telemetry || { stage: 'N/A', moisture: 'N/A', ph: 'N/A', temp: 'N/A' },
          comments: logComments
        };
      });

      setLogs(formattedLogs);
    } catch (err) {
      console.warn('Supabase tables not configured yet or connection failed, using initial mock data.', err.message);
      setLogs(initialGalleryLogs);
    }
  };

  // Fetch logs and comments on mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // Calculate Overview details
  const totalLogs = logs.length;
  const cropCoverageCount = new Set(logs.map(l => l.crop).filter(c => c !== 'None')).size;
  const totalContributorsCount = new Set(logs.map(l => l.author.name)).size;

  // Add a comment to active lightbox image
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'Administrator',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60', // admin default avatar
      text: newCommentText.trim(),
      time: 'Just now'
    };

    // Optimistic UI updates
    setLogs(prevLogs => 
      prevLogs.map(log => {
        if (log.id === activeLog.id) {
          const updatedComments = [...log.comments, newComment];
          setActiveLog(prev => ({ ...prev, comments: updatedComments }));
          return { ...log, comments: updatedComments };
        }
        return log;
      })
    );

    setNewCommentText('');

    // Write to Supabase
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('gallery_comments')
          .insert([{
            log_id: activeLog.id,
            author: newComment.author,
            avatar: newComment.avatar,
            text: newComment.text,
            time: newComment.time
          }]);
        
        if (error) {
          console.warn('Could not insert comment in Supabase (possibly a local mock log):', error.message);
        } else {
          fetchLogs(); // sync DB IDs
        }
      }
    } catch (err) {
      console.error('Error writing comment to Supabase:', err);
    }
  };

  // Delete media log entry
  const handleDeleteLog = async (e, id, title) => {
    e.stopPropagation(); // Avoid opening Lightbox
    if (window.confirm(`Are you sure you want to delete the media log: "${title}"?`)) {
      // Local UI update
      setLogs(prev => prev.filter(l => l.id !== id));
      if (activeLog && activeLog.id === id) {
        setActiveLog(null);
      }

      // Delete from Supabase
      try {
        if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
          const { error } = await supabase
            .from('gallery_logs')
            .delete()
            .eq('id', id);
          
          if (error) {
            console.warn('Could not delete log from Supabase (possibly a local mock log):', error.message);
          } else {
            fetchLogs();
          }
        }
      } catch (err) {
        console.error('Error deleting log from Supabase:', err);
      }
    }
  };

  // Open Log Drawer
  const handleOpenAddDrawer = () => {
    setFormData({
      title: '',
      crop: 'Roma Tomatoes',
      category: 'Growth Progress',
      description: '',
      authorName: 'Ngozi Obi',
      imgUrl: ''
    });
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle inputs in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle saving log form submission
  const handleSaveLog = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Caption title is required.');
      return;
    }
    if (!formData.imgUrl) {
      alert('Please select an image for this log.');
      return;
    }

    const assignedAuthor = staffList.find(s => s.name === formData.authorName) || staffList[0];

    const savedLog = {
      id: Date.now(),
      title: formData.title.trim(),
      crop: formData.crop,
      category: formData.category,
      img: formData.imgUrl,
      date: new Date().toISOString().split('T')[0], // Logged today
      author: assignedAuthor,
      description: formData.description.trim() || 'No description provided.',
      telemetry: {
        stage: 'N/A',
        moisture: 'N/A',
        ph: 'N/A',
        temp: 'N/A'
      },
      comments: []
    };

    // Local UI update
    setLogs(prev => [savedLog, ...prev]);
    setIsDrawerOpen(false);

    // Sync to Supabase
    try {
      if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
        const { error } = await supabase
          .from('gallery_logs')
          .insert([{
            title: savedLog.title,
            crop: savedLog.crop,
            category: savedLog.category,
            img: savedLog.img,
            date: savedLog.date,
            author_name: savedLog.author.name,
            author_avatar: savedLog.author.avatar,
            description: savedLog.description,
            telemetry: savedLog.telemetry
          }]);

        if (error) {
          console.warn('Saved locally, but failed to sync to Supabase: ', error.message);
        } else {
          fetchLogs();
        }
      }
    } catch (err) {
      console.error('Error saving log to Supabase:', err);
    }
  };

  // Filtered logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || log.crop === selectedCrop;
    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    return matchesSearch && matchesCrop && matchesCategory;
  });

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Activity Gallery</h1>
        <p className="page-subtitle">View and update media logs of farm operations.</p>
      </div>

      {/* Photo Overview Ribbon */}
      <div className="products-summary-ribbon" style={{ marginBottom: '1.5rem' }}>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Media Logs</span>
            <span className="summary-card-value">{totalLogs} Photos</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(22, 58, 36, 0.05)', color: 'var(--color-forest)' }}>
            <ImageIcon size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Crops Tracked</span>
            <span className="summary-card-value">{cropCoverageCount} Crops</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(79, 138, 91, 0.08)', color: 'var(--color-success)' }}>
            <Sprout size={16} />
          </div>
        </div>
        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Contributors</span>
            <span className="summary-card-value">{totalContributorsCount} Staff</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#3b82f6' }}>
            <User size={16} />
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
              placeholder="Search logs by caption, author..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="filter-select"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="All">All Crops</option>
            {cropsList.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="products-actions-right">
          <button className="primary-btn" onClick={handleOpenAddDrawer}>
            <Plus size={16} />
            <span>Log Media</span>
          </button>
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="gallery-grid">
        {filteredLogs.map((log) => (
          <div key={log.id} className="gallery-card" onClick={() => setActiveLog(log)}>
            <div className="gallery-card-tags">
              <span className="gallery-tag category">{log.category}</span>
              {log.crop !== 'None' && <span className="gallery-tag crop">{log.crop}</span>}
            </div>

            <div className="gallery-card-img-wrapper">
              <img src={log.img} alt={log.title} className="gallery-card-img" />
            </div>

            <div className="gallery-card-overlay">
              <h3 className="gallery-card-title">{log.title}</h3>
              <div className="gallery-card-meta">
                <span>By {log.author.name}</span>
                <span>{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Quick delete floating button */}
            <button 
              className="remove-preview-btn" 
              style={{ top: '0.75rem', right: '0.75rem', zIndex: 10, position: 'absolute' }}
              onClick={(e) => handleDeleteLog(e, log.id, log.title)}
              title="Delete Log"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="dashboard-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No media logs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal (Glassmorphic) */}
      {activeLog && (
        <div className="lightbox-overlay" onClick={() => setActiveLog(null)}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Left Image Pane */}
            <div className="lightbox-image-pane">
              <img src={activeLog.img} alt={activeLog.title} className="lightbox-large-img" />
              <button 
                type="button" 
                className="remove-preview-btn"
                style={{ top: '1rem', left: '1rem', position: 'absolute', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setActiveLog(null)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Right Information Panel */}
            <div className="lightbox-info-pane">
              <div className="lightbox-header">
                <div className="lightbox-header-text">
                  <h2>{activeLog.title}</h2>
                  <p>Logged by {activeLog.author.name} on {new Date(activeLog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <button className="drawer-close-btn" onClick={() => setActiveLog(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="lightbox-body">
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="gallery-tag category" style={{ fontSize: '0.65rem' }}>{activeLog.category}</span>
                  {activeLog.crop !== 'None' && (
                    <span className="crop-tag-indicator">
                      <Sprout size={10} />
                      {activeLog.crop}
                    </span>
                  )}
                </div>

                <p className="lightbox-desc-text">{activeLog.description}</p>

                {/* Telemetry Stats Grid */}
                <div>
                  <h3 className="lightbox-comments-title" style={{ marginBottom: '0.5rem' }}>Soil & Telemetry Stats</h3>
                  <div className="lightbox-telemetry-grid">
                    <div className="telemetry-card">
                      <span className="telemetry-label">Crop Stage</span>
                      <span className="telemetry-value">{activeLog.telemetry.stage}</span>
                    </div>
                    <div className="telemetry-card">
                      <span className="telemetry-label">Soil Moisture</span>
                      <span className="telemetry-value">{activeLog.telemetry.moisture}</span>
                    </div>
                    <div className="telemetry-card">
                      <span className="telemetry-label">Soil pH</span>
                      <span className="telemetry-value">{activeLog.telemetry.ph}</span>
                    </div>
                    <div className="telemetry-card">
                      <span className="telemetry-label">Temperature</span>
                      <span className="telemetry-value">{activeLog.telemetry.temp}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Thread Section */}
              <div className="lightbox-comments-section">
                <h3 className="lightbox-comments-title">Team Comments ({activeLog.comments.length})</h3>
                
                <div className="comments-list">
                  {activeLog.comments.map((comm) => (
                    <div key={comm.id} className="comment-bubble">
                      <img src={comm.avatar} alt={comm.author} className="comment-avatar" />
                      <div className="comment-content">
                        <div className="comment-author-meta">
                          <span>{comm.author}</span>
                          <span className="comment-time">{comm.time}</span>
                        </div>
                        <span className="comment-text">{comm.text}</span>
                      </div>
                    </div>
                  ))}
                  {activeLog.comments.length === 0 && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 'auto', fontStyle: 'italic' }}>
                      No comments logged yet. Be the first!
                    </p>
                  )}
                </div>

                {/* Comment Submission Form */}
                <form className="comment-form" onSubmit={handleAddComment}>
                  <div className="comment-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Add team note or feedback..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="comment-submit-btn">
                    <Send size={14} />
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Slide-out Sidebar Drawer Form Markup */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={handleCloseDrawer}
      ></div>

      <div className={`product-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Log Farm Media</h2>
          <button className="drawer-close-btn" onClick={handleCloseDrawer}>
            <X size={18} />
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleSaveLog}>
          <div className="form-group">
            <label>Caption / Title</label>
            <input 
              type="text" 
              name="title" 
              placeholder="e.g. Tomato Flowering Row A"
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
                {categoriesList.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Associated Crop</label>
              <select 
                name="crop"
                value={formData.crop}
                onChange={handleInputChange}
              >
                {cropsList.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assigned Logger (Author)</label>
            <select 
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
            >
              {staffList.map((staff, idx) => (
                <option key={idx} value={staff.name}>{staff.name}</option>
              ))}
            </select>
          </div>

          {/* Custom Client-Side File Uploader */}
          <div className="form-group">
            <label>Photo Log Image</label>
            {formData.imgUrl ? (
              <div className="uploaded-preview-container">
                <img src={formData.imgUrl} alt="Preview" className="uploaded-preview-img" />
                <button 
                  type="button" 
                  className="remove-preview-btn"
                  onClick={() => setFormData(prev => ({ ...prev, imgUrl: '' }))}
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div 
                  className="image-upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? '2px dashed var(--color-success)' : '2px dashed var(--color-border)',
                    backgroundColor: isDragging ? 'rgba(79, 138, 91, 0.05)' : '#FBFBFA',
                    padding: '1.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div className="upload-icon-wrapper" style={{ color: 'var(--color-success)' }}>
                    <ImageIcon size={28} />
                  </div>
                  <span className="upload-text-main" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    Click or Drag Image Here
                  </span>
                  <span className="upload-text-sub" style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    Supports PNG, JPG, JPEG, GIF up to 5MB
                  </span>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>



          <div className="form-group">
            <label>Log Description</label>
            <textarea 
              name="description"
              placeholder="Write observations about soil conditions, growth characteristics, or maintenance needs..."
              value={formData.description}
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
              <span>Log Media</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
