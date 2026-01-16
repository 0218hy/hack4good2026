import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  needs: string;
}

interface EditParticipantModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onEditParticipant: (updatedParticipant: Participant) => void;
}

export default function EditParticipantModal({
  participant,
  isOpen,
  onClose,
  onEditParticipant,
}: EditParticipantModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    needs: '',
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        needs: participant.needs,
      });
    }
  }, [participant]);

  if (!isOpen || !participant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditParticipant({
      id: participant.id,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Edit Participant</h2>
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

            {/* Accessibility Needs */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2">
                Accessibility Needs
              </label>
              <input
                type="text"
                value={formData.needs}
                onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                placeholder="e.g., Wheelchair-bound, Sign language, None"
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
