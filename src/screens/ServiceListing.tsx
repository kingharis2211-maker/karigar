import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Wrench, Zap, Hammer, Paintbrush } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';

interface ServiceListingProps {
  onProviderSelect: (providerId: string) => void;
}

const categoryIcons = {
  plumbing: Wrench,
  electrical: Zap,
  carpentry: Hammer,
  painting: Paintbrush,
};

const categoryColors = {
  plumbing: 'bg-blue-500',
  electrical: 'bg-yellow-500',
  carpentry: 'bg-green-500',
  painting: 'bg-red-500',
};

const categoryLabels = {
  plumbing: 'Plumber',
  electrical: 'Electrician',
  carpentry: 'Carpenter',
  painting: 'Painter',
};

interface ProviderWithService extends UserProfile {
  serviceTitle?: string;
  baseRate?: number;
}

export default function ServiceListing({ onProviderSelect }: ServiceListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('plumbing');
  const [providers, setProviders] = useState<ProviderWithService[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['plumbing', 'electrical', 'carpentry', 'painting'];

  useEffect(() => {
    fetchProvidersByCategory(selectedCategory);
  }, [selectedCategory]);

  const fetchProvidersByCategory = async (category: string) => {
    setLoading(true);
    try {
      const { data: services, error } = await supabase
        .from('services')
        .select('provider_id, title, price_pkr, user_profiles(*)')
        .eq('category', category)
        .eq('availability', true);

      if (error) throw error;

      const uniqueProviders = new Map<string, ProviderWithService>();

      services?.forEach((service: any) => {
        if (service.user_profiles && !uniqueProviders.has(service.provider_id)) {
          uniqueProviders.set(service.provider_id, {
            ...service.user_profiles,
            serviceTitle: service.title,
            baseRate: service.price_pkr,
          });
        }
      });

      setProviders(Array.from(uniqueProviders.values()));
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons];
    return Icon ? <Icon className="w-6 h-6" /> : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">Find Local Services</h1>
          <p className="text-blue-100">Connect with skilled professionals in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const colorClass = categoryColors[category as keyof typeof categoryColors];
            const label = categoryLabels[category as keyof typeof categoryLabels];
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-6 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-white shadow-lg scale-105 ring-2 ring-blue-500'
                    : 'bg-white shadow hover:shadow-md'
                }`}
              >
                <div
                  className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-3 mx-auto`}
                >
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                <p className="font-semibold text-gray-900 text-center">{label}</p>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading providers...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">No providers found in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                onClick={() => onProviderSelect(provider.id)}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {provider.avatar_url ? (
                        <img
                          src={provider.avatar_url}
                          alt={provider.full_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                          {provider.full_name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {provider.full_name}
                          </h3>
                          {provider.serviceTitle && (
                            <p className="text-gray-600 text-sm mb-2">{provider.serviceTitle}</p>
                          )}
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {provider.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">rating</span>
                      </div>

                      {provider.bio && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{provider.bio}</p>
                      )}

                      {provider.baseRate && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm text-gray-600">Starting from</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {provider.baseRate.toLocaleString()} PKR
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
