'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Bed, Bath, Square, Filter, X, 
  Home, Building2, Phone, Users, ChevronDown,
  IndianRupee, Heart, Share2, Menu, ArrowLeft
} from 'lucide-react';

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  imageIcon: string;
  image?: string;
  isVerified?: boolean;
  listingType?: 'SALE' | 'RENT';
}

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [listingType, setListingType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const properties: Property[] = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      price: 12500000,
      location: "Andheri West",
      city: "Mumbai",
      beds: 3,
      baths: 2,
      sqft: 1450,
      type: "Apartment",
      imageIcon: "🏢",
      image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&q=80",
      isVerified: true,
      listingType: "SALE"
    },
    {
      id: 2,
      title: "Spacious 4BHK Villa",
      price: 85000,
      location: "Whitefield",
      city: "Bangalore",
      beds: 4,
      baths: 3,
      sqft: 2800,
      type: "Villa",
      imageIcon: "🏡",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
      isVerified: true,
      listingType: "RENT"
    },
    {
      id: 3,
      title: "Modern 2BHK Condo",
      price: 8500000,
      location: "ECR",
      city: "Chennai",
      beds: 2,
      baths: 2,
      sqft: 1100,
      type: "Condo",
      imageIcon: "🏢",
      image: "https://images.unsplash.com/photo-1580237072353-751a8a5b2598?w=600&q=80",
      isVerified: false,
      listingType: "SALE"
    },
    {
      id: 4,
      title: "Cozy 1BHK Studio",
      price: 25000,
      location: "Koramangala",
      city: "Bangalore",
      beds: 1,
      baths: 1,
      sqft: 650,
      type: "Studio",
      imageIcon: "🏠",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
      isVerified: true,
      listingType: "RENT"
    },
    {
      id: 5,
      title: "Premium 5BHK Penthouse",
      price: 25000000,
      location: "Juhu",
      city: "Mumbai",
      beds: 5,
      baths: 4,
      sqft: 3200,
      type: "Penthouse",
      imageIcon: "🌆",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
      isVerified: true,
      listingType: "SALE"
    },
    {
      id: 6,
      title: "Commercial Office Space",
      price: 120000,
      location: "MG Road",
      city: "Pune",
      beds: 0,
      baths: 2,
      sqft: 1500,
      type: "Commercial",
      imageIcon: "🏢",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80",
      isVerified: true,
      listingType: "RENT"
    },
    {
      id: 7,
      title: "Beachfront Villa",
      price: 45000000,
      location: "Goa",
      city: "Goa",
      beds: 5,
      baths: 5,
      sqft: 4500,
      type: "Villa",
      imageIcon: "🏖️",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
      isVerified: true,
      listingType: "SALE"
    },
    {
      id: 8,
      title: "City Center Loft",
      price: 55000,
      location: "Banjara Hills",
      city: "Hyderabad",
      beds: 2,
      baths: 2,
      sqft: 1350,
      type: "Loft",
      imageIcon: "🏙️",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
      isVerified: true,
      listingType: "RENT"
    }
  ];

  // Get unique cities for filter
  const cities = ['all', ...new Set(properties.map(p => p.city))];
  
  // Get unique property types
  const types = ['all', ...new Set(properties.map(p => p.type))];

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'all' || property.city === selectedCity;
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesBeds = minBeds === 0 || property.beds >= minBeds;
      const matchesType = propertyType === 'all' || property.type === propertyType;
      const matchesListing = listingType === 'all' || property.listingType === listingType;
      return matchesSearch && matchesCity && matchesPrice && matchesBeds && matchesType && matchesListing;
    });

    switch(sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
      case 'beds-desc': filtered.sort((a, b) => b.beds - a.beds); break;
      case 'sqft-desc': filtered.sort((a, b) => b.sqft - a.sqft); break;
    }
    return filtered;
  }, [properties, searchTerm, selectedCity, priceRange, minBeds, propertyType, sortBy, listingType]);

  const formatPrice = (price: number, listingType?: string) => {
    if (listingType === 'RENT') {
      if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L/mo`;
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setPriceRange([0, 50000000]);
    setMinBeds(0);
    setPropertyType('all');
    setSortBy('price-low');
    setListingType('all');
  };

  const toggleSave = (id: number) =>
    setSavedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <>
      {/* Mobile-Friendly Header */}
      <header className="site-header">
        <div className="header-container">
          <Link href="/" className="logo-link">
            <div className="logo-icon">
              <Building2 size={isMobile ? 18 : 22} strokeWidth={1.8} />
            </div>
            <div className="logo-text">
              <span className="logo-title">Redsand</span>
              <span className="logo-subtitle">Group</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-links desktop-nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/properties" className="nav-link active">Properties</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="auth-buttons desktop-nav">
            <Link href="/login" className="btn-outline">Log in</Link>
            <Link href="/post-property" className="btn-primary">List Property</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="mobile-nav-menu">
            <Link href="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              <Home size={18} /> Home
            </Link>
            <Link href="/properties" className="mobile-nav-link active" onClick={() => setMenuOpen(false)}>
              <Building2 size={18} /> Properties
            </Link>
            <Link href="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              <Users size={18} /> About Us
            </Link>
            <Link href="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              <Phone size={18} /> Contact
            </Link>
            <div className="mobile-nav-divider"></div>
            <Link href="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
            <Link href="/post-property" className="mobile-nav-link btn-primary-mobile" onClick={() => setMenuOpen(false)}>
              List Property
            </Link>
          </div>
        )}
      </header>

      <main className="main-content">
        {/* Mobile-friendly Hero */}
        <div className="properties-hero">
          <h1>Find Your Dream Property</h1>
          <p>Zero brokerage • Direct owner deals • Verified listings</p>
        </div>

        {/* Search and Filters Section */}
        <div className="filters-section">
          {/* Search Bar */}
          <div className="search-bar">
            <Search size={isMobile ? 18 : 20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by city, locality, or property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button 
            className="mobile-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={`toggle-icon ${showFilters ? 'rotate' : ''}`} />
            {(selectedCity !== 'all' || minBeds > 0 || listingType !== 'all' || propertyType !== 'all') && (
              <span className="filter-active-dot"></span>
            )}
          </button>

          {/* Filters Grid */}
          <div className={`filters-grid ${showFilters ? 'mobile-show' : ''}`}>
            <div className="filter-group">
              <label className="filter-label">🏷️ Listing Type</label>
              <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="filter-select">
                <option value="all">All</option>
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">📍 City</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="filter-select">
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city === 'all' ? 'All Cities' : city}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">💰 Max Price</label>
              <div className="price-range-container">
                <div className="price-inputs">
                  <span>₹0</span>
                  <span>-</span>
                  <span>₹{(priceRange[1] / 10000000).toFixed(1)}Cr</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="500000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="price-slider"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">🛏️ Bedrooms</label>
              <select value={minBeds} onChange={(e) => setMinBeds(Number(e.target.value))} className="filter-select">
                <option value={0}>Any</option>
                <option value={1}>1+ beds</option>
                <option value={2}>2+ beds</option>
                <option value={3}>3+ beds</option>
                <option value={4}>4+ beds</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">🏠 Property Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="filter-select">
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">📊 Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="beds-desc">Most Bedrooms</option>
                <option value="sqft-desc">Largest Area</option>
              </select>
            </div>
          </div>

          {/* Active Filters - Mobile Optimized */}
          {(searchTerm || selectedCity !== 'all' || priceRange[1] < 50000000 || minBeds > 0 || propertyType !== 'all' || listingType !== 'all') && (
            <div className="active-filters">
              <span className="active-filters-label">Active:</span>
              <div className="filter-tags-container">
                {searchTerm && (
                  <span className="filter-tag">
                    {searchTerm.length > 15 ? searchTerm.slice(0, 12) + '...' : searchTerm}
                    <button onClick={() => setSearchTerm('')} className="remove-tag">×</button>
                  </span>
                )}
                {listingType !== 'all' && (
                  <span className="filter-tag">
                    {listingType === 'SALE' ? 'Sale' : 'Rent'}
                    <button onClick={() => setListingType('all')} className="remove-tag">×</button>
                  </span>
                )}
                {selectedCity !== 'all' && (
                  <span className="filter-tag">
                    {selectedCity}
                    <button onClick={() => setSelectedCity('all')} className="remove-tag">×</button>
                  </span>
                )}
                {priceRange[1] < 50000000 && (
                  <span className="filter-tag">
                    ₹{(priceRange[1] / 10000000).toFixed(1)}Cr
                    <button onClick={() => setPriceRange([0, 50000000])} className="remove-tag">×</button>
                  </span>
                )}
                {minBeds > 0 && (
                  <span className="filter-tag">
                    {minBeds}+ Beds
                    <button onClick={() => setMinBeds(0)} className="remove-tag">×</button>
                  </span>
                )}
                {propertyType !== 'all' && (
                  <span className="filter-tag">
                    {propertyType}
                    <button onClick={() => setPropertyType('all')} className="remove-tag">×</button>
                  </span>
                )}
                <button onClick={resetFilters} className="reset-filters-btn">Reset</button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="results-count">
          {filteredProperties.length} property{filteredProperties.length !== 1 ? 's' : ''} found
        </div>

        {/* Properties Grid - Mobile Optimized */}
        {filteredProperties.length > 0 ? (
          <div className="property-grid">
            {filteredProperties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="card-image">
                  <img src={property.image} alt={property.title} loading="lazy" />
                  <div className={`listing-badge ${property.listingType === 'SALE' ? 'sale' : 'rent'}`}>
                    {property.listingType === 'SALE' ? 'Sale' : 'Rent'}
                  </div>
                  <button onClick={() => toggleSave(property.id)} className="save-button" aria-label="Save property">
                    <Heart size={16} className={savedIds.has(property.id) ? 'saved' : ''} />
                  </button>
                </div>
                <div className="card-content">
                  <div className="price">
                    <IndianRupee size={12} strokeWidth={2.5} />
                    {formatPrice(property.price, property.listingType)}
                  </div>
                  <h3 className="card-title">{property.title}</h3>
                  <div className="card-location">
                    <MapPin size={10} />
                    {property.location}, {property.city}
                  </div>
                  <div className="property-details">
                    <div className="detail">
                      <Bed size={10} />
                      <span>{property.beds}</span>
                    </div>
                    <div className="detail">
                      <Bath size={10} />
                      <span>{property.baths}</span>
                    </div>
                    <div className="detail">
                      <Square size={10} />
                      <span>{property.sqft} sq.ft</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    {property.isVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                    <Link href={`/property/${property.id}`} className="view-details-btn">
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No properties found</h3>
            <p>Try adjusting your filters</p>
            <button onClick={resetFilters} className="reset-btn">Clear filters</button>
          </div>
        )}

        <div className="back-link-container">
          <Link href="/" className="back-link">← Back to Home</Link>
        </div>
      </main>

      {/* Mobile-Friendly Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <Building2 size={18} />
              <span>Redsand Group</span>
            </div>
            <p>Zero brokerage, direct owner deals. India's most trusted real estate platform.</p>
          </div>
          <div className="footer-links">
            <Link href="/about">About</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <div className="copyright">© 2026 Redsand Group. All rights reserved.</div>
      </footer>

      <style jsx>{`
        /* Base Styles */
        * {
          box-sizing: border-box;
        }

        /* Header */
        .site-header {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid #eef2ff;
        }

        .header-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        @media (min-width: 768px) {
          .header-container {
            padding: 0.875rem 2rem;
          }
        }

        .logo-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        @media (min-width: 768px) {
          .logo-link {
            gap: 0.75rem;
          }
        }

        .logo-icon {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 8px -4px rgba(79, 70, 229, 0.3);
        }

        @media (min-width: 768px) {
          .logo-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-title {
          font-size: 1.1rem;
          font-weight: 800;
          background: linear-gradient(135deg, #1e293b, #4f46e5);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }

        @media (min-width: 768px) {
          .logo-title {
            font-size: 1.4rem;
          }
        }

        .logo-subtitle {
          font-size: 0.55rem;
          font-weight: 600;
          color: #64748b;
        }

        @media (min-width: 768px) {
          .logo-subtitle {
            font-size: 0.65rem;
          }
        }

        .desktop-nav {
          display: none;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }
        }

        .nav-links {
          gap: 1.5rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .nav-links {
            gap: 2rem;
          }
        }

        .nav-link {
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          color: #475569;
          transition: color 0.2s;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #4f46e5;
        }

        .auth-buttons {
          display: none;
          gap: 0.8rem;
        }

        @media (min-width: 768px) {
          .auth-buttons {
            display: flex;
          }
        }

        .btn-outline {
          background: transparent;
          border: 1.5px solid #cbd5e1;
          padding: 0.4rem 1rem;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.8rem;
          color: #1e293b;
          text-decoration: none;
          transition: all 0.2s;
        }

        @media (min-width: 768px) {
          .btn-outline {
            padding: 0.5rem 1.2rem;
            font-size: 0.85rem;
          }
        }

        .btn-outline:hover {
          border-color: #4f46e5;
          color: #4f46e5;
          background: #eef2ff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          padding: 0.4rem 1rem;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.8rem;
          color: white;
          text-decoration: none;
          transition: all 0.2s;
        }

        @media (min-width: 768px) {
          .btn-primary {
            padding: 0.5rem 1.3rem;
            font-size: 0.85rem;
          }
        }

        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: #1e293b;
        }

        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }

        .mobile-nav-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid #eef2ff;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          font-weight: 500;
          color: #475569;
          border-radius: 0.75rem;
          transition: background 0.2s;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: #eef2ff;
          color: #4f46e5;
        }

        .mobile-nav-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0.5rem 0;
        }

        .btn-primary-mobile {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          color: white !important;
        }

        /* Main Content */
        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem;
          min-height: calc(100vh - 350px);
        }

        @media (min-width: 768px) {
          .main-content {
            padding: 2rem 1.5rem;
          }
        }

        /* Hero Section */
        .properties-hero {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 1.5rem 1rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 1rem;
        }

        @media (min-width: 768px) {
          .properties-hero {
            margin-bottom: 2rem;
            padding: 2rem 1rem;
            border-radius: 1.5rem;
          }
        }

        .properties-hero h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .properties-hero h1 {
            font-size: 2rem;
          }
        }

        .properties-hero p {
          color: #64748b;
          font-size: 0.85rem;
        }

        @media (min-width: 768px) {
          .properties-hero p {
            font-size: 1rem;
          }
        }

        /* Filters Section */
        .filters-section {
          background: white;
          padding: 1rem;
          border-radius: 1rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #eef2ff;
        }

        @media (min-width: 768px) {
          .filters-section {
            padding: 1.5rem;
            margin-bottom: 2rem;
          }
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.75rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          transition: all 0.2s;
        }

        @media (min-width: 768px) {
          .search-bar {
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            margin-bottom: 1.5rem;
          }
        }

        .search-bar:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .search-icon {
          color: #94a3b8;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.9rem;
          background: transparent;
        }

        @media (min-width: 768px) {
          .search-input {
            font-size: 0.95rem;
          }
        }

        .mobile-filter-toggle {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.7rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          position: relative;
        }

        @media (min-width: 768px) {
          .mobile-filter-toggle {
            display: none;
          }
        }

        .filter-active-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 10px;
          height: 10px;
          background: #4f46e5;
          border-radius: 50%;
          border: 2px solid white;
        }

        .toggle-icon {
          transition: transform 0.2s;
        }

        .toggle-icon.rotate {
          transform: rotate(180deg);
        }

        .filters-grid {
          display: none;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .filters-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
          }
        }

        .filters-grid.mobile-show {
          display: grid;
          margin-top: 1rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        @media (min-width: 768px) {
          .filter-group {
            gap: 0.5rem;
          }
        }

        .filter-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.75rem;
        }

        @media (min-width: 768px) {
          .filter-label {
            font-size: 0.8rem;
          }
        }

        .filter-select {
          padding: 0.5rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 0.8rem;
          background: white;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .filter-select {
            padding: 0.6rem;
            font-size: 0.85rem;
          }
        }

        .price-range-container {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .price-inputs {
          display: flex;
          justify-content: space-between;
          font-size: 0.7rem;
          color: #475569;
        }

        @media (min-width: 768px) {
          .price-inputs {
            font-size: 0.8rem;
          }
        }

        .price-slider {
          width: 100%;
          cursor: pointer;
        }

        .active-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
        }

        @media (min-width: 768px) {
          .active-filters {
            align-items: center;
            padding-top: 1rem;
          }
        }

        .active-filters-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          .active-filters-label {
            font-size: 0.75rem;
          }
        }

        .filter-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.6rem;
          background: #eef2ff;
          color: #4f46e5;
          border-radius: 40px;
          font-size: 0.7rem;
        }

        @media (min-width: 768px) {
          .filter-tag {
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        .remove-tag {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #4f46e5;
          padding: 0;
          display: inline-flex;
          align-items: center;
        }

        .reset-filters-btn {
          padding: 0.2rem 0.6rem;
          background: #f1f5f9;
          border: none;
          border-radius: 40px;
          font-size: 0.7rem;
          cursor: pointer;
          color: #64748b;
        }

        @media (min-width: 768px) {
          .reset-filters-btn {
            padding: 0.25rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        .results-count {
          margin-bottom: 1rem;
          color: #64748b;
          font-weight: 500;
          font-size: 0.8rem;
        }

        @media (min-width: 768px) {
          .results-count {
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
          }
        }

        /* Property Grid */
        .property-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 480px) {
          .property-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          .property-grid {
            gap: 1.5rem;
          }
        }

        .property-card {
          background: white;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #eef2ff;
        }

        @media (min-width: 768px) {
          .property-card {
            border-radius: 1rem;
          }
        }

        .property-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 768px) {
          .property-card:hover {
            transform: translateY(-4px);
          }
        }

        .card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .card-image {
            height: 200px;
          }
        }

        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .property-card:hover .card-image img {
          transform: scale(1.05);
        }

        .listing-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: 40px;
          font-size: 0.65rem;
          font-weight: 600;
          color: white;
        }

        @media (min-width: 768px) {
          .listing-badge {
            top: 1rem;
            left: 1rem;
            padding: 0.25rem 0.75rem;
            font-size: 0.7rem;
          }
        }

        .listing-badge.sale {
          background: #10b981;
        }

        .listing-badge.rent {
          background: #3b82f6;
        }

        .save-button {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 28px;
          height: 28px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        @media (min-width: 768px) {
          .save-button {
            width: 32px;
            height: 32px;
            top: 1rem;
            right: 1rem;
          }
        }

        .save-button:hover {
          transform: scale(1.1);
        }

        .save-button .saved {
          fill: #ef4444;
          stroke: #ef4444;
        }

        .card-content {
          padding: 0.75rem;
        }

        @media (min-width: 768px) {
          .card-content {
            padding: 1rem;
          }
        }

        .price {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 1rem;
          font-weight: 800;
          color: #4f46e5;
          margin-bottom: 0.25rem;
        }

        @media (min-width: 768px) {
          .price {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
          }
        }

        .card-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        @media (min-width: 768px) {
          .card-title {
            font-size: 1rem;
          }
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.65rem;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .card-location {
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
          }
        }

        .property-details {
          display: flex;
          gap: 0.75rem;
          padding: 0.5rem 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .property-details {
            gap: 1rem;
            padding: 0.75rem 0;
            margin-bottom: 0.75rem;
          }
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          color: #475569;
        }

        @media (min-width: 768px) {
          .detail {
            font-size: 0.75rem;
          }
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .verified-badge {
          font-size: 0.6rem;
          color: #10b981;
          background: #d1fae5;
          padding: 0.2rem 0.4rem;
          border-radius: 40px;
        }

        @media (min-width: 768px) {
          .verified-badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
          }
        }

        .view-details-btn {
          padding: 0.4rem 0.8rem;
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          color: white;
          text-decoration: none;
          border-radius: 0.5rem;
          font-size: 0.65rem;
          font-weight: 600;
          transition: opacity 0.2s;
        }

        @media (min-width: 768px) {
          .view-details-btn {
            padding: 0.5rem 1rem;
            font-size: 0.75rem;
          }
        }

        .no-results {
          text-align: center;
          padding: 2rem 1rem;
          background: white;
          border-radius: 1rem;
          border: 1px solid #eef2ff;
        }

        @media (min-width: 768px) {
          .no-results {
            padding: 4rem 2rem;
          }
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .no-results-icon {
            font-size: 4rem;
          }
        }

        .no-results h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: #0f172a;
        }

        @media (min-width: 768px) {
          .no-results h3 {
            font-size: 1.5rem;
          }
        }

        .no-results p {
          color: #64748b;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .reset-btn {
          padding: 0.5rem 1.2rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .back-link-container {
          margin-top: 1.5rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .back-link-container {
            margin-top: 2rem;
          }
        }

        .back-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.85rem;
        }

        /* Footer */
        .site-footer {
          background: #0f172a;
          color: #e2e8f0;
          margin-top: 2rem;
          padding: 1.5rem 1rem 1rem;
        }

        @media (min-width: 768px) {
          .site-footer {
            margin-top: 3rem;
            padding: 2rem 1.5rem 1.5rem;
          }
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .footer-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1.5rem;
          }
        }

        .footer-brand {
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-brand {
            text-align: left;
            flex: 1;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .footer-logo {
            justify-content: flex-start;
          }
        }

        .footer-logo span {
          font-weight: 700;
          font-size: 0.9rem;
          color: white;
        }

        .footer-brand p {
          font-size: 0.7rem;
          color: #94a3b8;
          max-width: 280px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .footer-brand p {
            margin: 0;
          }
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .footer-links {
            gap: 1.5rem;
          }
        }

        .footer-links a {
          color: #cbd5e1;
          text-decoration: none;
          font-size: 0.7rem;
          transition: color 0.2s;
        }

        @media (min-width: 768px) {
          .footer-links a {
            font-size: 0.8rem;
          }
        }

        .copyright {
          text-align: center;
          padding-top: 1rem;
          margin-top: 1rem;
          font-size: 0.6rem;
          color: #64748b;
          border-top: 1px solid #1e293b;
        }

        @media (min-width: 768px) {
          .copyright {
            padding-top: 1.5rem;
            margin-top: 1.5rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </>
  );
}