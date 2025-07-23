// Tab.tsx
import React from 'react';

type TabProps = {
    id: string;
    label: string;
    icon: JSX.Element;
    activeTab: string;
    onClick: (id: string) => void;
};

const Tab: React.FC<TabProps> = ({ id, label, icon, activeTab, onClick }) => {
    return (
        <button
            className={`relative flex-1 py-3 text-center text-white text-lg font-medium focus:outline-none transition-all duration-300 ease-in-out transform 
              ${activeTab === id ? 'bg-[#3a4a76] scale-105' : 'hover:bg-[#3a4a76] hover:scale-105'}`}
            onClick={() => onClick(id)}
        >
            {/* Icon (shown on mobile) */}
            <span className="block sm:hidden">{icon}</span>
            {/* Label (shown on desktop) */}
            <span className="hidden sm:inline">{icon}{label}</span>

            {activeTab === id && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#fff] rounded-t-full"></span>
            )}
        </button>
    );
};

export default Tab;
