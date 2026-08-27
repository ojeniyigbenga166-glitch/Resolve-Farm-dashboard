import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Plus, 
  X, 
  Eye, 
  Truck, 
  Check, 
  AlertCircle, 
  Trash2, 
  Printer, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Package, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  Clock,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';

// Crop image assets imports
import habaneroImg from '../assets/habanero_pepper.png';
import cornImg from '../assets/african_corn.png';
import tomatoesImg from '../assets/roma_tomatoes.png';
import pepperImg from '../assets/yellow_bell_pepper.png';
import cassavaImg from '../assets/cassava_tubers.png';
import potatoesImg from '../assets/sweet_potatoes.png';
import carrotsImg from '../assets/organic_carrots.png';
import beansImg from '../assets/green_beans.png';

// Mock catalog products for manually creating an order
const catalogProducts = [
  { id: 1, name: 'Habanero Pepper', price: 1800, unit: 'kg', img: habaneroImg, category: 'Peppers' },
  { id: 2, name: 'African Corn', price: 2200, unit: 'bag', img: cornImg, category: 'Corn' },
  { id: 3, name: 'Roma Tomatoes', price: 1500, unit: 'kg', img: tomatoesImg, category: 'Tomatoes' },
  { id: 4, name: 'Yellow Bell Pepper', price: 2000, unit: 'kg', img: pepperImg, category: 'Peppers' },
  { id: 5, name: 'Cassava Tubers', price: 900, unit: 'bag', img: cassavaImg, category: 'Tubers' },
  { id: 6, name: 'Sweet Potatoes', price: 1100, unit: 'kg', img: potatoesImg, category: 'Tubers' },
  { id: 7, name: 'Organic Carrots', price: 1200, unit: 'kg', img: carrotsImg, category: 'Vegetables' },
  { id: 8, name: 'Green Beans', price: 1600, unit: 'kg', img: beansImg, category: 'Vegetables' }
];

// Seeded Initial Mock Orders
const initialOrders = [
  { 
    id: 'RF-2024-0134', 
    customer: { 
      name: 'John Smith', 
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60', 
      phone: '+234 803 123 4567', 
      email: 'john.smith@gmail.com', 
      address: 'Plot 12, Phase II, Lekki, Lagos' 
    },
    date: '2024-05-30', 
    time: '10:24 AM', 
    status: 'pending', 
    items: [
      { id: 1, name: 'Habanero Pepper', qty: 5, price: 1800, unit: 'kg', img: habaneroImg },
      { id: 3, name: 'Roma Tomatoes', qty: 10, price: 1500, unit: 'kg', img: tomatoesImg }
    ],
    deliveryFee: 2500,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    notes: 'Please deliver in the morning.',
    timeline: [
      { status: 'Order Placed', time: 'May 30, 2024, 10:24 AM' }
    ]
  },
  { 
    id: 'RF-2024-0133', 
    customer: { 
      name: 'Mary Johnson', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60', 
      phone: '+234 812 345 6789', 
      email: 'mary.j@yahoo.com', 
      address: '45 Allen Avenue, Ikeja, Lagos' 
    },
    date: '2024-05-30', 
    time: '09:15 AM', 
    status: 'processing', 
    items: [
      { id: 2, name: 'African Corn', qty: 2, price: 2200, unit: 'bag', img: cornImg }
    ],
    deliveryFee: 3000,
    paymentMethod: 'Card Payment',
    paymentStatus: 'Paid',
    notes: 'Call before arriving.',
    timeline: [
      { status: 'Order Placed', time: 'May 30, 2024, 09:15 AM' },
      { status: 'Processing Started', time: 'May 30, 2024, 11:00 AM' }
    ]
  },
  { 
    id: 'RF-2024-0132', 
    customer: { 
      name: 'David Brown', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60', 
      phone: '+234 705 987 6543', 
      email: 'dbrown@outlook.com', 
      address: 'Block C4, Ikoyi Gardens, Ikoyi, Lagos' 
    },
    date: '2024-05-29', 
    time: '04:30 PM', 
    status: 'delivered', 
    items: [
      { id: 3, name: 'Roma Tomatoes', qty: 15, price: 1500, unit: 'kg', img: tomatoesImg },
      { id: 5, name: 'Cassava Tubers', qty: 5, price: 900, unit: 'bag', img: cassavaImg }
    ],
    deliveryFee: 4000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    notes: 'Gate code is #1982',
    timeline: [
      { status: 'Order Placed', time: 'May 29, 2024, 04:30 PM' },
      { status: 'Processing Started', time: 'May 30, 2024, 08:30 AM' },
      { status: 'Delivered', time: 'May 30, 2024, 02:45 PM' }
    ]
  },
  { 
    id: 'RF-2024-0131', 
    customer: { 
      name: 'Sarah Williams', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60', 
      phone: '+234 909 555 4433', 
      email: 'sarah.w@gmail.com', 
      address: '12 Amodu Ojikutu Street, VI, Lagos' 
    },
    date: '2024-05-29', 
    time: '01:10 PM', 
    status: 'delivered', 
    items: [
      { id: 4, name: 'Yellow Bell Pepper', qty: 10, price: 2000, unit: 'kg', img: pepperImg }
    ],
    deliveryFee: 1500,
    paymentMethod: 'Card Payment',
    paymentStatus: 'Paid',
    notes: '',
    timeline: [
      { status: 'Order Placed', time: 'May 29, 2024, 01:10 PM' },
      { status: 'Processing Started', time: 'May 29, 2024, 03:00 PM' },
      { status: 'Delivered', time: 'May 30, 2024, 11:30 AM' }
    ]
  },
  { 
    id: 'RF-2024-0130', 
    customer: { 
      name: 'Michael Davis', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60', 
      phone: '+234 802 888 9900', 
      email: 'mdavis@gmail.com', 
      address: '77 Adeniran Ogunsanya, Surulere, Lagos' 
    },
    date: '2024-05-28', 
    time: '11:45 AM', 
    status: 'cancelled', 
    items: [
      { id: 1, name: 'Habanero Pepper', qty: 5, price: 1800, unit: 'kg', img: habaneroImg },
      { id: 6, name: 'Sweet Potatoes', qty: 10, price: 1100, unit: 'kg', img: potatoesImg }
    ],
    deliveryFee: 2000,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    notes: 'Cancelled before shipping.',
    timeline: [
      { status: 'Order Placed', time: 'May 28, 2024, 11:45 AM' },
      { status: 'Cancelled', time: 'May 28, 2024, 02:15 PM' }
    ]
  },
  { 
    id: 'RF-2024-0129', 
    customer: { 
      name: 'Elizabeth Okon', 
      avatar: '', 
      phone: '+234 818 111 2222', 
      email: 'e.okon@gmail.com', 
      address: '18 Gbagada Expressway, Gbagada, Lagos' 
    },
    date: '2024-05-27', 
    time: '03:20 PM', 
    status: 'pending', 
    items: [
      { id: 2, name: 'African Corn', qty: 5, price: 2200, unit: 'bag', img: cornImg },
      { id: 4, name: 'Yellow Bell Pepper', qty: 8, price: 2000, unit: 'kg', img: pepperImg }
    ],
    deliveryFee: 3500,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    notes: 'Checking payment receipt verification.',
    timeline: [
      { status: 'Order Placed', time: 'May 27, 2024, 03:20 PM' }
    ]
  }
];

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time'); // 'All Time', 'Today', 'This Week', 'This Month'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'amount-desc', 'amount-asc'

  // Drawer states
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Manual Order Creation State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('Bank Transfer');
  const [newPaymentStatus, setNewPaymentStatus] = useState('Paid');
  const [newOrderItems, setNewOrderItems] = useState([]);
  const [newDeliveryFee, setNewDeliveryFee] = useState(2000);
  const [newNotes, setNewNotes] = useState('');
  
  // Dynamic manual item selection fields
  const [selectedProductToAdd, setSelectedProductToAdd] = useState(1);
  const [productQuantityToAdd, setProductQuantityToAdd] = useState(1);

  // Calculate order items totals
  const getOrderTotal = (order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return itemsTotal + order.deliveryFee;
  };

  // KPI Calculations
  const stats = useMemo(() => {
    let revenue = 0;
    let pendingCount = 0;
    let deliveredCount = 0;
    let totalCount = orders.length;

    orders.forEach(order => {
      const orderTotal = getOrderTotal(order);
      if (order.status !== 'cancelled') {
        revenue += orderTotal;
      }
      if (order.status === 'pending' || order.status === 'processing') {
        pendingCount++;
      }
      if (order.status === 'delivered') {
        deliveredCount++;
      }
    });

    return { revenue, pendingCount, deliveredCount, totalCount };
  }, [orders]);

  // Date range filter helper
  const isInDateRange = (orderDateStr) => {
    if (selectedDateRange === 'All Time') return true;
    
    // We assume current relative date in our system is May 30, 2024 to align with seed data.
    const orderDate = new Date(orderDateStr);
    const currentDate = new Date('2024-05-30'); // System base date

    if (selectedDateRange === 'Today') {
      return orderDateStr === '2024-05-30';
    } else if (selectedDateRange === 'This Week') {
      const diffTime = Math.abs(currentDate - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    } else if (selectedDateRange === 'This Month') {
      return orderDate.getMonth() === currentDate.getMonth() && 
             orderDate.getFullYear() === currentDate.getFullYear();
    }
    return true;
  };

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesSearch = 
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.phone.includes(searchQuery) ||
          order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
        const matchesDate = isInDateRange(order.date);

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        const amountA = getOrderTotal(a);
        const amountB = getOrderTotal(b);

        if (sortBy === 'newest') return dateB - dateA;
        if (sortBy === 'oldest') return dateA - dateB;
        if (sortBy === 'amount-desc') return amountB - amountA;
        if (sortBy === 'amount-asc') return amountA - amountB;
        return 0;
      });
  }, [orders, searchQuery, selectedStatus, selectedDateRange, sortBy]);

  // Handle opening of details drawer
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailDrawerOpen(true);
  };

  // Handle status updates inside details drawer
  const handleUpdateOrderStatus = (orderId, nextStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        
        let timelineText = '';
        if (nextStatus === 'processing') timelineText = 'Processing Started';
        else if (nextStatus === 'delivered') timelineText = 'Delivered';
        else if (nextStatus === 'cancelled') timelineText = 'Cancelled';
        else timelineText = 'Order Re-opened';

        const updatedTimeline = [
          ...order.timeline,
          { status: timelineText, time: `${dateStr}, ${timestamp}` }
        ];

        const updatedOrder = { 
          ...order, 
          status: nextStatus,
          timeline: updatedTimeline,
          paymentStatus: nextStatus === 'delivered' ? 'Paid' : order.paymentStatus
        };

        // Sync visual detailed drawer too
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }

        return updatedOrder;
      }
      return order;
    }));
  };

  // Quick Action to delete/cancel order
  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId} permanently?`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setIsDetailDrawerOpen(false);
      setSelectedOrder(null);
    }
  };

  // Add Item to manual order constructor
  const handleAddManualItem = () => {
    const product = catalogProducts.find(p => p.id === Number(selectedProductToAdd));
    if (!product) return;

    // Check if product already added
    const existing = newOrderItems.find(item => item.id === product.id);
    if (existing) {
      setNewOrderItems(prev => prev.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + Number(productQuantityToAdd) } : item
      ));
    } else {
      setNewOrderItems(prev => [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        img: product.img,
        qty: Number(productQuantityToAdd)
      }]);
    }
    // Reset inputs
    setProductQuantityToAdd(1);
  };

  // Remove Item from manual order constructor
  const handleRemoveManualItem = (productId) => {
    setNewOrderItems(prev => prev.filter(item => item.id !== productId));
  };

  // Create manual order submit handler
  const handleCreateOrderSubmit = (e) => {
    e.preventDefault();

    if (!newCustomerName.trim()) {
      alert('Please fill in the customer name.');
      return;
    }
    if (newOrderItems.length === 0) {
      alert('Please add at least one crop item to the order.');
      return;
    }

    const orderId = `RF-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timelineTimeStr = now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + `, ${timeStr}`;

    const newOrder = {
      id: orderId,
      customer: {
        name: newCustomerName.trim(),
        avatar: '', // Custom letter initials fallback in UI
        phone: newCustomerPhone.trim() || 'N/A',
        email: newCustomerEmail.trim() || 'N/A',
        address: newCustomerAddress.trim() || 'Digital Delivery'
      },
      date: dateStr,
      time: timeStr,
      status: 'pending',
      items: newOrderItems,
      deliveryFee: Number(newDeliveryFee),
      paymentMethod: newPaymentMethod,
      paymentStatus: newPaymentStatus,
      notes: newNotes,
      timeline: [
        { status: 'Order Placed', time: timelineTimeStr }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Reset drawer state
    setNewCustomerName('');
    setNewCustomerEmail('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
    setNewPaymentMethod('Bank Transfer');
    setNewPaymentStatus('Paid');
    setNewOrderItems([]);
    setNewDeliveryFee(2000);
    setNewNotes('');
    setIsCreateDrawerOpen(false);

    alert(`Order ${orderId} successfully created!`);
  };

  // Print simulation trigger
  const handlePrint = (orderId) => {
    alert(`Generating invoice sheet for Order #${orderId}... Loading layout window.\n(Print layout style configured via @media print)`);
    window.print();
  };

  return (
    <div>
      {/* Self-contained Custom Component Styles */}
      <style>{`
        /* Stepper progress indicator timeline */
        .timeline-stepper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 1.25rem 0;
          position: relative;
          padding-left: 1.25rem;
        }
        .timeline-stepper::before {
          content: '';
          position: absolute;
          left: 5px;
          top: 5px;
          bottom: 5px;
          width: 2px;
          background-color: #E2E8F0;
          z-index: 1;
        }
        .timeline-step {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          z-index: 2;
        }
        .timeline-step-icon {
          position: absolute;
          left: -20px;
          top: 3px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #CBD5E1;
          border: 2px solid #FFF;
          transition: all 0.2s ease;
        }
        .timeline-step.completed .timeline-step-icon {
          background-color: var(--color-forest);
          box-shadow: 0 0 0 3px rgba(22, 58, 36, 0.12);
        }
        .timeline-step.cancelled .timeline-step-icon {
          background-color: var(--color-tomato);
          box-shadow: 0 0 0 3px rgba(217, 74, 56, 0.12);
        }
        .timeline-step-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .timeline-step-time {
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }

        /* Order detail table styling */
        .detail-items-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .detail-items-table th {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--color-text-muted);
          text-transform: uppercase;
          border-bottom: 1px solid #E2E8F0;
          padding: 0.5rem 0.25rem;
          text-align: left;
        }
        .detail-items-table td {
          font-size: 0.8rem;
          padding: 0.65rem 0.25rem;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }
        .detail-item-img {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          object-fit: cover;
          border: 1px solid #E2E8F0;
        }
        .detail-totals {
          background-color: #F8FAFC;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          border: 1px solid #E2E8F0;
        }
        .detail-totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--color-text);
        }
        .detail-totals-row.grand {
          font-weight: 700;
          font-size: 0.95rem;
          border-top: 1px solid #E2E8F0;
          padding-top: 0.5rem;
          color: var(--color-forest);
        }

        /* Custom initial icon style */
        .avatar-initial {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--color-forest);
          color: var(--color-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .avatar-initial-large {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background-color: var(--color-forest);
          color: var(--color-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          margin-right: 0.75rem;
        }

        /* Create manual order styling items selector */
        .manual-item-selector {
          background-color: #F8FAFC;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
          margin-bottom: 1rem;
        }
        .added-items-container {
          border: 1px solid var(--color-border);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        .added-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid #F1F5F9;
          font-size: 0.8rem;
        }
        .added-item-row:last-child {
          border-bottom: none;
        }
        .added-item-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .added-item-img {
          width: 24px;
          height: 24px;
          border-radius: 3px;
          object-fit: cover;
        }

        /* Print styles container */
        @media print {
          body * {
            visibility: hidden;
          }
          .product-drawer.open, .product-drawer.open * {
            visibility: visible;
          }
          .product-drawer.open {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            box-shadow: none;
            transform: none;
          }
          .drawer-header .drawer-close-btn,
          .drawer-form select,
          .drawer-form button,
          .drawer-footer {
            display: none !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Order Processing</h1>
        <p className="page-subtitle">Track, filter, verify payments, and fulfill customer fresh crop orders.</p>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="products-summary-ribbon">
        <div 
          className="summary-ribbon-card" 
          onClick={() => setSelectedStatus('All')} 
          style={{ cursor: 'pointer', border: selectedStatus === 'All' ? '1.5px solid var(--color-forest)' : '1px solid var(--color-border)' }}
        >
          <div className="summary-card-info">
            <span className="summary-card-label">Total Orders</span>
            <span className="summary-card-value">{stats.totalCount}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(22, 58, 36, 0.05)', color: 'var(--color-forest)' }}>
            <ShoppingBag size={16} />
          </div>
        </div>
        
        <div 
          className="summary-ribbon-card"
          onClick={() => setSelectedStatus('pending')}
          style={{ cursor: 'pointer', border: selectedStatus === 'pending' ? '1.5px solid #FBC02D' : '1px solid var(--color-border)' }}
        >
          <div className="summary-card-info">
            <span className="summary-card-label">Pending / Processing</span>
            <span className="summary-card-value" style={{ color: '#FBC02D' }}>{stats.pendingCount}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(251, 192, 45, 0.08)', color: '#FBC02D' }}>
            <Clock size={16} />
          </div>
        </div>

        <div 
          className="summary-ribbon-card"
          onClick={() => setSelectedStatus('delivered')}
          style={{ cursor: 'pointer', border: selectedStatus === 'delivered' ? '1.5px solid var(--color-success)' : '1px solid var(--color-border)' }}
        >
          <div className="summary-card-info">
            <span className="summary-card-label">Delivered Orders</span>
            <span className="summary-card-value" style={{ color: 'var(--color-success)' }}>{stats.deliveredCount}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(79, 138, 91, 0.08)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={16} />
          </div>
        </div>

        <div className="summary-ribbon-card">
          <div className="summary-card-info">
            <span className="summary-card-label">Net Sales (Excl. Cancelled)</span>
            <span className="summary-card-value">₦{stats.revenue.toLocaleString()}</span>
          </div>
          <div className="summary-card-icon" style={{ backgroundColor: 'rgba(22, 58, 36, 0.05)', color: 'var(--color-forest)' }}>
            <DollarSign size={16} />
          </div>
        </div>
      </div>

      {/* Toolbar Search & Filters */}
      <div className="products-top-bar">
        <div className="products-filters-left">
          <div className="search-input-wrapper">
            <Search size={16} className="search-input-icon" />
            <input 
              type="text" 
              placeholder="Search by ID, Customer Name, or Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            className="filter-select"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            <option value="All Time">All Time</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week (Last 7 days)</option>
            <option value="This Month">This Month</option>
          </select>

          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>

          {(searchQuery || selectedStatus !== 'All' || selectedDateRange !== 'All Time') && (
            <button 
              className="secondary-btn" 
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('All');
                setSelectedDateRange('All Time');
              }}
              style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="products-actions-right">
          <button className="primary-btn" onClick={() => setIsCreateDrawerOpen(true)}>
            <Plus size={16} />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Orders Table Display */}
      <div className="products-table-card">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date / Time</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const totalAmount = getOrderTotal(order);
                const firstLetter = order.customer.name.charAt(0);
                
                return (
                  <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => handleOpenDetail(order)}>
                    <td style={{ fontWeight: 600, color: 'var(--color-forest)' }}>{order.id}</td>
                    <td>
                      <div className="customer-cell">
                        {order.customer.avatar ? (
                          <img src={order.customer.avatar} alt={order.customer.name} className="customer-avatar" />
                        ) : (
                          <div className="avatar-initial">{firstLetter}</div>
                        )}
                        <div>
                          <span style={{ fontWeight: 600, display: 'block' }}>{order.customer.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{order.customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{order.time}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        {order.items.map(item => `${item.name} (${item.qty}${item.unit})`).join(', ')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>₦{totalAmount.toLocaleString()}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="product-card-actions" style={{ justifyContent: 'flex-end', gap: '0.35rem' }}>
                        <button 
                          className="icon-action-btn"
                          onClick={() => handleOpenDetail(order)}
                          title="View Order Details"
                        >
                          <Eye size={14} />
                        </button>
                        
                        {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                          <select 
                            className="card-select-dropdown" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: '28px' }}
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        ) : (
                          <button 
                            className="icon-action-btn delete"
                            onClick={() => handleDeleteOrder(order.id)}
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-muted)' }}>
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Sidebar Drawer Overlay */}
      <div 
        className={`drawer-overlay ${(isDetailDrawerOpen || isCreateDrawerOpen) ? 'open' : ''}`}
        onClick={() => {
          setIsDetailDrawerOpen(false);
          setIsCreateDrawerOpen(false);
        }}
      ></div>

      {/* 1. ORDER DETAILS DRAWER */}
      <div className={`product-drawer ${isDetailDrawerOpen ? 'open' : ''}`} style={{ width: '460px' }}>
        {selectedOrder && (
          <>
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Order Details
                </h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{selectedOrder.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`status-badge ${selectedOrder.status}`} style={{ display: 'inline-block' }}>
                  {selectedOrder.status.toUpperCase()}
                </span>
                <button className="drawer-close-btn" onClick={() => setIsDetailDrawerOpen(false)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="drawer-form" style={{ paddingBottom: '2rem' }}>
              
              {/* Timeline Progress */}
              <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                <label style={{ fontWeight: 700 }}>Order Progress Tracker</label>
                <div className="timeline-stepper">
                  <div className={`timeline-step completed`}>
                    <div className="timeline-step-icon"></div>
                    <span className="timeline-step-title">Order Placed</span>
                    <span className="timeline-step-time">{selectedOrder.timeline[0]?.time || `${selectedOrder.date}, ${selectedOrder.time}`}</span>
                  </div>

                  {selectedOrder.status !== 'cancelled' ? (
                    <>
                      <div className={`timeline-step ${['processing', 'delivered'].includes(selectedOrder.status) ? 'completed' : ''}`}>
                        <div className="timeline-step-icon"></div>
                        <span className="timeline-step-title">Processing & Packaging</span>
                        {['processing', 'delivered'].includes(selectedOrder.status) ? (
                          <span className="timeline-step-time">
                            {selectedOrder.timeline.find(t => t.status.includes('Processing'))?.time || 'In progress'}
                          </span>
                        ) : (
                          <span className="timeline-step-time">Awaiting confirmation</span>
                        )}
                      </div>

                      <div className={`timeline-step ${selectedOrder.status === 'delivered' ? 'completed' : ''}`}>
                        <div className="timeline-step-icon"></div>
                        <span className="timeline-step-title">Out for Delivery</span>
                        {selectedOrder.status === 'delivered' ? (
                          <span className="timeline-step-time">Shipped via Logistics Partner</span>
                        ) : (
                          <span className="timeline-step-time">Pending Packaging</span>
                        )}
                      </div>

                      <div className={`timeline-step ${selectedOrder.status === 'delivered' ? 'completed' : ''}`}>
                        <div className="timeline-step-icon"></div>
                        <span className="timeline-step-title">Delivered & Closed</span>
                        {selectedOrder.status === 'delivered' ? (
                          <span className="timeline-step-time">
                            {selectedOrder.timeline.find(t => t.status.includes('Delivered'))?.time || 'Fulfillment closed'}
                          </span>
                        ) : (
                          <span className="timeline-step-time">Awaiting dispatch</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="timeline-step cancelled">
                      <div className="timeline-step-icon"></div>
                      <span className="timeline-step-title" style={{ color: 'var(--color-tomato)' }}>Order Cancelled</span>
                      <span className="timeline-step-time">
                        {selectedOrder.timeline.find(t => t.status.includes('Cancelled'))?.time || 'Fulfillment closed'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                <label style={{ fontWeight: 700 }}>Customer Profile</label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                  {selectedOrder.customer.avatar ? (
                    <img src={selectedOrder.customer.avatar} alt="Profile" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', marginRight: '0.75rem' }} />
                  ) : (
                    <div className="avatar-initial-large">{selectedOrder.customer.name.charAt(0)}</div>
                  )}
                  <div>
                    <h4 style={{ fontWeight: 700, margin: 0 }}>{selectedOrder.customer.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Registered Client</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <a href={`tel:${selectedOrder.customer.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{selectedOrder.customer.phone}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <a href={`mailto:${selectedOrder.customer.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{selectedOrder.customer.email}</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: 'var(--color-text-muted)', marginTop: '0.15rem' }} />
                    <span>{selectedOrder.customer.address}</span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                <label style={{ fontWeight: 700 }}>Crop Items Invoice</label>
                <table className="detail-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>Img</th>
                      <th>Product</th>
                      <th>Qty</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <img src={item.img} alt={item.name} className="detail-item-img" />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>per {item.unit}</div>
                        </td>
                        <td>{item.qty} {item.unit}</td>
                        <td style={{ textAlign: 'right' }}>₦{item.price.toLocaleString()}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>₦{(item.price * item.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Summary */}
                <div className="detail-totals">
                  <div className="detail-totals-row">
                    <span>Items Subtotal</span>
                    <span>₦{selectedOrder.items.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}</span>
                  </div>
                  <div className="detail-totals-row">
                    <span>Logistic Delivery Fee</span>
                    <span>₦{selectedOrder.deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="detail-totals-row grand">
                    <span>Total Amount (Inc. tax)</span>
                    <span>₦{getOrderTotal(selectedOrder).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                <label style={{ fontWeight: 700 }}>Payment & Transaction</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>METHOD</span>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CreditCard size={14} /> {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>PAYMENT STATUS</span>
                    <span style={{ fontWeight: 600, color: selectedOrder.paymentStatus === 'Paid' ? 'var(--color-success)' : selectedOrder.paymentStatus === 'Pending' ? '#FBC02D' : 'var(--color-tomato)' }}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div style={{ backgroundColor: '#FFFDF5', borderLeft: '3px solid #FBC02D', padding: '0.5rem 0.75rem', borderRadius: '4px', marginTop: '1rem', fontSize: '0.8rem' }}>
                    <span style={{ fontWeight: 600, display: 'block', fontSize: '0.7rem', color: '#B78103', marginBottom: '0.15rem' }}>CUSTOMER NOTE:</span>
                    {selectedOrder.notes}
                  </div>
                )}
              </div>

              {/* Processing Controls Panel */}
              <div className="form-group">
                <label style={{ fontWeight: 700 }}>Order Processing Actions</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ flexGrow: 1 }}>
                    <select 
                      className="filter-select"
                      style={{ width: '100%', height: '38px', fontSize: '0.8rem' }}
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                    >
                      <option value="pending">Pending Confirmation</option>
                      <option value="processing">Processing & Packaged</option>
                      <option value="delivered">Delivered (Verify Delivery)</option>
                      <option value="cancelled">Cancel Order</option>
                    </select>
                  </div>
                  
                  <button 
                    type="button" 
                    className="secondary-btn" 
                    onClick={() => handlePrint(selectedOrder.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', height: '38px' }}
                    title="Print Invoice Document"
                  >
                    <Printer size={16} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

            </div>

            <div className="drawer-footer">
              <button 
                type="button" 
                className="secondary-btn" 
                onClick={() => setIsDetailDrawerOpen(false)}
                style={{ flex: 1 }}
              >
                Close Drawer
              </button>
              
              <button 
                type="button" 
                className="secondary-btn delete"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                style={{ color: 'var(--color-tomato)', borderColor: 'rgba(217, 74, 56, 0.2)' }}
              >
                <Trash2 size={16} />
                <span>Delete Order</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 2. CREATE MANUAL ORDER DRAWER */}
      <div className={`product-drawer ${isCreateDrawerOpen ? 'open' : ''}`} style={{ width: '460px' }}>
        <div className="drawer-header">
          <h2 className="drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Create Manual Order
          </h2>
          <button className="drawer-close-btn" onClick={() => setIsCreateDrawerOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleCreateOrderSubmit}>
          
          {/* Customer Information */}
          <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
            <label style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Customer Profile Details</label>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Customer Full Name *</span>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email Address</span>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Phone Number *</span>
                  <input 
                    type="text" 
                    placeholder="+234..."
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Delivery Address</span>
                <textarea 
                  rows="2"
                  placeholder="Street details, Estate/City, State"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Add Crop Items Section */}
          <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
            <label style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Crops Itemized Selector</label>
            
            {/* Added crops list preview */}
            {newOrderItems.length > 0 ? (
              <div className="added-items-container">
                {newOrderItems.map((item) => (
                  <div key={item.id} className="added-item-row">
                    <div className="added-item-info">
                      <img src={item.img} alt="" className="added-item-img" />
                      <div>
                        <strong>{item.name}</strong>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginLeft: '0.5rem' }}>
                          ₦{item.price.toLocaleString()}/{item.unit}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>{item.qty} {item.unit}</span>
                      <strong style={{ minWidth: '70px', textAlign: 'right' }}>₦{(item.price * item.qty).toLocaleString()}</strong>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveManualItem(item.id)}
                        style={{ color: 'var(--color-tomato)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Remove crop"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', border: '1px dashed #CBD5E1', borderRadius: '6px', textAlign: 'center', marginBottom: '1rem' }}>
                <AlertTriangle size={18} style={{ color: '#FBC02D', marginBottom: '0.25rem' }} />
                <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--color-text-muted)' }}>No crop items added to this invoice yet.</span>
              </div>
            )}

            {/* Interactive Add Item Controls */}
            <div className="manual-item-selector">
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ flexGrow: 1 }}>
                  <span style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.15rem' }}>Choose Crop</span>
                  <select 
                    className="filter-select"
                    style={{ width: '100%', height: '34px', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    value={selectedProductToAdd}
                    onChange={(e) => setSelectedProductToAdd(e.target.value)}
                  >
                    {catalogProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₦{p.price}/{p.unit})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div style={{ width: '80px' }}>
                  <span style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.15rem' }}>Quantity</span>
                  <input 
                    type="number"
                    min="1"
                    value={productQuantityToAdd}
                    onChange={(e) => setProductQuantityToAdd(e.target.value)}
                    style={{ width: '100%', height: '34px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.75rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button 
                type="button" 
                className="secondary-btn" 
                onClick={handleAddManualItem}
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.25rem', height: '32px', fontSize: '0.75rem' }}
              >
                <Plus size={12} /> Add Crop to Order
              </button>
            </div>
          </div>

          {/* Pricing & Fees */}
          <div className="form-group" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
            <label style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Financial Parameters</label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Delivery Charge (₦)</span>
                <input 
                  type="number" 
                  value={newDeliveryFee}
                  onChange={(e) => setNewDeliveryFee(e.target.value)}
                  min="0"
                  required
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Payment Method</span>
                <select 
                  className="filter-select"
                  style={{ width: '100%', height: '38px', fontSize: '0.8rem' }}
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card Payment">Card Payment</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Payment Status</span>
                <select 
                  className="filter-select"
                  style={{ width: '100%', height: '38px', fontSize: '0.8rem' }}
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending Verification</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.25rem' }}>Live Grand Total:</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-forest)', display: 'block', marginTop: '0.25rem' }}>
                  ₦{(newOrderItems.reduce((sum, item) => sum + (item.price * item.qty), 0) + Number(newDeliveryFee)).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="form-group">
            <label style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Internal Processing Note</label>
            <textarea 
              rows="2"
              placeholder="e.g., Verify payment receipt before shipping."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="drawer-footer">
            <button 
              type="button" 
              className="secondary-btn" 
              onClick={() => setIsCreateDrawerOpen(false)}
            >
              Cancel
            </button>
            
            <button 
              type="submit" 
              className="primary-btn"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Check size={16} />
              <span>Create Order Invoice</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
