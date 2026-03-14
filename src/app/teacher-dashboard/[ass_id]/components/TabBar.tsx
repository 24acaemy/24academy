import React from 'react';

export type TeacherTab = 'lessons' | 'Attendance' | 'grades';

interface TabBarProps {
    activeTab: TeacherTab;
    onTabChange: (tab: TeacherTab) => void;
    dynamicTabs: { label: string; value: TeacherTab }[];
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, dynamicTabs }) => {
    if (!dynamicTabs || dynamicTabs.length === 0) return null;

    return (
        <div className="mt-6 flex space-x-6 border-b-2 pb-2">
            {dynamicTabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`py-2 px-6 text-lg font-medium transition-all duration-200 ${
                        activeTab === tab.value
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-blue-500'
                    }`}
                    onClick={() => onTabChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabBar;
