import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (dateString: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'activityHub': 'Activity Hub',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',
    
    // Dashboard
    'participantDashboard': 'Participant Dashboard',
    'caregiverDashboard': 'Caregiver Dashboard',
    'volunteerDashboard': 'Volunteer Dashboard',
    'staffDashboard': 'Staff Dashboard',
    'browseActivities': 'Browse Activities',
    'myActivities': 'My Activities',
    'registeredActivities': 'Registered Activities',
    'listView': 'List View',
    'calendarView': 'Calendar View',
    
    // Registration
    'iAmA': 'I am a...',
    'selectRole': 'Select your role to get started',
    'participant': 'Participant',
    'caregiver': 'Caregiver',
    'volunteer': 'Volunteer',
    'staff': 'Staff',
    'participantDesc': 'Join activities and connect with the community',
    'caregiverDesc': 'Support your care receiver with activities',
    'volunteerDesc': 'Help facilitate activities and support participants',
    'staffDesc': 'Manage activities and coordinate programs',
    'backToHome': 'Back to Home',
    
    // Activity Card
    'time': 'Time',
    'location': 'Location',
    'wheelchairOk': 'Wheelchair OK',
    'signLanguage': 'Sign Language',
    'viewDetails': 'View Details',
    'signUp': 'Sign Up',
    'cancelSignup': 'Cancel Signup',
    'registered': 'Registered',
    'open': 'OPEN',
    'full': 'FULL',
    'closed': 'CLOSED',
    
    // Filters
    'search': 'Search',
    'filter': 'Filter',
    'filters': 'Filters',
    'wheelchairAccessible': 'Wheelchair Accessible',
    'signLanguageSupport': 'Sign Language Support',
    'paymentOptions': 'Payment Options',
    'all': 'All',
    'freeOnly': 'Free Only',
    'paidOnly': 'Paid Only',
    'availability': 'Availability',
    'availableOnly': 'Available Only',
    'repeatability': 'Repeatability',
    'oneTime': 'One-time',
    'weekly': 'Weekly',
    'biweekly': 'Bi-weekly',
    'monthly': 'Monthly',
    'applyFilters': 'Apply Filters',
    'clearAll': 'Clear All',
    
    // Calendar
    'slotsAvailable': 'Slots Available',
    'fullyBooked': 'Fully Booked',
    
    // Common
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'create': 'Create',
    'loading': 'Loading...',
    'noActivities': 'No activities found',
  },
  zh: {
    // Header
    'activityHub': '活动中心',
    'logout': '登出',
    'login': '登录',
    'register': '注册',
    
    // Dashboard
    'participantDashboard': '参与者控制面板',
    'caregiverDashboard': '护理员控制面板',
    'volunteerDashboard': '志愿者控制面板',
    'staffDashboard': '员工控制面板',
    'browseActivities': '浏览活动',
    'myActivities': '我的活动',
    'registeredActivities': '已注册活动',
    'listView': '列表视图',
    'calendarView': '日历视图',
    
    // Registration
    'iAmA': '我是...',
    'selectRole': '选择您的角色以开始',
    'participant': '参与者',
    'caregiver': '护理员',
    'volunteer': '志愿者',
    'staff': '员工',
    'participantDesc': '参加活动并与社区建立联系',
    'caregiverDesc': '支持您的护理对象参加活动',
    'volunteerDesc': '帮助促进活动并支持参与者',
    'staffDesc': '管理活动并协调项目',
    'backToHome': '返回主页',
    
    // Activity Card
    'time': '时间',
    'location': '地点',
    'wheelchairOk': '轮椅可通行',
    'signLanguage': '手语支持',
    'viewDetails': '查看详情',
    'signUp': '报名',
    'cancelSignup': '取消报名',
    'registered': '已注册',
    'open': '开放',
    'full': '已满',
    'closed': '已关闭',
    
    // Filters
    'search': '搜索',
    'filter': '筛选',
    'filters': '筛选条件',
    'wheelchairAccessible': '轮椅可通行',
    'signLanguageSupport': '手语支持',
    'paymentOptions': '付款选项',
    'all': '全部',
    'freeOnly': '仅免费',
    'paidOnly': '仅付费',
    'availability': '可用性',
    'availableOnly': '仅显示可用',
    'repeatability': '重复性',
    'oneTime': '一次性',
    'weekly': '每周',
    'biweekly': '双周',
    'monthly': '每月',
    'applyFilters': '应用筛选',
    'clearAll': '清除全部',
    
    // Calendar
    'slotsAvailable': '有空位',
    'fullyBooked': '已满员',
    
    // Common
    'cancel': '取消',
    'confirm': '确认',
    'save': '保存',
    'delete': '删除',
    'edit': '编辑',
    'create': '创建',
    'loading': '加载中...',
    'noActivities': '未找到活动',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return date.toLocaleDateString(language, options);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}