import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Service, Booking } from '../types';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('services');
  const [showAddService, setShowAddService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    category: 'plumbing',
    description: '',
    price_pkr: '',
  });

  const categories = ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'hvac', 'masonry', 'welding'];

  useEffect(() => {
    if (user) {
      fetchServices();
      fetchBookings();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user?.id);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('provider_id', user?.id);

      if (error) throw error;
      setBookings(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('services').insert({
        provider_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price_pkr: parseFloat(formData.price_pkr),
        availability: true,
      });

      if (error) throw error;

      setFormData({ title: '', category: 'plumbing', description: '', price_pkr: '' });
      setShowAddService(false);
      fetchServices();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your services and bookings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'services'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Services
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'bookings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bookings
          </button>
        </div>

        {activeTab === 'services' && (
          <div>
            <button
              onClick={() => setShowAddService(!showAddService)}
              className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </button>

            {showAddService && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Service</h3>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Service Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Bathroom Plumbing"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Price (PKR)</label>
                      <input
                        type="number"
                        value={formData.price_pkr}
                        onChange={(e) => setFormData({ ...formData, price_pkr: e.target.value })}
                        placeholder="5000"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        step="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your service..."
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition"
                    >
                      Add Service
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2.5 px-6 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {services.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No services yet. Add your first service!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div key={service.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-500">{service.category}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {service.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                    )}

                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      {service.price_pkr.toLocaleString()} PKR
                    </p>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${service.availability ? 'text-green-600' : 'text-red-600'}`}>
                        {service.availability ? 'Available' : 'Unavailable'}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <p className="text-gray-600">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(booking.status)}
                          <span className="font-semibold text-gray-900 capitalize">{booking.status}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          Booking Date: {new Date(booking.booking_date).toLocaleDateString('en-PK')}
                        </p>
                        {booking.notes && <p className="text-gray-600 text-sm">Notes: {booking.notes}</p>}
                      </div>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {booking.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
