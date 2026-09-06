/* ============================================
   RENTIVO — Main JavaScript
   Shared site interactions
   ============================================ */

'use strict';

// ── Global State ──
const RentivoApp = {
  rentalBag: JSON.parse(localStorage.getItem('rentivo_bag') || '[]'),
  favorites: JSON.parse(localStorage.getItem('rentivo_favorites') || '[]'),
  darkMode: localStorage.getItem('rentivo_dark_mode') === 'true',
  rtl: localStorage.getItem('rentivo_rtl') === 'true',
  isLoggedIn: localStorage.getItem('rentivo_logged_in') !== 'false', // Default true for demo
  user: JSON.parse(localStorage.getItem('rentivo_user') || '{"name":"Alex Morgan","email":"alex.m@example.com"}'),
  searchOpen: false,
  mobileMenuOpen: false,

  // Auth Methods
  login: function(email, password, name = '') {
    const userName = name || email.split('@')[0];
    const user = { name: userName.charAt(0).toUpperCase() + userName.slice(1), email: email };
    this.user = user;
    this.isLoggedIn = true;
    localStorage.setItem('rentivo_logged_in', 'true');
    localStorage.setItem('rentivo_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}!`, 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  },

  signup: function(name, email, password) {
    const user = { name: name, email: email };
    this.user = user;
    this.isLoggedIn = true;
    localStorage.setItem('rentivo_logged_in', 'true');
    localStorage.setItem('rentivo_user', JSON.stringify(user));
    showToast(`Account created! Welcome to Rentivo, ${name}.`, 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 400);
  },

  logout: function() {
    this.isLoggedIn = false;
    this.user = null;
    localStorage.setItem('rentivo_logged_in', 'false');
    localStorage.removeItem('rentivo_user');
    showToast('Logged out successfully', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  }
};

// ── Products Database ──
const PRODUCTS = [
  { id: 1, name: 'Sony Alpha Camera Kit', category: 'Cameras', desc: 'Professional mirrorless camera with 24-70mm lens kit. Perfect for events, travel, and content creation.', dailyPrice: 35, weeklyPrice: 180, deposit: 250, rating: 4.8, reviews: 124, available: true, image: 'camera' },
  { id: 2, name: 'Projector Pro 4K', category: 'Electronics', desc: 'Ultra-bright 4K HDR projector with 3000 lumens. Ideal for presentations, movie nights, and events.', dailyPrice: 28, weeklyPrice: 150, deposit: 200, rating: 4.6, reviews: 89, available: true, image: 'projector' },
  { id: 3, name: 'Designer Lounge Chair', category: 'Furniture', desc: 'Mid-century modern lounge chair in premium walnut and leather. Statement piece for any space.', dailyPrice: 18, weeklyPrice: 95, deposit: 150, rating: 4.9, reviews: 67, available: true, image: 'chair' },
  { id: 4, name: 'Camping Tent 4-Person', category: 'Outdoor', desc: 'All-weather 4-person tent with waterproof fly. Quick setup and spacious interior.', dailyPrice: 22, weeklyPrice: 120, deposit: 100, rating: 4.7, reviews: 156, available: true, image: 'tent' },
  { id: 5, name: 'Canon Mirrorless R6', category: 'Cameras', desc: 'Full-frame mirrorless with 4K60p video. Dual card slots and in-body stabilization.', dailyPrice: 40, weeklyPrice: 210, deposit: 300, rating: 4.9, reviews: 203, available: false, image: 'mirrorless' },
  { id: 6, name: 'Party Speaker System', category: 'Electronics', desc: 'Powerful 500W Bluetooth speaker system with LED lights. Built-in mixer and wireless mic included.', dailyPrice: 30, weeklyPrice: 160, deposit: 175, rating: 4.5, reviews: 94, available: true, image: 'speaker' },
  { id: 7, name: 'Power Drill Set', category: 'Tools', desc: 'Professional 20V cordless drill with 100-piece accessory kit. Two batteries and fast charger included.', dailyPrice: 15, weeklyPrice: 80, deposit: 120, rating: 4.7, reviews: 211, available: true, image: 'drill' },
  { id: 8, name: 'Designer Evening Dress', category: 'Fashion', desc: 'Elegant floor-length evening gown in midnight blue. Dry-cleaned and pressed before every rental.', dailyPrice: 45, weeklyPrice: 240, deposit: 200, rating: 4.8, reviews: 78, available: true, image: 'dress' },
  { id: 9, name: 'DJI Drone Mavic Pro', category: 'Electronics', desc: 'Foldable 4K drone with 30-minute flight time. Obstacle avoidance and GPS return-to-home.', dailyPrice: 50, weeklyPrice: 280, deposit: 350, rating: 4.9, reviews: 167, available: true, image: 'drone' },
  { id: 10, name: 'Stand Mixer Professional', category: 'Appliances', desc: '7-quart professional stand mixer with 10 speed settings. Includes dough hook, whisk, and paddle.', dailyPrice: 12, weeklyPrice: 65, deposit: 80, rating: 4.6, reviews: 134, available: true, image: 'mixer' },
  { id: 11, name: 'Portable PA System', category: 'Events', desc: 'Battery-powered PA with two wireless mics. Up to 8 hours of runtime. Perfect for outdoor events.', dailyPrice: 35, weeklyPrice: 185, deposit: 200, rating: 4.7, reviews: 91, available: true, image: 'pa' },
  { id: 12, name: 'Outdoor Furniture Set', category: 'Furniture', desc: '5-piece patio conversation set with cushions. Weather-resistant wicker and aluminum frame.', dailyPrice: 25, weeklyPrice: 130, deposit: 175, rating: 4.5, reviews: 56, available: true, image: 'patio' },
];

const CATEGORIES = [
  { name: 'Electronics', count: 48, icon: 'electronics', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80' },
  { name: 'Furniture', count: 35, icon: 'furniture', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80' },
  { name: 'Cameras', count: 29, icon: 'cameras', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80' },
  { name: 'Fashion', count: 42, icon: 'fashion', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80' },
  { name: 'Events', count: 31, icon: 'events', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80' },
  { name: 'Tools', count: 26, icon: 'tools', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80' },
  { name: 'Outdoor', count: 38, icon: 'outdoor', img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80' },
  { name: 'Appliances', count: 22, icon: 'appliances', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80' },
];

// ── SVG Icons ──
const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  mapPin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  helpCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logOut: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  creditCard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
  google: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-1 .04-2.18.67-2.88 1.49-.6.7-1.14 1.84-.99 2.96 1.12.09 2.22-.51 2.88-1.33z"/></svg>',
};

// Category icon SVGs
const CATEGORY_ICONS = {
  electronics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  furniture: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6"/><path d="M3 12h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z"/><line x1="5" y1="18" x2="5" y2="21"/><line x1="19" y1="18" x2="19" y2="21"/></svg>',
  cameras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  fashion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2l-4 6h6l-2 14h12l-2-14h6l-4-6"/></svg>',
  events: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  outdoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21H7l-4-8 9-13 9 13-4 8z"/><line x1="12" y1="0" x2="12" y2="21"/></svg>',
  appliances: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><circle cx="12" cy="15" r="2"/><line x1="12" y1="6" x2="12" y2="6.01"/></svg>',
};

// ── Product Image Helper ──
function getProductSVG(type, size = 400) {
  const images = {
    camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    projector: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80',
    chair: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=80',
    tent: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80',
    mirrorless: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    drill: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    dress: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    drone: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&auto=format&fit=crop&q=80',
    mixer: 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=800&auto=format&fit=crop&q=80',
    pa: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    patio: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    placeholder: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=80'
  };

  const src = (type && type.startsWith('http')) ? type : (images[type] || images.placeholder);
  return `<img src="${src}" alt="${type || 'product'}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">`;
}

// ── Rentivo Logo SVG ──
function getRentivoLogo(light = false) {
  const textColor = light ? '#f5efe6' : '#0f0f12';
  const gradId = light ? 'logoGradLight' : 'logoGradDark';
  return `<svg viewBox="0 0 150 36" width="150" height="36" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle;">
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ff5722"/>
        <stop offset="100%" stop-color="#d4af37"/>
      </linearGradient>
    </defs>
    <rect x="0" y="2" width="32" height="32" rx="9" fill="url(#${gradId})"/>
    <text x="16" y="24" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="22" font-weight="bold" fill="#ffffff">R</text>
    <text x="42" y="25" font-family="'DM Serif Display', Georgia, serif" font-size="22" font-weight="700" fill="${textColor}">Rentivo</text>
    <circle cx="138" cy="12" r="3" fill="#ff5722"/>
  </svg>`;
}

// ── Initialization ──
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  initRTL();
  initHeader();
  initMobileMenu();
  initSearchOverlay();
  updateBagCount();
  updateFavCount();
  initToastContainer();

  // Initialize page-specific features
  const page = document.body.dataset.page;
  switch (page) {
    case 'home': initHomePage(); break;
    case 'browse': initBrowsePage(); break;
    case 'category': initCategoryPage(); break;
    case 'product-details': initProductDetailsPage(); break;
    case 'availability': initAvailabilityPage(); break;
    case 'booking': initBookingPage(); break;
    case 'favorites': initFavoritesPage(); break;
    case 'cart': initCartPage(); break;
    case 'checkout': initCheckoutPage(); break;
    case 'checkout': initCheckoutPage(); break;
    case 'profile': initProfilePage(); break;
    case 'help': initHelpPage(); break;
    case 'login': initLoginPage(); break;
    case 'signup': initSignupPage(); break;
  }

  // Intersection observer for scroll animations
  initScrollAnimations();
});

// ── Dark Mode ──
function initDarkMode() {
  if (RentivoApp.darkMode) {
    document.body.classList.add('dark-mode');
  }
  const btn = document.getElementById('darkModeToggle');
  if (btn) {
    btn.addEventListener('click', toggleDarkMode);
  }
}

function toggleDarkMode() {
  RentivoApp.darkMode = !RentivoApp.darkMode;
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('rentivo_dark_mode', RentivoApp.darkMode);
  showToast(RentivoApp.darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
}

// ── RTL ──
function initRTL() {
  if (RentivoApp.rtl) {
    document.body.classList.add('rtl');
  }
}

function toggleRTL() {
  RentivoApp.rtl = !RentivoApp.rtl;
  document.body.classList.toggle('rtl');
  localStorage.setItem('rentivo_rtl', RentivoApp.rtl);
  showToast(RentivoApp.rtl ? 'RTL mode enabled' : 'LTR mode enabled', 'info');
}

// ── Header ──
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Header user dropdown & logout wiring
  const profileBtn = document.getElementById('headerProfile');
  if (profileBtn) {
    if (RentivoApp.isLoggedIn) {
      const actions = profileBtn.parentElement;
      if (actions && !document.getElementById('userDropdown')) {
        actions.style.position = 'relative';
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.id = 'userDropdown';
        dropdown.innerHTML = `
          <div class="user-dropdown__header">
            <div class="user-dropdown__avatar">${(RentivoApp.user?.name || 'A').charAt(0)}</div>
            <div class="user-dropdown__info">
              <div class="user-dropdown__name">${RentivoApp.user?.name || 'Alex Morgan'}</div>
              <div class="user-dropdown__email">${RentivoApp.user?.email || 'alex.m@example.com'}</div>
            </div>
          </div>
          <div class="user-dropdown__divider"></div>
          <a href="profile.html" class="user-dropdown__item">${ICONS.user} My Profile</a>
          <a href="my-rentals.html" class="user-dropdown__item">${ICONS.package} My Rentals</a>
          <a href="favorites.html" class="user-dropdown__item">${ICONS.heart} Saved Items</a>
          <a href="help.html" class="user-dropdown__item">${ICONS.helpCircle} Help Center</a>
          <div class="user-dropdown__divider"></div>
          <button class="user-dropdown__item user-dropdown__item--logout" id="dropdownLogoutBtn" onclick="RentivoApp.logout()">
            ${ICONS.logOut} Logout
          </button>
        `;
        actions.appendChild(dropdown);

        profileBtn.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
          if (!actions.contains(e.target)) {
            dropdown.classList.remove('open');
          }
        });
      }
    } else {
      profileBtn.href = 'login.html';
      profileBtn.title = 'Log In';
    }
  }

  // Bind all data-logout buttons
  document.querySelectorAll('[data-logout-btn]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      RentivoApp.logout();
    });
  });
}

// ── Mobile Menu ──
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggleBtn || !menu) return;

  // Inject icons into mobile menu
  const iconHome = menu.querySelector('#mobNavHome'); if (iconHome) iconHome.innerHTML = ICONS.home;
  const iconBrowse = menu.querySelector('#mobNavBrowse'); if (iconBrowse) iconBrowse.innerHTML = ICONS.search;
  const iconRentals = menu.querySelector('#mobNavRentals'); if (iconRentals) iconRentals.innerHTML = ICONS.grid;
  const iconFav = menu.querySelector('#mobNavFav'); if (iconFav) iconFav.innerHTML = ICONS.heart;
  const iconCart = menu.querySelector('#mobNavCart'); if (iconCart) iconCart.innerHTML = ICONS.bag;
  const iconHelp = menu.querySelector('#mobNavHelp'); if (iconHelp) iconHelp.innerHTML = ICONS.helpCircle;
  const btnProf = menu.querySelector('#mobBtnProfile'); if (btnProf) btnProf.innerHTML = ICONS.user;
  const btnFav = menu.querySelector('#mobBtnFav'); if (btnFav) btnFav.innerHTML = ICONS.heart;
  const btnBag = menu.querySelector('#mobBtnBag'); if (btnBag) btnBag.innerHTML = ICONS.bag;

  toggleBtn.addEventListener('click', () => {
    RentivoApp.mobileMenuOpen = !RentivoApp.mobileMenuOpen;
    menu.classList.toggle('open');
    toggleBtn.innerHTML = RentivoApp.mobileMenuOpen ? ICONS.x : ICONS.menu;
    document.body.style.overflow = RentivoApp.mobileMenuOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggleBtn.innerHTML = ICONS.menu;
      document.body.style.overflow = '';
      RentivoApp.mobileMenuOpen = false;
    });
  });

  updateBagCount();
  updateFavCount();
}

// ── Search Overlay ──
function initSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  const openBtns = document.querySelectorAll('[data-search-open]');
  if (!overlay) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.classList.add('open');
      const input = overlay.querySelector('input');
      if (input) setTimeout(() => input.focus(), 200);
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  const closeBtn = overlay.querySelector('[data-search-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  }

  // Search input handler
  const input = overlay.querySelector('input');
  const resultsContainer = overlay.querySelector('.search-overlay__results');
  if (input && resultsContainer) {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
      }
      const matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query)
      ).slice(0, 5);

      resultsContainer.innerHTML = matches.map(p => `
        <a href="product-details.html?id=${p.id}" class="search-result-item">
          <div class="search-result-item__image">${getProductSVG(p.image, 48)}</div>
          <div class="search-result-item__info">
            <div class="search-result-item__name">${p.name}</div>
            <div class="search-result-item__price">$${p.dailyPrice}/day · $${p.weeklyPrice}/week</div>
          </div>
        </a>
      `).join('');
    });
  }

  // Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
}

// ── Toast Notifications ──
function initToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const icons = {
    success: ICONS.check,
    error: ICONS.x,
    info: ICONS.helpCircle,
    warning: ICONS.clock,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__message">${message}</span>
    <button class="toast__close">${ICONS.x}</button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const close = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  };

  toast.querySelector('.toast__close').addEventListener('click', close);
  setTimeout(close, 4000);
}

// ── Favorites ──
function toggleFavorite(productId) {
  const idx = RentivoApp.favorites.indexOf(productId);
  if (idx > -1) {
    RentivoApp.favorites.splice(idx, 1);
    showToast('Removed from favorites', 'info');
  } else {
    RentivoApp.favorites.push(productId);
    showToast('Added to favorites', 'success');
  }
  localStorage.setItem('rentivo_favorites', JSON.stringify(RentivoApp.favorites));
  updateFavCount();

  // Update UI
  document.querySelectorAll(`[data-fav-id="${productId}"]`).forEach(btn => {
    btn.classList.toggle('active', RentivoApp.favorites.includes(productId));
  });
}

function updateFavCount() {
  document.querySelectorAll('.fav-count').forEach(el => {
    el.textContent = RentivoApp.favorites.length;
    el.style.display = RentivoApp.favorites.length > 0 ? '' : 'none';
  });
}

// ── Rental Bag ──
function addToBag(product, startDate, endDate) {
  const existing = RentivoApp.rentalBag.find(item => item.id === product.id);
  if (existing) {
    showToast('This item is already in your Rental Bag', 'warning');
    return;
  }

  const start = startDate || getDefaultStartDate();
  const end = endDate || getDefaultEndDate();
  const days = calculateDays(start, end);

  RentivoApp.rentalBag.push({
    id: product.id,
    name: product.name,
    image: product.image,
    dailyPrice: product.dailyPrice,
    weeklyPrice: product.weeklyPrice,
    deposit: product.deposit,
    startDate: start,
    endDate: end,
    days: days,
  });

  localStorage.setItem('rentivo_bag', JSON.stringify(RentivoApp.rentalBag));
  updateBagCount();
  showToast(`${product.name} added to Rental Bag`, 'success');
}

function removeFromBag(productId) {
  RentivoApp.rentalBag = RentivoApp.rentalBag.filter(item => item.id !== productId);
  localStorage.setItem('rentivo_bag', JSON.stringify(RentivoApp.rentalBag));
  updateBagCount();
  showToast('Item removed from Rental Bag', 'info');
}

function updateBagCount() {
  document.querySelectorAll('.bag-count').forEach(el => {
    el.textContent = RentivoApp.rentalBag.length;
    el.style.display = RentivoApp.rentalBag.length > 0 ? '' : 'none';
  });
}

// ── Date Utilities ──
function getDefaultStartDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return formatDate(d);
}

function getDefaultEndDate() {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return formatDate(d);
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calculateDays(start, end) {
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

// ── Price Calculation ──
function calculateRentalPrice(dailyPrice, weeklyPrice, days) {
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    return (weeks * weeklyPrice) + (remainingDays * dailyPrice);
  }
  return days * dailyPrice;
}

function calculateTotal(items) {
  let rental = 0;
  let deposit = 0;
  items.forEach(item => {
    rental += calculateRentalPrice(item.dailyPrice, item.weeklyPrice, item.days);
    deposit += item.deposit;
  });
  const deliveryFee = 15;
  const serviceFee = Math.round(rental * 0.08);
  return { rental, deposit, deliveryFee, serviceFee, total: rental + deliveryFee + serviceFee, grandTotal: rental + deliveryFee + serviceFee + deposit };
}

// ── Calendar Component ──
class RentivoCalendar {
  constructor(container, options = {}) {
    this.container = container;
    this.currentMonth = new Date();
    this.currentMonth.setDate(1);
    this.startDate = options.startDate || null;
    this.endDate = options.endDate || null;
    this.bookedDates = options.bookedDates || [];
    this.onDateChange = options.onDateChange || (() => {});
    this.render();
  }

  render() {
    const month = this.currentMonth.getMonth();
    const year = this.currentMonth.getFullYear();
    const monthName = this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let daysHTML = '';
    // Empty cells for days before first of month
    for (let i = 0; i < firstDay; i++) {
      daysHTML += '<div class="calendar__day calendar__day--empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      date.setHours(0, 0, 0, 0);
      const dateStr = formatDate(date);
      const isPast = date < today;
      const isBooked = this.bookedDates.includes(dateStr);
      const isToday = date.getTime() === today.getTime();
      const isSelected = dateStr === this.startDate || dateStr === this.endDate;
      const isInRange = this.startDate && this.endDate && dateStr > this.startDate && dateStr < this.endDate;
      const isRangeStart = dateStr === this.startDate && this.endDate;
      const isRangeEnd = dateStr === this.endDate && this.startDate;

      let cls = 'calendar__day';
      if (isPast) cls += ' calendar__day--disabled';
      else if (isBooked) cls += ' calendar__day--booked';
      if (isToday) cls += ' calendar__day--today';
      if (isSelected) cls += ' calendar__day--selected';
      if (isInRange) cls += ' calendar__day--in-range';
      if (isRangeStart) cls += ' calendar__day--range-start';
      if (isRangeEnd) cls += ' calendar__day--range-end';

      daysHTML += `<div class="${cls}" data-date="${dateStr}">${d}</div>`;
    }

    this.container.innerHTML = `
      <div class="calendar__header">
        <span class="calendar__month-year">${monthName}</span>
        <div class="calendar__nav">
          <button class="calendar__nav-btn" data-cal-prev>${ICONS.chevronLeft}</button>
          <button class="calendar__nav-btn" data-cal-next>${ICONS.chevronRight}</button>
        </div>
      </div>
      <div class="calendar__weekdays">
        <div class="calendar__weekday">Sun</div>
        <div class="calendar__weekday">Mon</div>
        <div class="calendar__weekday">Tue</div>
        <div class="calendar__weekday">Wed</div>
        <div class="calendar__weekday">Thu</div>
        <div class="calendar__weekday">Fri</div>
        <div class="calendar__weekday">Sat</div>
      </div>
      <div class="calendar__days">${daysHTML}</div>
      <div class="calendar__legend">
        <div class="calendar__legend-item"><span class="calendar__legend-dot calendar__legend-dot--available"></span> Available</div>
        <div class="calendar__legend-item"><span class="calendar__legend-dot calendar__legend-dot--booked"></span> Booked</div>
        <div class="calendar__legend-item"><span class="calendar__legend-dot calendar__legend-dot--selected"></span> Selected</div>
      </div>
    `;

    // Bind events
    this.container.querySelector('[data-cal-prev]').addEventListener('click', () => this.prevMonth());
    this.container.querySelector('[data-cal-next]').addEventListener('click', () => this.nextMonth());

    this.container.querySelectorAll('.calendar__day:not(.calendar__day--disabled):not(.calendar__day--booked):not(.calendar__day--empty)').forEach(day => {
      day.addEventListener('click', () => this.selectDate(day.dataset.date));
    });
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    const daysEl = this.container.querySelector('.calendar__days');
    if (daysEl) daysEl.classList.add('slide-right');
    setTimeout(() => this.render(), 50);
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    const daysEl = this.container.querySelector('.calendar__days');
    if (daysEl) daysEl.classList.add('slide-left');
    setTimeout(() => this.render(), 50);
  }

  selectDate(dateStr) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = dateStr;
      this.endDate = null;
    } else if (dateStr > this.startDate) {
      this.endDate = dateStr;
    } else {
      this.startDate = dateStr;
      this.endDate = null;
    }
    this.render();
    this.onDateChange(this.startDate, this.endDate);
  }
}

// ── Product Card Renderer ──
function renderProductCard(product) {
  const isFav = RentivoApp.favorites.includes(product.id);
  return `
    <div class="product-card" data-product-id="${product.id}" data-category="${product.category}">
      <div class="product-card__image">
        ${getProductSVG(product.image)}
        <button class="product-card__favorite ${isFav ? 'active' : ''}" data-fav-id="${product.id}" onclick="toggleFavorite(${product.id})">
          ${ICONS.heart}
        </button>
        ${product.available
          ? '<span class="product-card__badge badge badge--available">Available</span>'
          : '<span class="product-card__badge badge badge--booked">Booked</span>'
        }
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.desc}</p>
        <div class="product-card__pricing">
          <span class="product-card__price">$${product.dailyPrice}<span class="product-card__price-unit">/day</span></span>
          <span class="product-card__weekly">From $${product.weeklyPrice}/week</span>
        </div>
        <div class="product-card__meta">
          <div class="product-card__rating">
            ${ICONS.star} ${product.rating} <span>(${product.reviews})</span>
          </div>
          <span class="product-card__availability ${product.available ? '' : 'unavailable'}">${product.available ? 'Available' : 'Booked'}</span>
        </div>
      </div>
      <div class="product-card__actions" style="display: flex; gap: var(--space-2);">
        <a href="product-details.html?id=${product.id}" class="btn btn--primary" style="flex: 1;">View Details</a>
        <a href="availability.html?id=${product.id}" class="btn btn--outline" style="flex: 1; text-align: center; text-decoration: none;">Availability</a>
      </div>
    </div>
  `;
}

// ── Scroll Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ── Modal ──
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ──────────────────────────────────────
// PAGE INITIALIZERS
// ──────────────────────────────────────

// ── HOME PAGE ──
function initHomePage() {
  // Render featured products
  const grid = document.getElementById('featuredProducts');
  if (grid) {
    grid.innerHTML = PRODUCTS.slice(0, 8).map(renderProductCard).join('');
  }

  // Rental search form
  const searchForm = document.getElementById('rentalSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'browse.html';
    });
  }
}

// ── BROWSE PAGE ──
function initBrowsePage() {
  const grid = document.getElementById('browseProducts');
  const sortSelect = document.getElementById('browseSort');
  const resultCount = document.getElementById('resultCount');
  let filtered = [...PRODUCTS];

  function renderProducts(products) {
    if (grid) {
      grid.innerHTML = products.map(renderProductCard).join('');
    }
    if (resultCount) {
      resultCount.textContent = `${products.length} products`;
    }
  }

  function applyFilters() {
    let result = [...PRODUCTS];

    // Category filter
    const checkedCats = document.querySelectorAll('.filter-cat:checked');
    if (checkedCats.length > 0) {
      const cats = [...checkedCats].map(cb => cb.value);
      result = result.filter(p => cats.includes(p.category));
    }

    // Price filter
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
      const maxPrice = parseInt(priceRange.value);
      result = result.filter(p => p.dailyPrice <= maxPrice);
    }

    // Availability filter
    const availOnly = document.getElementById('filterAvailable');
    if (availOnly && availOnly.checked) {
      result = result.filter(p => p.available);
    }

    // Rating filter
    const ratingMin = document.getElementById('filterRating');
    if (ratingMin && ratingMin.checked) {
      result = result.filter(p => p.rating >= 4.5);
    }

    // Sorting
    if (sortSelect) {
      const sort = sortSelect.value;
      switch (sort) {
        case 'price-low': result.sort((a, b) => a.dailyPrice - b.dailyPrice); break;
        case 'price-high': result.sort((a, b) => b.dailyPrice - a.dailyPrice); break;
        case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
        case 'recent': result.sort((a, b) => b.id - a.id); break;
      }
    }

    filtered = result;
    renderProducts(result);
  }

  // Event listeners
  document.querySelectorAll('.filter-cat').forEach(cb => cb.addEventListener('change', applyFilters));

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    const priceDisplay = document.getElementById('priceRangeValue');
    priceRange.addEventListener('input', () => {
      if (priceDisplay) priceDisplay.textContent = `$${priceRange.value}`;
      applyFilters();
    });
  }

  const availFilter = document.getElementById('filterAvailable');
  if (availFilter) availFilter.addEventListener('change', applyFilters);

  const ratingFilter = document.getElementById('filterRating');
  if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);

  if (sortSelect) sortSelect.addEventListener('change', applyFilters);

  // Mobile filter toggle
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  if (filterToggle && filterPanel) {
    filterToggle.addEventListener('click', () => {
      filterPanel.classList.toggle('open');
      document.body.style.overflow = filterPanel.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Filter section collapsible
  document.querySelectorAll('.filter-section__title').forEach(title => {
    title.addEventListener('click', () => {
      title.closest('.filter-section').classList.toggle('collapsed');
    });
  });

  // Clear filters
  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-cat').forEach(cb => cb.checked = false);
      if (priceRange) priceRange.value = priceRange.max;
      if (availFilter) availFilter.checked = false;
      if (ratingFilter) ratingFilter.checked = false;
      const priceDisplay = document.getElementById('priceRangeValue');
      if (priceDisplay && priceRange) priceDisplay.textContent = `$${priceRange.max}`;
      applyFilters();
    });
  }

  renderProducts(PRODUCTS);
}

// ── CATEGORY PAGE ──
function initCategoryPage() {
  const grid = document.getElementById('categoryProducts');
  if (grid) {
    const cameraProducts = PRODUCTS.filter(p => p.category === 'Cameras' || p.category === 'Electronics');
    grid.innerHTML = cameraProducts.map(renderProductCard).join('');
  }

  // Duration pills
  document.querySelectorAll('.duration-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// ── PRODUCT DETAILS PAGE ──
function initProductDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id')) || 1;
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

  // Fill product info
  const nameEl = document.getElementById('productName');
  if (nameEl) nameEl.textContent = product.name;

  const descEl = document.getElementById('productDesc');
  if (descEl) descEl.textContent = product.desc;

  const dailyEl = document.getElementById('dailyPrice');
  if (dailyEl) dailyEl.textContent = `$${product.dailyPrice}`;

  const weeklyEl = document.getElementById('weeklyPrice');
  if (weeklyEl) weeklyEl.textContent = `$${product.weeklyPrice}`;

  const depositEl = document.getElementById('depositPrice');
  if (depositEl) depositEl.textContent = `$${product.deposit}`;

  const ratingEl = document.getElementById('productRating');
  if (ratingEl) ratingEl.textContent = `${product.rating} (${product.reviews} reviews)`;

  // Gallery
  initGallery(product.image);

  // Calendar
  const calContainer = document.getElementById('productCalendar');
  if (calContainer) {
    const bookedDates = generateBookedDates();
    const calendar = new RentivoCalendar(calContainer, {
      bookedDates,
      onDateChange: (start, end) => {
        const startInput = document.getElementById('rentalStart');
        const endInput = document.getElementById('rentalEnd');
        if (startInput) startInput.value = start || '';
        if (endInput) endInput.value = end || '';
        updatePriceSummary(product);
      }
    });
  }

  // Date inputs
  const startInput = document.getElementById('rentalStart');
  const endInput = document.getElementById('rentalEnd');
  if (startInput) startInput.value = getDefaultStartDate();
  if (endInput) endInput.value = getDefaultEndDate();
  updatePriceSummary(product);

  [startInput, endInput].forEach(input => {
    if (input) input.addEventListener('change', () => updatePriceSummary(product));
  });

  // Delivery options
  document.querySelectorAll('.delivery-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Add to bag
  const addBtn = document.getElementById('addToBag');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const start = startInput?.value || getDefaultStartDate();
      const end = endInput?.value || getDefaultEndDate();
      addToBag(product, start, end);
    });
  }

  // Reserve now
  const reserveBtn = document.getElementById('reserveNow');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', () => {
      const start = startInput?.value || getDefaultStartDate();
      const end = endInput?.value || getDefaultEndDate();
      addToBag(product, start, end);
      window.location.href = 'booking.html';
    });
  }

  // Favorite
  const favBtn = document.getElementById('productFav');
  if (favBtn) {
    favBtn.classList.toggle('active', RentivoApp.favorites.includes(product.id));
    favBtn.addEventListener('click', () => toggleFavorite(product.id));
  }
}

function initGallery(imageType) {
  const mainImage = document.getElementById('galleryMain');
  const thumbs = document.querySelectorAll('.product-gallery__thumb');
  if (!mainImage) return;

  mainImage.innerHTML = getProductSVG(imageType, 500);

  // Gallery navigation
  const prevBtn = document.querySelector('.product-gallery__nav-btn--prev');
  const nextBtn = document.querySelector('.product-gallery__nav-btn--next');
  let currentSlide = 0;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentSlide = Math.max(0, currentSlide - 1);
      updateGallerySlide(thumbs, currentSlide);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentSlide = Math.min(thumbs.length - 1, currentSlide + 1);
      updateGallerySlide(thumbs, currentSlide);
    });
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      currentSlide = i;
      updateGallerySlide(thumbs, currentSlide);
    });
  });
}

function updateGallerySlide(thumbs, index) {
  thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
}

function updatePriceSummary(product) {
  const startInput = document.getElementById('rentalStart');
  const endInput = document.getElementById('rentalEnd');
  if (!startInput || !endInput) return;

  const start = startInput.value;
  const end = endInput.value;
  if (!start || !end) return;

  const days = calculateDays(start, end);
  const rentalPrice = calculateRentalPrice(product.dailyPrice, product.weeklyPrice, days);
  const deliveryFee = 15;
  const serviceFee = Math.round(rentalPrice * 0.08);
  const total = rentalPrice + deliveryFee + serviceFee;

  const durationEl = document.getElementById('rentalDuration');
  if (durationEl) {
    durationEl.innerHTML = `Rental duration: <strong>${days} day${days > 1 ? 's' : ''}</strong>`;
    durationEl.classList.add('price-update');
    setTimeout(() => durationEl.classList.remove('price-update'), 400);
  }

  const summaryEls = {
    summaryRental: `$${rentalPrice}`,
    summaryDelivery: `$${deliveryFee}`,
    summaryService: `$${serviceFee}`,
    summaryDeposit: `$${product.deposit}`,
    summaryTotal: `$${total + product.deposit}`,
  };

  Object.entries(summaryEls).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = val;
      el.classList.add('price-update');
      setTimeout(() => el.classList.remove('price-update'), 400);
    }
  });
}

function generateBookedDates() {
  const booked = [];
  const now = new Date();
  // Generate some random booked dates
  for (let i = 0; i < 8; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + Math.floor(Math.random() * 30) + 5);
    booked.push(formatDate(d));
  }
  return booked;
}

// ── AVAILABILITY PAGE ──
function initAvailabilityPage() {
  const product = PRODUCTS[0]; // Default product
  const calContainer = document.getElementById('availabilityCalendar');
  if (calContainer) {
    const bookedDates = generateBookedDates();
    new RentivoCalendar(calContainer, {
      bookedDates,
      onDateChange: (start, end) => {
        if (start && end) {
          const days = calculateDays(start, end);
          const rental = calculateRentalPrice(product.dailyPrice, product.weeklyPrice, days);
          const durationEl = document.getElementById('avDuration');
          if (durationEl) durationEl.textContent = `${days} day${days > 1 ? 's' : ''}`;
          const rentalEl = document.getElementById('avRental');
          if (rentalEl) rentalEl.textContent = `$${rental}`;
          const depositEl = document.getElementById('avDeposit');
          if (depositEl) depositEl.textContent = `$${product.deposit}`;
          const totalEl = document.getElementById('avTotal');
          if (totalEl) totalEl.textContent = `$${rental + 15 + Math.round(rental * 0.08) + product.deposit}`;
        }
      }
    });
  }
}

// ── BOOKING PAGE ──
function initBookingPage() {
  // Delivery options
  document.querySelectorAll('.delivery-option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
}

// ── FAVORITES PAGE ──
function initFavoritesPage() {
  const grid = document.getElementById('favoritesGrid');
  const emptyState = document.getElementById('favoritesEmpty');
  if (!grid) return;

  function renderFavorites() {
    const favProducts = PRODUCTS.filter(p => RentivoApp.favorites.includes(p.id));
    if (favProducts.length === 0) {
      grid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      grid.style.display = '';
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = favProducts.map(renderProductCard).join('');
    }
  }

  renderFavorites();
  // Re-render on favorite toggle
  window.addEventListener('storage', renderFavorites);
}

// ── CART (RENTAL BAG) PAGE ──
function initCartPage() {
  renderBagItems();
}

function renderBagItems() {
  const bagList = document.getElementById('bagItems');
  const bagEmpty = document.getElementById('bagEmpty');
  const bagSummary = document.getElementById('bagSummary');
  if (!bagList) return;

  if (RentivoApp.rentalBag.length === 0) {
    bagList.style.display = 'none';
    if (bagSummary) bagSummary.style.display = 'none';
    if (bagEmpty) bagEmpty.style.display = 'block';
    return;
  }

  if (bagEmpty) bagEmpty.style.display = 'none';
  bagList.style.display = '';
  if (bagSummary) bagSummary.style.display = '';

  bagList.innerHTML = RentivoApp.rentalBag.map(item => {
    const rentalPrice = calculateRentalPrice(item.dailyPrice, item.weeklyPrice, item.days);
    return `
      <div class="bag-item" data-bag-id="${item.id}">
        <div class="bag-item__image">${getProductSVG(item.image, 100)}</div>
        <div class="bag-item__info">
          <h3 class="bag-item__name">${item.name}</h3>
          <p class="bag-item__dates">${formatDateDisplay(item.startDate)} — ${formatDateDisplay(item.endDate)}</p>
          <p class="bag-item__duration">${item.days} day${item.days > 1 ? 's' : ''} · $${item.dailyPrice}/day</p>
        </div>
        <div class="bag-item__pricing">
          <div class="bag-item__price">$${rentalPrice}</div>
          <div class="bag-item__deposit">Deposit: $${item.deposit}</div>
          <button class="bag-item__remove" onclick="removeFromBag(${item.id}); renderBagItems();">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Update summary
  const totals = calculateTotal(RentivoApp.rentalBag);
  const rentalEl = document.getElementById('bagRental');
  const deliveryEl = document.getElementById('bagDelivery');
  const serviceEl = document.getElementById('bagService');
  const depositEl = document.getElementById('bagDeposit');
  const totalEl = document.getElementById('bagTotal');

  if (rentalEl) rentalEl.textContent = `$${totals.rental}`;
  if (deliveryEl) deliveryEl.textContent = `$${totals.deliveryFee}`;
  if (serviceEl) serviceEl.textContent = `$${totals.serviceFee}`;
  if (depositEl) depositEl.textContent = `$${totals.deposit}`;
  if (totalEl) totalEl.textContent = `$${totals.grandTotal}`;
}

// ── CHECKOUT PAGE ──
function initCheckoutPage() {
  const steps = document.querySelectorAll('.checkout-step');
  const sections = document.querySelectorAll('.checkout-section');
  let currentStep = 0;

  function goToStep(step) {
    currentStep = step;
    steps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i < step) s.classList.add('completed');
      if (i === step) s.classList.add('active');
    });

    // Update connectors
    document.querySelectorAll('.checkout-step__connector').forEach((c, i) => {
      c.classList.toggle('completed', i < step);
    });

    sections.forEach((s, i) => {
      s.classList.toggle('active', i === step);
    });
  }

  document.querySelectorAll('[data-checkout-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < sections.length - 1) goToStep(currentStep + 1);
    });
  });

  document.querySelectorAll('[data-checkout-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) goToStep(currentStep - 1);
    });
  });

  // Payment methods
  document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      method.classList.add('active');
    });
  });

  // Delivery options (checkout)
  document.querySelectorAll('.delivery-option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Confirm
  const confirmBtn = document.getElementById('confirmRental');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      goToStep(3);
      RentivoApp.rentalBag = [];
      localStorage.setItem('rentivo_bag', '[]');
      updateBagCount();
    });
  }

  // Update checkout summary
  const totals = calculateTotal(RentivoApp.rentalBag);
  const rentalEl = document.getElementById('checkoutRental');
  const deliveryEl = document.getElementById('checkoutDelivery');
  const serviceEl = document.getElementById('checkoutService');
  const depositEl = document.getElementById('checkoutDeposit');
  const totalEl = document.getElementById('checkoutTotal');

  if (rentalEl) rentalEl.textContent = `$${totals.rental}`;
  if (deliveryEl) deliveryEl.textContent = `$${totals.deliveryFee}`;
  if (serviceEl) serviceEl.textContent = `$${totals.serviceFee}`;
  if (depositEl) depositEl.textContent = `$${totals.deposit}`;
  if (totalEl) totalEl.textContent = `$${totals.grandTotal}`;

  goToStep(0);
}

// ── PROFILE PAGE ──
function initProfilePage() {
  // Dark mode toggle
  const darkToggle = document.getElementById('profileDarkToggle');
  if (darkToggle) {
    if (RentivoApp.darkMode) darkToggle.classList.add('active');
    darkToggle.addEventListener('click', () => {
      toggleDarkMode();
      darkToggle.classList.toggle('active');
    });
  }

  // RTL toggle
  const rtlToggle = document.getElementById('profileRTLToggle');
  if (rtlToggle) {
    if (RentivoApp.rtl) rtlToggle.classList.add('active');
    rtlToggle.addEventListener('click', () => {
      toggleRTL();
      rtlToggle.classList.toggle('active');
    });
  }

  // Profile sidebar nav
  document.querySelectorAll('.profile-sidebar__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.profile-sidebar__link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const target = link.dataset.section;
      document.querySelectorAll('.profile-section').forEach(s => {
        s.style.display = s.id === target ? '' : 'none';
      });
    });
  });
}

// ── HELP PAGE ──
function initHelpPage() {
  // Accordion
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion__item').forEach(a => a.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  // Help search
  const helpSearch = document.getElementById('helpSearchInput');
  if (helpSearch) {
    helpSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.accordion__item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
}

// ── GLOBAL NEWSLETTER HANDLER ──
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterEmail');
  if (input && input.value) {
    showToast(`Subscribed successfully with ${input.value}!`, 'success');
    input.value = '';
  }
}

// ── LOGIN PAGE ──
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value || 'alex.m@example.com';
      const password = document.getElementById('loginPassword')?.value || '******';
      RentivoApp.login(email, password);
    });
  }
}

// ── SIGNUP PAGE ──
function initSignupPage() {
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName')?.value || 'New User';
      const email = document.getElementById('signupEmail')?.value || 'user@example.com';
      const password = document.getElementById('signupPassword')?.value || '******';
      RentivoApp.signup(name, email, password);
    });
  }
}
