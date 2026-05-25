'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu, X, Building2, Users, Phone, ChevronRight,
  Heart, Share2, MapPin, Bed, Bath, Square, Search,
  MessageCircle, Facebook, Twitter, Instagram, Linkedin,
  Youtube, IndianRupee, Home,
} from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  owner: string;
  ownerImage: string;
  isVerified: boolean;
  listingType: 'SALE' | 'RENT';
  propertyType: string;
  featured: boolean;
}

const PROPERTIES: Property[] = [
  {
    id: 1, title: 'Luxury 3BHK Apartment', price: 12500000,
    location: 'Andheri West', city: 'Mumbai', bedrooms: 3, bathrooms: 2, area: 1450,
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&q=80',
    owner: 'Rahul Sharma', ownerImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    isVerified: true, listingType: 'SALE', propertyType: 'Apartment', featured: true,
  },
  {
    id: 2, title: 'Spacious 4BHK Villa', price: 85000,
    location: 'Whitefield', city: 'Bangalore', bedrooms: 4, bathrooms: 3, area: 2800,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    owner: 'Priya Patel', ownerImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    isVerified: true, listingType: 'RENT', propertyType: 'Villa', featured: true,
  },
  {
    id: 3, title: 'Modern 2BHK Condo', price: 8500000,
    location: 'ECR', city: 'Chennai', bedrooms: 2, bathrooms: 2, area: 1100,
    image: 'https://images.unsplash.com/photo-1580237072353-751a8a5b2598?w=600&q=80',
    owner: 'Arjun Reddy', ownerImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    isVerified: false, listingType: 'SALE', propertyType: 'Condo', featured: false,
  },
  {
    id: 4, title: 'Cozy 1BHK Studio', price: 25000,
    location: 'Koramangala', city: 'Bangalore', bedrooms: 1, bathrooms: 1, area: 650,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    owner: 'Neha Gupta', ownerImage: 'https://randomuser.me/api/portraits/women/4.jpg',
    isVerified: true, listingType: 'RENT', propertyType: 'Studio', featured: false,
  },
  {
    id: 5, title: 'Premium 5BHK Penthouse', price: 25000000,
    location: 'Juhu', city: 'Mumbai', bedrooms: 5, bathrooms: 4, area: 3200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    owner: 'Vikram Malhotra', ownerImage: 'https://randomuser.me/api/portraits/men/5.jpg',
    isVerified: true, listingType: 'SALE', propertyType: 'Penthouse', featured: true,
  },
  {
    id: 6, title: 'Commercial Office Space', price: 120000,
    location: 'MG Road', city: 'Pune', bedrooms: 0, bathrooms: 2, area: 1500,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80',
    owner: 'Redsand Group', ownerImage: 'https://randomuser.me/api/portraits/men/6.jpg',
    isVerified: true, listingType: 'RENT', propertyType: 'Commercial', featured: false,
  },
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

const STATS = [
  { icon: '🏠', number: '50,000+', label: 'Properties Sold' },
  { icon: '👥', number: '10,000+', label: 'Happy Customers' },
  { icon: '📍', number: '25+', label: 'Cities Covered' },
  { icon: '⭐', number: '4.9', label: 'Customer Rating' },
];

const FEATURES = [
  { icon: '💰', title: 'Zero Brokerage', desc: 'Direct owner deals with no middlemen, saving you up to 2% commission' },
  { icon: '✓', title: 'Verified Properties', desc: 'All properties verified by our team for authenticity and legal clearance' },
  { icon: '⚡', title: 'Quick Process', desc: 'Streamlined documentation and legal verification within days' },
  { icon: '🔒', title: 'Secure Transactions', desc: 'Safe and transparent payment process with escrow support' },
];

const TESTIMONIALS = [
  { stars: 5, text: 'Found my dream home in just 2 weeks. Zero brokerage saved me lakhs!', name: 'Rahul Kumar', initials: 'RK', city: 'Mumbai' },
  { stars: 5, text: 'Excellent platform for direct owner deals. Highly recommended!', name: 'Priya Singh', initials: 'PS', city: 'Bangalore' },
  { stars: 5, text: 'Smooth process from listing to sale. Best real estate experience.', name: 'Amit Mehta', initials: 'AM', city: 'Delhi' },
];

type FilterType = 'all' | 'sale' | 'rent' | 'featured';

function formatPrice(price: number, type: string): string {
  if (type === 'RENT') return `${(price / 1000).toFixed(0)}K/mo`;
  if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`;
  return `${(price / 100000).toFixed(0)}L`;
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const filtered = PROPERTIES.filter(p => {
    if (filter === 'sale' && p.listingType !== 'SALE') return false;
    if (filter === 'rent' && p.listingType !== 'RENT') return false;
    if (filter === 'featured' && !p.featured) return false;
    const q = search.toLowerCase();
    if (q && !p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
    return true;
  });

  const toggleSave = (id: number) =>
    setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Properties' },
    { key: 'sale', label: 'For Sale' },
    { key: 'rent', label: 'For Rent' },
    { key: 'featured', label: 'Featured' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── ENHANCED NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Enhanced Brand */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Building2 size={20} />
              </div>
              <div className="leading-tight">
                <span className="block text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Redsand
                </span>
                <span className="block text-[11px] tracking-wider text-slate-400 uppercase font-medium">Group</span>
              </div>
            </Link>

            {/* Desktop Navigation - Enhanced */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {[
                  { href: '/', label: 'Home', icon: <Home size={16} /> },
                  { href: '/properties', label: 'Properties', icon: <Building2 size={16} /> },
                  { href: '/about', label: 'About Us', icon: <Users size={16} /> },
                  { href: '/contact', label: 'Contact', icon: <Phone size={16} /> }
                ].map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-all duration-200 hover:scale-105"
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/post-property"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-2.5 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
              >
                <Building2 size={16} />
                List Property
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-700 rounded-xl px-5 py-2.5 shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200"
              >
                Sign In
              </Link>
              <button
                className="md:hidden p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all duration-200"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg animate-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 space-y-1">
              {[
                { href: '/', label: 'Home', icon: <Home size={18} /> },
                { href: '/properties', label: 'Properties', icon: <Building2 size={18} /> },
                { href: '/about', label: 'About Us', icon: <Users size={18} /> },
                { href: '/contact', label: 'Contact', icon: <Phone size={18} /> }
              ].map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 text-sm font-medium"
                >
                  {icon}
                  {label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-slate-100">
                <Link
                  href="/post-property"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all duration-200"
                >
                  <Building2 size={16} />
                  List Your Property
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── ENHANCED HERO SECTION ── */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-800 text-white overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 lg:py-32 text-center">
          {/* Enhanced badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2 text-sm mb-8 border border-white/20 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="font-medium">India's Most Trusted Real Estate Platform</span>
          </div>

          {/* Enhanced headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Find Your{' '}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent animate-gradient">
              Dream Home
            </span>
            <br className="hidden sm:block" /> with{' '}
            <span className="relative inline-block">
              Redsand Group
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4 L200 4" stroke="url(#gradientLine)" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5"/>
                <defs>
                  <linearGradient id="gradientLine" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F59E0B"/>
                    <stop offset="1" stopColor="#F97316"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="text-indigo-100 text-base sm:text-xl mb-10 max-w-2xl mx-auto">
            Zero Brokerage • Direct Owner Deals • 50,000+ Happy Families
          </p>

          {/* Enhanced search box */}
          <div className="bg-white rounded-2xl shadow-2xl p-2.5 flex flex-col sm:flex-row gap-2.5 mb-6 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center flex-1 px-4 gap-3">
              <Search size={20} className="text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by city, locality, or property type..."
                className="flex-1 py-3 outline-none text-slate-700 text-base placeholder:text-slate-400 bg-transparent"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="shrink-0 bg-gradient-to-r from-indigo-600 to-blue-700 text-white font-semibold text-base px-8 py-3 rounded-xl hover:shadow-lg hover:opacity-95 transition-all duration-200">
              Search Properties
            </button>
          </div>

          {/* Enhanced filter tabs */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${filter === f.key
                    ? 'bg-white text-indigo-700 shadow-lg transform scale-105'
                    : 'bg-white/15 text-white hover:bg-white/25 backdrop-blur-sm'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path d="M0,0V15.81C13,21.25,27.93,25.67,44.24,28.45c69.76,11.6,136.47,7.22,206.42-5.49C325.13,7.51,400.86,23.75,474,35.7c69.45,11.62,140.84,8.37,210.26-2.74,41.31-6.6,81.32-17.4,121.93-28C838.46,2.27,897.71,8.26,950.36,18.49c26.34,4.86,51.17,11.47,74.5,19.33C1045.52,45.53,1093.29,56.8,1133.36,70.2c25.56,8.54,49.27,18.62,66.64,30.85V0Z" opacity=".5" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      </section>

      {/* ── STATS SECTION (Improved) ── */}
      <section className="bg-slate-50 py-14 sm:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, idx) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-6 text-center shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  {s.number}
                </div>
                <div className="text-sm font-medium text-slate-500 mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTIES SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Featured Properties</h2>
            <p className="text-slate-500 text-sm mt-1">Handpicked premium properties across India</p>
          </div>
          <Link href="/properties" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p>No properties match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => (
              <article key={p.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">

                {/* Image */}
                <div className="relative h-52 shrink-0">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />

                  {p.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      ⭐ Featured
                    </div>
                  )}

                  <div className={`absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white
                    ${p.listingType === 'SALE' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                    {p.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                  </div>

                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button
                      onClick={() => toggleSave(p.id)}
                      className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
                      aria-label="Save property">
                      <Heart size={15} className={savedIds.has(p.id) ? 'text-red-500 fill-red-500' : 'text-slate-400'} />
                    </button>
                    <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform" aria-label="Share">
                      <Share2 size={15} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-indigo-700 font-extrabold text-xl mb-1">
                    <IndianRupee size={16} strokeWidth={2.5} />
                    {formatPrice(p.price, p.listingType)}
                  </div>

                  <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-1">{p.title}</h3>

                  <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
                    <MapPin size={12} />
                    {p.location}, {p.city}
                  </div>

                  <div className="flex gap-3 text-xs text-slate-500 mb-4">
                    {p.bedrooms > 0 && (
                      <span className="flex items-center gap-1"><Bed size={12} />{p.bedrooms} Bed</span>
                    )}
                    <span className="flex items-center gap-1"><Bath size={12} />{p.bathrooms} Bath</span>
                    <span className="flex items-center gap-1"><Square size={12} />{p.area} sq.ft</span>
                  </div>

                  {/* Owner */}
                  <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5 mb-3 mt-auto">
                    <img src={p.ownerImage} alt={p.owner}
                      className="w-8 h-8 rounded-full object-cover shrink-0" loading="lazy" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-700 truncate">{p.owner}</div>
                      <div className="text-[10px] text-slate-400">Direct Owner</div>
                    </div>
                    {p.isVerified && (
                      <div className="ml-auto shrink-0 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all">
                    <MessageCircle size={15} /> Contact Owner
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-gradient-to-br from-indigo-700 via-blue-700 to-blue-800 text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Why Choose Redsand Group?</h2>
            <p className="text-indigo-200 text-sm mt-2">India's most trusted real estate platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/15 transition-colors">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-indigo-200 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES ── */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Popular Cities</h2>
            <p className="text-slate-500 text-sm mt-1">Find properties in India's top cities</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CITIES.map(city => (
              <Link key={city} href={`/properties?city=${city}`}
                className="bg-white rounded-xl p-4 text-center border border-slate-100 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="font-semibold text-slate-700 text-sm group-hover:text-indigo-600 transition-colors">{city}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">2,500+ listed</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">What Our Customers Say</h2>
          <p className="text-slate-500 text-sm mt-1">Real stories from happy homeowners</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="text-amber-400 text-lg mb-3">{'★'.repeat(t.stars)}</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-slate-700 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-800 text-white py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to Find Your Dream Home?</h2>
          <p className="text-indigo-200 text-sm mb-8">
            Join thousands of happy homeowners who found their perfect property with Redsand Group
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties"
              className="py-3 px-6 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors">
              Browse Properties
            </Link>
            <Link href="/post-property"
              className="py-3 px-6 border-2 border-white text-white font-bold text-sm rounded-xl hover:bg-white/10 transition-colors">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white">
                <Building2 size={16} />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Redsand Group</div>
                <div className="text-[10px] text-slate-500">India's Trusted Real Estate</div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Connecting property owners directly with buyers and renters across India. No brokers, no hidden fees.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Social link">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['/about', '/properties', '/post-property', '/contact', '/blog'].map(href => (
                <Link key={href} href={href}
                  className="block text-slate-400 hover:text-white text-xs transition-colors capitalize">
                  {href.replace('/', '').replace('-', ' ') || 'Home'}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <div className="space-y-2">
              {['/faq', '/privacy', '/terms', '/sitemap'].map(href => (
                <Link key={href} href={href}
                  className="block text-slate-400 hover:text-white text-xs transition-colors capitalize">
                  {href.replace('/', '').replace('-', ' ')}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <div className="space-y-2 text-slate-400 text-xs leading-relaxed">
              <p>📍 123, Business Park, Andheri East,<br />Mumbai - 400069</p>
              <p>📞 +91 22 1234 5678</p>
              <p>✉️ info@redsandgroup.com</p>
              <p>⏰ Mon–Sat: 9 AM – 8 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-4 py-4 text-center text-[11px] text-slate-500">
          © 2026 Redsand Group. All rights reserved. Made with ❤️ in India 🇮🇳
        </div>
      </footer>
    </div>
  );
}