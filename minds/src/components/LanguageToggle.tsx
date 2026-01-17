import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-md border-2 border-gray-200">
      <Languages className="w-6 h-6 text-gray-600" strokeWidth={2.5} />
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            language === 'en'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('zh')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            language === 'zh'
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Switch to Chinese"
        >
          中文
        </button>
      </div>
    </div>
  );
}
