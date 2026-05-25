'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Home, Users, Phone, Mail, Lock, User, 
  MapPin, Bed, Bath, Square, IndianRupee, Upload, 
  X, CheckCircle, AlertCircle, Edit2, Trash2,
  Loader2, Camera
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType: 'SALE' | 'RENT';
  description: string;
  images: { url: string; isPrimary: boolean }[];
  viewCount: number;
  createdAt: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [properties, setProperties] = useState<Property[]>([]);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Buyer Registration State
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false
  });
  
  // Seller Listing State
  const [sellerListing, setSellerListing] = useState({
    title: '',
    price: '',
    location: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'Apartment',
    listingType: 'SALE' as 'SALE' | 'RENT',
    description: '',
    images: [] as File[]
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setCurrentUserId(user.id);
          fetchUserProperties(user.id);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);

  // Fetch user's properties
  const fetchUserProperties = async (userId: string) => {
    try {
      const response = await fetch(`/api/properties/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const validateBuyerForm = () => {
    const newErrors: Record<string, string> = {};
    if (!buyerForm.name.trim()) newErrors.name = 'Full name is required';
    if (!buyerForm.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(buyerForm.email)) newErrors.email = 'Valid email required';
    if (!buyerForm.password) newErrors.password = 'Password is required';
    else if (buyerForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (buyerForm.password !== buyerForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!buyerForm.agreeToTerms) newErrors.agreeToTerms = 'You must agree to terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSellerListing = () => {
    const newErrors: Record<string, string> = {};
    if (!sellerListing.title.trim()) newErrors.title = 'Property title is required';
    if (!sellerListing.price) newErrors.price = 'Price is required';
    else if (isNaN(Number(sellerListing.price))) newErrors.price = 'Valid price required';
    if (!sellerListing.location.trim()) newErrors.location = 'Location is required';
    if (!sellerListing.city.trim()) newErrors.city = 'City is required';
    if (!sellerListing.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
    if (!sellerListing.bathrooms) newErrors.bathrooms = 'Number of bathrooms is required';
    if (!sellerListing.area) newErrors.area = 'Area is required';
    if (!sellerListing.description.trim()) newErrors.description = 'Description is required';
    if (!currentUserId && !editingProperty) newErrors.auth = 'Please login to list a property';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBuyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateBuyerForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: buyerForm.name,
          email: buyerForm.email,
          password: buyerForm.password,
          phone: buyerForm.phone,
          role: 'USER'
        })
      });
      
      if (response.ok) {
        setSuccessMessage('Account created successfully! Please login to continue.');
        setTimeout(() => setSuccessMessage(''), 5000);
        setBuyerForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          agreeToTerms: false
        });
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setUploadingImage(true);
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          uploadedUrls.push(data.imageUrl);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    
    setUploadingImage(false);
    return uploadedUrls;
  };

  const handleSellerListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSellerListing()) return;

    setIsLoading(true);
    try {
      // Upload images first if any
      let imageUrls: string[] = [];
      if (sellerListing.images.length > 0) {
        imageUrls = await uploadImages(sellerListing.images);
      }

      const propertyData = {
        title: sellerListing.title,
        price: parseFloat(sellerListing.price),
        location: sellerListing.location,
        city: sellerListing.city,
        bedrooms: parseInt(sellerListing.bedrooms) || 0,
        bathrooms: parseInt(sellerListing.bathrooms) || 0,
        area: parseFloat(sellerListing.area) || 0,
        propertyType: sellerListing.propertyType,
        listingType: sellerListing.listingType,
        description: sellerListing.description,
        images: imageUrls.map((url, index) => ({
          url,
          isPrimary: index === 0
        }))
      };

      const url = editingProperty 
        ? `/api/properties/${editingProperty.id}`
        : '/api/properties';
      
      const response = await fetch(url, {
        method: editingProperty ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData)
      });
      
      if (response.ok) {
        setSuccessMessage(editingProperty ? 'Property updated successfully!' : 'Property listed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        resetSellerForm();
        if (currentUserId) {
          fetchUserProperties(currentUserId);
        }
      } else {
        const error = await response.json();
        setErrors({ submit: error.message || 'Operation failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Operation failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSellerForm = () => {
    setSellerListing({
      title: '',
      price: '',
      location: '',
      city: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      propertyType: 'Apartment',
      listingType: 'SALE',
      description: '',
      images: []
    });
    setPreviewImages([]);
    setEditingProperty(null);
    setErrors({});
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setSellerListing({
      title: property.title,
      price: property.price.toString(),
      location: property.location,
      city: property.city,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      propertyType: property.propertyType,
      listingType: property.listingType,
      description: property.description,
      images: []
    });
    setPreviewImages(property.images.map(img => img.url));
    setActiveTab('seller');
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await fetch(`/api/properties/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSuccessMessage('Property deleted successfully!');
          setTimeout(() => setSuccessMessage(''), 3000);
          if (currentUserId) {
            fetchUserProperties(currentUserId);
          }
        } else {
          setErrors({ submit: 'Failed to delete property' });
        }
      } catch (error) {
        console.error('Error deleting property:', error);
        setErrors({ submit: 'Failed to delete property' });
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSellerListing({ ...sellerListing, images: [...sellerListing.images, ...files] });
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSellerListing({
      ...sellerListing,
      images: sellerListing.images.filter((_, i) => i !== index)
    });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const formatPrice = (price: number, listingType?: string) => {
    if (listingType === 'RENT') {
      if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L/mo`;
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(0)}L`;
    return `₹${(price / 1000).toFixed(0)}K`;
  };

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Penthouse', 'Condo', 'Studio', 'Commercial', 'Land'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  return (
    <>
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

          <nav className="nav-links desktop-nav">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/properties" className="nav-link">Properties</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="auth-buttons desktop-nav">
            {currentUserId ? (
              <button onClick={() => router.push('/dashboard')} className="btn-outline">Dashboard</button>
            ) : (
              <>
                <Link href="/login" className="btn-outline">Log in</Link>
                <Link href="/register" className="btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-nav-menu">
            <Link href="/" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/properties" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Properties</Link>
            <Link href="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Link href="/contact" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>
            <div className="mobile-nav-divider"></div>
            {currentUserId ? (
              <Link href="/dashboard" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Log in</Link>
                <Link href="/register" className="mobile-nav-link btn-primary-mobile" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="register-container">
          <div className="register-hero">
            <h1>Join the Redsand Community</h1>
            <p>Buy your dream home or sell your property with zero brokerage</p>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'buyer' ? 'active' : ''}`}
              onClick={() => setActiveTab('buyer')}
            >
              🏠 Buyer Registration
            </button>
            <button 
              className={`tab ${activeTab === 'seller' ? 'active' : ''}`}
              onClick={() => { 
                if (!currentUserId) {
                  setErrors({ auth: 'Please login to list a property' });
                  setTimeout(() => setErrors({}), 3000);
                  return;
                }
                setActiveTab('seller'); 
                resetSellerForm(); 
              }}
            >
              📝 Sell Property
            </button>
          </div>

          {successMessage && (
            <div className="success-message">
              <CheckCircle size={18} />
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          {errors.auth && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.auth}
            </div>
          )}

          {/* Buyer Registration Tab */}
          {activeTab === 'buyer' && (
            <div className="register-card">
              <div className="register-header">
                <div className="register-badge">
                  <span className="badge-dot"></span>
                  Join Redsand Group
                </div>
                <h1 className="register-title">Create a Buyer Account</h1>
                <p className="register-subtitle">Start your real estate journey with us today</p>
              </div>

              <form onSubmit={handleBuyerSubmit} className="register-form">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      name="name"
                      type="text"
                      value={buyerForm.name}
                      onChange={(e) => setBuyerForm({...buyerForm, name: e.target.value})}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <Mail size={18} className="input-icon" />
                      <input
                        name="email"
                        type="email"
                        value={buyerForm.email}
                        onChange={(e) => setBuyerForm({...buyerForm, email: e.target.value})}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className="input-wrapper">
                      <Phone size={18} className="input-icon" />
                      <input
                        name="phone"
                        type="tel"
                        value={buyerForm.phone}
                        onChange={(e) => setBuyerForm({...buyerForm, phone: e.target.value})}
                        className="form-input"
                        placeholder="+91 98765 43210"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={buyerForm.password}
                        onChange={(e) => setBuyerForm({...buyerForm, password: e.target.value})}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        placeholder="Create a password"
                        disabled={isLoading}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                        {showPassword ? <X size={16} /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                      </button>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <div className="input-wrapper">
                      <Lock size={18} className="input-icon" />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={buyerForm.confirmPassword}
                        onChange={(e) => setBuyerForm({...buyerForm, confirmPassword: e.target.value})}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                        {showConfirmPassword ? <X size={16} /> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" name="agreeToTerms" checked={buyerForm.agreeToTerms} onChange={(e) => setBuyerForm({...buyerForm, agreeToTerms: e.target.checked})} />
                    <span>I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link> <span className="required">*</span></span>
                  </label>
                  {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
                </div>

                <button type="submit" className="submit-button" disabled={isLoading}>
                  {isLoading ? <><Loader2 size={18} className="spinner" />Creating account...</> : 'Create free account →'}
                </button>
              </form>

              <p className="login-prompt">
                Already have an account? <Link href="/login" className="login-link">Sign in</Link>
              </p>
            </div>
          )}

          {/* Seller Listing Tab */}
          {activeTab === 'seller' && (
            <>
              <div className="register-card">
                <div className="register-header">
                  <div className="register-badge">
                    <span className="badge-dot"></span>
                    {editingProperty ? 'Edit Property' : 'List New Property'}
                  </div>
                  <h1 className="register-title">{editingProperty ? 'Update Listing' : 'Sell Your Property'}</h1>
                  <p className="register-subtitle">Reach thousands of potential buyers directly with zero commission</p>
                </div>

                <form onSubmit={handleSellerListingSubmit} className="register-form">
                  <div className="form-group">
                    <label className="form-label">Property Title <span className="required">*</span></label>
                    <input name="title" value={sellerListing.title} onChange={(e) => setSellerListing({...sellerListing, title: e.target.value})} className="form-input" placeholder="e.g., Luxury 3BHK Apartment in Andheri West" />
                    {errors.title && <span className="error-text">{errors.title}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <IndianRupee size={16} className="input-icon" />
                        <input name="price" type="number" value={sellerListing.price} onChange={(e) => setSellerListing({...sellerListing, price: e.target.value})} className="form-input" placeholder="e.g., 12500000" />
                      </div>
                      {errors.price && <span className="error-text">{errors.price}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Listing Type <span className="required">*</span></label>
                      <select name="listingType" value={sellerListing.listingType} onChange={(e) => setSellerListing({...sellerListing, listingType: e.target.value as 'SALE' | 'RENT'})} className="form-select">
                        <option value="SALE">For Sale</option>
                        <option value="RENT">For Rent</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Property Type <span className="required">*</span></label>
                      <select name="propertyType" value={sellerListing.propertyType} onChange={(e) => setSellerListing({...sellerListing, propertyType: e.target.value})} className="form-select">
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Location <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <MapPin size={16} className="input-icon" />
                        <input name="location" value={sellerListing.location} onChange={(e) => setSellerListing({...sellerListing, location: e.target.value})} className="form-input" placeholder="e.g., Andheri West" />
                      </div>
                      {errors.location && <span className="error-text">{errors.location}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">City <span className="required">*</span></label>
                      <select name="city" value={sellerListing.city} onChange={(e) => setSellerListing({...sellerListing, city: e.target.value})} className="form-select">
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Bedrooms <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <Bed size={16} className="input-icon" />
                        <input name="bedrooms" type="number" value={sellerListing.bedrooms} onChange={(e) => setSellerListing({...sellerListing, bedrooms: e.target.value})} className="form-input" placeholder="3" />
                      </div>
                      {errors.bedrooms && <span className="error-text">{errors.bedrooms}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bathrooms <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <Bath size={16} className="input-icon" />
                        <input name="bathrooms" type="number" value={sellerListing.bathrooms} onChange={(e) => setSellerListing({...sellerListing, bathrooms: e.target.value})} className="form-input" placeholder="2" />
                      </div>
                      {errors.bathrooms && <span className="error-text">{errors.bathrooms}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Area (sq.ft) <span className="required">*</span></label>
                      <div className="input-wrapper">
                        <Square size={16} className="input-icon" />
                        <input name="area" type="number" value={sellerListing.area} onChange={(e) => setSellerListing({...sellerListing, area: e.target.value})} className="form-input" placeholder="1450" />
                      </div>
                      {errors.area && <span className="error-text">{errors.area}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description <span className="required">*</span></label>
                    <textarea name="description" rows={4} value={sellerListing.description} onChange={(e) => setSellerListing({...sellerListing, description: e.target.value})} className="form-textarea" placeholder="Describe your property - highlight key features, nearby amenities, schools, hospitals, etc." />
                    {errors.description && <span className="error-text">{errors.description}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Property Images</label>
                    <div className="file-upload-area">
                      <input type="file" accept="image/*" multiple onChange={handleImageSelect} id="imageUpload" className="file-input" disabled={uploadingImage} />
                      <label htmlFor="imageUpload" className="upload-label">
                        {uploadingImage ? <Loader2 size={20} className="spinner" /> : <Camera size={20} />}
                        <span>{uploadingImage ? 'Uploading...' : 'Click to upload images (max 10)'}</span>
                      </label>
                    </div>
                    
                    {previewImages.length > 0 && (
                      <div className="image-preview-grid">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button type="button" onClick={() => removeImage(index)} className="remove-image">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading || uploadingImage}>
                      {isLoading ? <><Loader2 size={18} className="spinner" />Processing...</> : (editingProperty ? 'Update Listing →' : 'List Property →')}
                    </button>
                    {editingProperty && (
                      <button type="button" onClick={resetSellerForm} className="cancel-button">
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* My Listings Section */}
              {properties.length > 0 && (
                <div className="my-listings">
                  <h2>My Property Listings</h2>
                  <p>Manage your properties - Edit or Delete listings</p>
                  
                  <div className="listings-grid">
                    {properties.map(property => (
                      <div key={property.id} className="listing-card">
                        <div className="listing-image">
                          {property.images && property.images[0] ? (
                            <img src={property.images[0].url} alt={property.title} />
                          ) : (
                            <span className="image-placeholder">🏠</span>
                          )}
                        </div>
                        <div className="listing-info">
                          <h3>{property.title}</h3>
                          <div className="listing-price">{formatPrice(property.price, property.listingType)}</div>
                          <div className="listing-location">
                            <MapPin size={12} />
                            {property.location}, {property.city}
                          </div>
                          <div className="listing-details">
                            <Bed size={10} /> {property.bedrooms} beds • <Bath size={10} /> {property.bathrooms} baths • <Square size={10} /> {property.area} sq.ft
                          </div>
                          <div className="listing-stats">
                            👁️ {property.viewCount} views
                          </div>
                          <div className="listing-actions">
                            <button onClick={() => handleEditProperty(property)} className="edit-btn">
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => handleDeleteProperty(property.id)} className="delete-btn">
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

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
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
        <div className="copyright">© 2026 Redsand Group. All rights reserved.</div>
      </footer>

      <style jsx>{`
        /* Header Styles */
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

        .logo-icon {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
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
          font-size: 1rem;
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
          font-size: 0.5rem;
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

        .nav-link {
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          color: #475569;
          transition: color 0.2s;
        }

        .nav-link:hover {
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
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          padding: 0.4rem 1rem;
          border-radius: 40px;
          font-weight: 600;
          font-size: 0.8rem;
          color: white;
          text-decoration: none;
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
        }

        .mobile-nav-link {
          display: block;
          padding: 0.75rem 1rem;
          text-decoration: none;
          font-weight: 500;
          color: #475569;
          border-radius: 0.75rem;
        }

        .mobile-nav-link:hover {
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

        .register-hero {
          text-align: center;
          margin-bottom: 1.5rem;
          padding: 1.5rem 1rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 1rem;
        }

        @media (min-width: 768px) {
          .register-hero {
            margin-bottom: 2rem;
            padding: 2rem 1rem;
            border-radius: 1.5rem;
          }
        }

        .register-hero h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 768px) {
          .register-hero h1 {
            font-size: 2rem;
          }
        }

        .register-hero p {
          color: #64748b;
          font-size: 0.85rem;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        @media (min-width: 768px) {
          .tabs {
            gap: 1rem;
            margin-bottom: 2rem;
          }
        }

        .tab {
          flex: 1;
          padding: 0.6rem 1rem;
          background: none;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        @media (min-width: 768px) {
          .tab {
            flex: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }

        .tab.active {
          color: #4f46e5;
          border-bottom: 2px solid #4f46e5;
          margin-bottom: -2px;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #d1fae5;
          color: #065f46;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
        }

        .register-card {
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
          border: 1px solid #eef2ff;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .register-card {
            border-radius: 1.5rem;
            padding: 2rem;
            margin-bottom: 2rem;
          }
        }

        .register-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .register-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 1rem;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 0.75rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #4f46e5;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .register-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }

        @media (min-width: 768px) {
          .register-title {
            font-size: 1.8rem;
          }
        }

        .register-subtitle {
          color: #64748b;
          font-size: 0.8rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.8rem;
        }

        .required {
          color: #ef4444;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          color: #94a3b8;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.6rem 0.75rem 0.6rem 2.25rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.6rem;
          font-size: 0.85rem;
          transition: all 0.2s;
          font-family: inherit;
        }

        @media (min-width: 768px) {
          .form-input, .form-select, .form-textarea {
            padding: 0.75rem 1rem 0.75rem 2.5rem;
            font-size: 0.9rem;
          }
        }

        .form-textarea {
          padding-left: 0.75rem;
          resize: vertical;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          display: flex;
          align-items: center;
        }

        .error-text {
          color: #ef4444;
          font-size: 0.7rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: #475569;
        }

        .file-upload-area {
          border: 2px dashed #e2e8f0;
          border-radius: 0.75rem;
          padding: 1rem;
          text-align: center;
        }

        .file-input {
          display: none;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          color: #64748b;
          font-size: 0.8rem;
        }

        .image-preview-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .image-preview-item {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .image-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        .remove-image {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .submit-button {
          flex: 1;
          background: linear-gradient(135deg, #4f46e5, #2563eb);
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-button {
          flex: 1;
          background: #f1f5f9;
          color: #475569;
          padding: 0.75rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .login-prompt {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #64748b;
        }

        .login-link {
          color: #4f46e5;
          text-decoration: none;
          font-weight: 600;
        }

        /* My Listings */
        .my-listings {
          background: white;
          border-radius: 1rem;
          padding: 1.25rem;
          border: 1px solid #eef2ff;
        }

        @media (min-width: 768px) {
          .my-listings {
            border-radius: 1.5rem;
            padding: 2rem;
          }
        }

        .my-listings h2 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .my-listings p {
          color: #64748b;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        .listings-grid {
          display: grid;
          gap: 1rem;
        }

        .listing-card {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }

        .listing-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .listing-image {
          width: 70px;
          height: 70px;
          background: #f1f5f9;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          font-size: 2rem;
        }

        .listing-info {
          flex: 1;
        }

        .listing-info h3 {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .listing-price {
          font-size: 1rem;
          font-weight: 700;
          color: #4f46e5;
        }

        .listing-location {
          font-size: 0.7rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .listing-details {
          font-size: 0.7rem;
          color: #475569;
          margin: 0.25rem 0;
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .listing-stats {
          font-size: 0.65rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        .listing-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .edit-btn, .delete-btn {
          padding: 0.2rem 0.6rem;
          border: none;
          border-radius: 0.4rem;
          cursor: pointer;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .edit-btn {
          background: #10b981;
          color: white;
        }

        .delete-btn {
          background: #ef4444;
          color: white;
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
          text-align: center;
        }

        @media (min-width: 768px) {
          .footer-container {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text-align: left;
            gap: 1.5rem;
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
          color: white;
        }

        .footer-brand p {
          font-size: 0.7rem;
          color: #94a3b8;
          max-width: 300px;
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
        }

        .copyright {
          text-align: center;
          padding-top: 1rem;
          margin-top: 1rem;
          font-size: 0.6rem;
          color: #64748b;
          border-top: 1px solid #1e293b;
        }
      `}</style>
    </>
  );
}