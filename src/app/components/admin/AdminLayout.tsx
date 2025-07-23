"use client";
import React, { ReactNode, useState, useEffect } from 'react';
import TabBar from './tababr';
import Sidebar from './sidebar';
import { auth, db } from '@/services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import CustomLoader from '../spinned';

interface AdminLayoutProps {
    children: ReactNode;
    dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[]; // dynamic tabs
    activeTab: 'view' | 'add' | 'edit'; // active tab
    onTabChange: (tab: 'view' | 'add' | 'edit') => void; // handle tab change
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, dynamicTabs, activeTab, onTabChange }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarVisible(prevState => !prevState);
    };

    // Fetch user role after user is authenticated
    useEffect(() => {
        const fetchUserRole = async () => {
            const uid = auth.currentUser?.uid;
            if (uid) {
                try {
                    const userDocRef = doc(db, 'users', uid);
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUserRole(userData.role);
                    } else {
                        setUserRole(null);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setUserRole(null);
                }
            } else {
                setUserRole(null);
            }
            setLoading(false);
        };

        fetchUserRole();
    }, []);

    // Show loading spinner while fetching data
    if (loading) {
        return <CustomLoader />;
    }

    // If user is not an admin, show a permission error
    if (userRole !== 'admin') {
        return (
            <div className="text-center mt-4">
                <h1 className="text-xl font-bold text-red-600">معذرة، هذه الصفحة ليست من صلاحياتك</h1>
            </div>
        );
    }

    return (
        <div className="flex h-screen" dir="rtl">
            {/* Sidebar */}
            <Sidebar isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} />

            {/* Main content area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}
            >
                {/* Header */}
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold">لوحة التحكم</h1>
                </div>

                {/* TabBar Component */}
                <div className="p-4 border-b">
                    <TabBar activeTab={activeTab} onTabChange={onTabChange} dynamicTabs={dynamicTabs} />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;