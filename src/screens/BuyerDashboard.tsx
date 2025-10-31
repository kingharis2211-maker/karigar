import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Briefcase } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Service, UserProfile } from '../types';

interface ServiceWithProvider extends Service {
  provider?: UserProfile;
}

export default function BuyerDashboard() {
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'hvac', 'masonry', 'welding'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, user_profiles(full_name, rating, avatar_url)')
        .eq('availability', true);

      if (error) throw error;

      const servicesWithProvider = data?.map((service) => ({
        ...service,
        provider: service.user_profiles,
      })) || [];

      setServices(servicesWithProvider);
      setFilteredServices(servicesWithProvider);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((service) => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [searchTerm, selectedCategory, services]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Services</h1>
          <p className="text-gray-600">Browse and book local service providers</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                  </div>

                  {service.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                  )}

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-600">
                      {service.price_pkr.toLocaleString()} PKR
                    </p>
                  </div>

                  {service.provider && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{service.provider.full_name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">
                              {service.provider.rating?.toFixed(1) || 0} rating
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
