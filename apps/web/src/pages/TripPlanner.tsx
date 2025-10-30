import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Plane, Hotel, DollarSign, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Trip {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'PLANNED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED';
  estimatedCost: number;
  transportMode: string;
  accommodation: string;
}

export default function TripPlanner() {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1,
      destination: 'Jakarta',
      startDate: '2024-12-15',
      endDate: '2024-12-18',
      purpose: 'Client Meeting',
      status: 'APPROVED',
      estimatedCost: 5000000,
      transportMode: 'Flight',
      accommodation: 'Hotel Santika'
    },
    {
      id: 2,
      destination: 'Surabaya',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      purpose: 'Conference',
      status: 'PLANNED',
      estimatedCost: 3500000,
      transportMode: 'Flight',
      accommodation: 'Hotel Majapahit'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newTrip, setNewTrip] = useState<Partial<Trip>>({
    destination: '',
    startDate: '',
    endDate: '',
    purpose: '',
    estimatedCost: 0,
    transportMode: 'Flight',
    accommodation: '',
    status: 'PLANNED'
  });

  const handleCreateTrip = () => {
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const trip: Trip = {
      id: trips.length + 1,
      destination: newTrip.destination!,
      startDate: newTrip.startDate!,
      endDate: newTrip.endDate!,
      purpose: newTrip.purpose || '',
      status: 'PLANNED',
      estimatedCost: newTrip.estimatedCost || 0,
      transportMode: newTrip.transportMode || 'Flight',
      accommodation: newTrip.accommodation || ''
    };

    setTrips([...trips, trip]);
    setShowModal(false);
    setNewTrip({
      destination: '',
      startDate: '',
      endDate: '',
      purpose: '',
      estimatedCost: 0,
      transportMode: 'Flight',
      accommodation: '',
      status: 'PLANNED'
    });
    toast.success('Trip planned successfully!');
  };

  const handleDeleteTrip = (id: number) => {
    setTrips(trips.filter(t => t.id !== id));
    toast.success('Trip deleted');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PLANNED: 'bg-gray-100 text-gray-800',
      APPROVED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Trip Planner</h1>
          <p className="text-gray-600 mt-1">Plan business trips and track expenses automatically</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus size={20} className="mr-2" />
          Plan New Trip
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Trips</p>
              <p className="text-2xl font-bold mt-2">{trips.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Plane size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Planned</p>
              <p className="text-2xl font-bold mt-2">
                {trips.filter(t => t.status === 'PLANNED').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Calendar size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold mt-2">
                {trips.filter(t => t.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <MapPin size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Budget</p>
              <p className="text-2xl font-bold mt-2">
                Rp {trips.reduce((sum, t) => sum + t.estimatedCost, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <DollarSign size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={20} className="text-indigo-600" />
                  <h3 className="text-xl font-semibold">{trip.destination}</h3>
                </div>
                <p className="text-gray-600 text-sm">{trip.purpose}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit size={18} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(trip.startDate).toLocaleDateString('id-ID')} - {new Date(trip.endDate).toLocaleDateString('id-ID')}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Plane size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700">{trip.transportMode}</span>
              </div>

              {trip.accommodation && (
                <div className="flex items-center text-sm">
                  <Hotel size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-700">{trip.accommodation}</span>
                </div>
              )}

              <div className="flex items-center text-sm">
                <DollarSign size={16} className="mr-2 text-gray-500" />
                <span className="text-gray-700 font-semibold">
                  Rp {trip.estimatedCost.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                {trip.status.replace('_', ' ')}
              </span>
              {trip.status === 'COMPLETED' && (
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Create Claim →
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Trip Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold mb-6">Plan New Trip</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Jakarta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose *
                  </label>
                  <input
                    type="text"
                    value={newTrip.purpose}
                    onChange={(e) => setNewTrip({ ...newTrip, purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Client Meeting"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transport Mode
                  </label>
                  <select
                    value={newTrip.transportMode}
                    onChange={(e) => setNewTrip({ ...newTrip, transportMode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Flight">Flight</option>
                    <option value="Train">Train</option>
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost (IDR)
                  </label>
                  <input
                    type="number"
                    value={newTrip.estimatedCost}
                    onChange={(e) => setNewTrip({ ...newTrip, estimatedCost: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation
                  </label>
                  <input
                    type="text"
                    value={newTrip.accommodation}
                    onChange={(e) => setNewTrip({ ...newTrip, accommodation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Hotel Name"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTrip}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Plan Trip
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
