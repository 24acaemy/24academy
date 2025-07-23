"use client";
import { useState } from 'react';
import { BookOpenIcon, UserCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline'; // Updated import for Heroicons v2
import MyCoursesContent from './componetns/MyCoursesContent';
import MyEnrollmentsContent from './componetns/MyEnrollmentsContent';
import MyPaymentsContent from './componetns/MyPaymentsContent';
import Tab from './componetns/Tab';

const Home = () => {
    const [activeTab, setActiveTab] = useState<string>('my-courses');

    const tabs = [
        {
            id: 'my-courses',
            label: 'دوراتي',
            icon: <BookOpenIcon className="w-6 h-6 inline-block mr-2" /> // Study / Course Icon
        },
        {
            id: 'my-enrollments',
            label: 'مسجلاتي',
            icon: <UserCircleIcon className="w-6 h-6 inline-block mr-2" /> // Enrollment / User Icon
        },
        {
            id: 'my-payments',
            label: 'مدفوعاتي',
            icon: <CreditCardIcon className="w-6 h-6 inline-block mr-2" /> // Payment / Credit Card Icon
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
            {/* Tab Bar */}
            <div className="flex justify-between bg-[#051568] rounded-lg shadow-lg overflow-hidden mb-6">
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
            {renderContent()}
        </div>
    );
};

export default Home;
