import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface EditVolunteerModalProps {
  volunteer: Volunteer | null;
  isOpen: boolean;
  onClose: () => void;
  onEditVolunteer: (updatedVolunteer: Volunteer) => void;
}

export default function EditVolunteerModal({
  volunteer,
  isOpen,
  onClose,
  onEditVolunteer,
}: EditVolunteerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (volunteer) {
      setFormData({
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
      });
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditVolunteer({
      id: volunteer.id,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Edit Volunteer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+65 1234 5678"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 border-2 border-gray-300 rounded-xl text-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-4 bg-sky-500 text-white rounded-xl text-lg font-bold hover:bg-sky-600 transition-colors shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}