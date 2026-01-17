import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  needs: string;
  caregiver?: {
    name: string;
    email: string;
    phone: string;
    relationship?: string;
    accompanying?: boolean;
  };
  notes?: string;
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
    notes: '',
    hasCaregiver: false,
    caregiver: {
      name: '',
      email: '',
      phone: '',
      relationship: '',
      accompanying: false,
    },
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        needs: participant.needs,
        notes: participant.notes || '',
        hasCaregiver: !!participant.caregiver,
        caregiver: participant.caregiver || {
          name: '',
          email: '',
          phone: '',
          relationship: '',
          accompanying: false,
        },
      });
    }
  }, [participant]);

  if (!isOpen || !participant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedParticipant: Participant = {
      id: participant.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      needs: formData.needs,
      notes: formData.notes || undefined,
    };

    // Only include caregiver if hasCaregiver is true and at least name is filled
    if (formData.hasCaregiver && formData.caregiver.name.trim()) {
      updatedParticipant.caregiver = {
        name: formData.caregiver.name,
        email: formData.caregiver.email,
        phone: formData.caregiver.phone,
        relationship: formData.caregiver.relationship || undefined,
        accompanying: formData.caregiver.accompanying,
      };
    }

    onEditParticipant(updatedParticipant);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center p-4 z-50">
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
            {/* Participant Information Section */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Participant Information</h3>

              <div className="space-y-4">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Caregiver Information Section */}
            <div className="bg-sky-50 p-6 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Caregiver Information (Optional)</h3>

              <div className="space-y-4">
                {/* Caregiver Name */}
                <div>
                  <label className="block text-base font-bold text-gray-700 mb-2">
                    Caregiver Name
                  </label>
                  <input
                    type="text"
                    value={formData.caregiver.name}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        hasCaregiver: e.target.value.trim().length > 0,
                        caregiver: {
                          ...formData.caregiver,
                          name: e.target.value,
                        },
                      });
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>

                {formData.hasCaregiver && (
                  <>
                    {/* Caregiver Email */}
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">
                        Caregiver Email
                      </label>
                      <input
                        type="email"
                        value={formData.caregiver.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            caregiver: {
                              ...formData.caregiver,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
                      />
                    </div>

                    {/* Caregiver Phone */}
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">
                        Caregiver Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.caregiver.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            caregiver: {
                              ...formData.caregiver,
                              phone: e.target.value,
                            },
                          })
                        }
                        placeholder="+65 1234 5678"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="block text-base font-bold text-gray-700 mb-2">
                        Relationship to Participant
                      </label>
                      <input
                        type="text"
                        value={formData.caregiver.relationship}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            caregiver: {
                              ...formData.caregiver,
                              relationship: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., Mother, Father, Spouse, Sibling"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-sky-500 bg-white"
                      />
                    </div>

                    {/* Accompanying */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="accompanying"
                        checked={formData.caregiver.accompanying}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            caregiver: {
                              ...formData.caregiver,
                              accompanying: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5 text-sky-500 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <label htmlFor="accompanying" className="text-base font-bold text-gray-700">
                        Caregiver will accompany participant to events
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-base font-bold text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Optional notes about this participant..."
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