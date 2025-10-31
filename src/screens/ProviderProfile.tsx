import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Phone, Mail, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { UserProfile, Service } from '../types';

interface ProviderProfileProps {
  providerId: string;
  onBack: () => void;
}

export default function ProviderProfile({ providerId, onBack }: ProviderProfileProps) {
  const [provider, setProvider] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderDetails();
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      const { data: providerData, error: providerError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', providerId)
        .maybeSingle();

      if (providerError) throw providerError;
      setProvider(providerData);

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', providerId)
        .eq('availability', true);

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching provider details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading provider details...</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Provider not found</p>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Services</span>
          </button>

          <div className="flex items-start gap-6">
            {provider.avatar_url ? (
              <img
                src={provider.avatar_url}
                alt={provider.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-3xl shadow-lg">
                {provider.full_name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{provider.full_name}</h1>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold">{provider.rating?.toFixed(1) || '0.0'}</span>
                <span className="text-blue-100 ml-2">Average Rating</span>
              </div>
              {provider.bio && (
                <p className="text-blue-100 text-lg max-w-2xl">{provider.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Available Services
              </h2>

              {services.length === 0 ? (
                <p className="text-gray-600">No services available</p>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">{service.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {service.price_pkr.toLocaleString()} PKR
                          </p>
                        </div>
                      </div>

                      {service.description && (
                        <p className="text-gray-600 mb-4">{service.description}</p>
                      )}

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Book This Service
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="space-y-4">
                {provider.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-gray-900 break-all">{provider.email}</p>
                    </div>
                  </div>
                )}

                {provider.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="text-gray-900">{provider.phone}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Call Provider
                  </button>
                </div>

                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
