"use client";
import { useState } from 'react';
import { BookOpenIcon, UserCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import MyCoursesContent from './components/MyCoursesContent';
import MyEnrollmentsContent from './components/MyEnrollmentsContent';
import MyPaymentsContent from './components/MyPaymentsContent';
import Tab from './components/Tab';

const Home = () => {
  const [activeTab, setActiveTab] = useState<string>('my-courses');

  const tabs = [
    {
      id: 'my-courses',
      label: 'دوراتي',
      icon: <BookOpenIcon className="w-6 h-6 inline-block mr-2" />
    },
    {
      id: 'my-enrollments',
      label: 'مسجلاتي',
      icon: <UserCircleIcon className="w-6 h-6 inline-block mr-2" />
    },
    {
      id: 'my-payments',
      label: 'مدفوعاتي',
      icon: <CreditCardIcon className="w-6 h-6 inline-block mr-2" />
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'my-courses':
        return <MyCoursesContent />;
      case 'my-enrollments':
        return <MyEnrollmentsContent />;
      case 'my-payments':
        return <MyPaymentsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Sticky Tab Bar */}
      <div
        className="
          sticky top-[64px] z-40  /* Adjust top to match navbar height */
          flex bg-[#051568] rounded-lg shadow-lg mb-6 
          overflow-x-auto scrollbar-hide sm:justify-between
        "
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default Home;
