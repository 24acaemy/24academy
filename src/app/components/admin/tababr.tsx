import React from 'react';

interface TabBarProps {
    activeTab: 'view' | 'add' | 'edit'; // Enforcing the allowed values for activeTab
    onTabChange: (tab: 'view' | 'add' | 'edit') => void; // Typing onTabChange function
    dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[]; // Enforcing the type for dynamicTabs
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, dynamicTabs }) => {
    if (!dynamicTabs || dynamicTabs.length === 0) {
        return null; // Return nothing if dynamicTabs is empty or undefined
    }

    return (
        <div className="mt-4 flex space-x-6 border-b border-gray-300 pb-2">
            {dynamicTabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`py-2 px-6 text-lg font-medium transition-all duration-200 ${activeTab === tab.value
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-500'
                        }`}
                    onClick={() => onTabChange(tab.value)} // Call the onTabChange function with the value of the clicked tab
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabBar;
