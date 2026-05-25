import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { usePropertyStore } from '@/store/propertyStore';
import { formatPrice } from '@/utils/format';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, variant = 'grid' }) => {
  const { user } = useAuthStore();
  const { toggleFavorite, favorites } = usePropertyStore();
  const isFavorite = favorites.some(fav => fav.id === property.id);
  
  const primaryImage = property.images.find(img => img.isPrimary) || property.images[0];

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login
      return;
    }
    toggleFavorite(property.id);
  };

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
      >
        <Link href={`/property/${property.id}`} className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-72">
            <Image
              src={primaryImage?.url || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
            <button
              onClick={handleFavorite}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}, {property.city}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">{formatPrice(property.price)}</p>
                <p className="text-sm text-gray-500">
                  {property.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-3 pt-3 border-t">
              <div className="flex items-center text-gray-600">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.areaSqft || 0} sq.ft</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/property/${property.id}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={primaryImage?.url || '/placeholder-property.jpg'}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 z-10">
            <Button
              className="bg-white/90 hover:bg-white !p-2 rounded-full"  // Added !p-2 for padding, rounded-full for circular
              onClick={handleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
          </div>
          {property.listingType === 'RENT' && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              For Rent
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary-600">{formatPrice(property.price)}</p>
              <p className="text-xs text-gray-500">Total Price</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <div className="flex items-center text-gray-600">
              <Bed className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Bath className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.areaSqft || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};