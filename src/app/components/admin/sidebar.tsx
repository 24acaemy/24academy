import React, { useEffect } from 'react';
import Link from 'next/link';
import {
    FaTachometerAlt,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaBook,
    FaClipboardList,
    FaUsers,
    FaGraduationCap,
    FaCreditCard,
    FaMoneyBillWave
} from 'react-icons/fa';

interface SidebarProps {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarVisible, toggleSidebar }) => {
    // Handle key press for sidebar toggle
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'b') {
                toggleSidebar();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [toggleSidebar]);

    return (
        <>
            {/* Button to toggle sidebar on small screens (hidden on desktop) */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden text-black text-2xl p-2 fixed top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 rounded-md shadow-md"
                aria-label="Toggle Sidebar"
            >
                ☰
            </button>

            {/* Sidebar with dark background and RTL support */}
            <div
                id="sidebar"
                className={`${isSidebarVisible ? 'translate-x-0' : 'translate-x-full'}
                    lg:w-64 w-full sm:w-2/3 bg-gray-800 text-white fixed top-0 right-0 min-h-screen p-4
                    flex flex-col space-y-4 pt-12 lg:space-y-4 lg:pt-12 lg:static lg:bg-gray-800
                    transform transition-transform duration-300 ease-in-out z-50 rtl overflow-auto`}
            >
                <div className="flex justify-between items-center lg:hidden mb-4">
                    <span className="text-xl font-bold">القائمة</span>
                    <button
                        onClick={toggleSidebar}
                        className="text-white text-2xl"
                        aria-label="Close Sidebar"
                    >
                        ✖️
                    </button>
                </div>

                {/* Sidebar Links with Icons */}
                <Link href="/admin-dashboard" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaTachometerAlt />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>لوحة التحكم</span>
                </Link>
                <Link href="/admin-dashboard/Teachers" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaChalkboardTeacher />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>المعلمين</span>
                </Link>
                <Link href="/admin-dashboard/students" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaUserGraduate />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>الطلاب</span>
                </Link>
                <Link href="/admin-dashboard/specializations" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaBook />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>التخصصات</span>
                </Link>
                <Link href="/admin-dashboard/courses" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaBook />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>الكورسات</span>
                </Link>
                <Link href="/admin-dashboard/assignments" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaClipboardList />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>تعيين مدرس لدوره</span>
                </Link>
                <Link href="/admin-dashboard/enrollments" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaUsers />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>التسجيلات</span>
                </Link>
                <Link href="/admin-dashboard/CourseStudents" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaGraduationCap />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>الدورات والطلاب</span>
                </Link>
             
                {/* Payment and Payment Methods Links */}
                <Link href="/admin-dashboard/PaymentMethods" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaCreditCard />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>طرق الدفع</span>
                </Link>
                <Link href="/admin-dashboard/payments" className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg bg-gray-800">
                    <FaMoneyBillWave />
                    <span className={`ml-2 ${isSidebarVisible ? 'block' : 'hidden'} lg:block`}>المدفوعات</span>
                </Link>
            </div>
        </>
    );
};

export default Sidebar;
