import { X } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    eligibleOnly: boolean;
    wheelchairAccessible: boolean;
    signLanguageSupport: boolean;
    paymentRequired: 'all' | 'free' | 'paid';
    availableOnly: boolean;
    repeatability: 'all' | 'one-time' | 'weekly' | 'biweekly' | 'monthly';
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterModal({ isOpen, onClose, filters, onFilterChange }: FilterModalProps) {
  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Filter Activities 筛选活动</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.eligibleOnly}
                onChange={(e) => handleChange('eligibleOnly', e.target.checked)}
                className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
              />
              <span className="text-gray-700 font-semibold">Only show activities I'm eligible for 仅显示我符合条件的活动</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Accessibility 无障碍设施</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.wheelchairAccessible}
                  onChange={(e) => handleChange('wheelchairAccessible', e.target.checked)}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-gray-700">Wheelchair accessible 轮椅可通行</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.signLanguageSupport}
                  onChange={(e) => handleChange('signLanguageSupport', e.target.checked)}
                  className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-gray-700">Sign language support 手语支持</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Payment 付款</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={filters.paymentRequired === 'all'}
                  onChange={() => handleChange('paymentRequired', 'all')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">All activities 所有活动</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={filters.paymentRequired === 'free'}
                  onChange={() => handleChange('paymentRequired', 'free')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">Free only 仅免费</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={filters.paymentRequired === 'paid'}
                  onChange={() => handleChange('paymentRequired', 'paid')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">Paid only 仅付费</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) => handleChange('availableOnly', e.target.checked)}
                className="w-5 h-5 text-sky-500 border-2 border-gray-300 rounded focus:ring-sky-500"
              />
              <span className="text-gray-700 font-semibold">Available slots only 仅显示有空位的活动</span>
            </label>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Repeatability 重复性</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repeatability"
                  checked={filters.repeatability === 'all'}
                  onChange={() => handleChange('repeatability', 'all')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">All activities 所有活动</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repeatability"
                  checked={filters.repeatability === 'one-time'}
                  onChange={() => handleChange('repeatability', 'one-time')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">One-time only 仅一次性活动</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repeatability"
                  checked={filters.repeatability === 'weekly'}
                  onChange={() => handleChange('repeatability', 'weekly')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">Recurring weekly 每周重复</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repeatability"
                  checked={filters.repeatability === 'biweekly'}
                  onChange={() => handleChange('repeatability', 'biweekly')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">Recurring bi-weekly 每两周重复</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repeatability"
                  checked={filters.repeatability === 'monthly'}
                  onChange={() => handleChange('repeatability', 'monthly')}
                  className="w-4 h-4 text-sky-500 border-2 border-gray-300 focus:ring-sky-500"
                />
                <span className="text-gray-700">Recurring monthly 每月重复</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-sky-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-sky-600 transition-colors"
          >
            Apply Filters 应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}