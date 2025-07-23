"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import Viewpayments from './viewpayments';


const PaymentsPage = () => {
    const [activeTab, setActiveTab] = useState<'view' | 'add' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Payments page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة دفعة', value: 'add' },
        { label: 'عرض المدفوعات', value: 'view' },
        { label: 'تعديل دفعة', value: 'edit' },
    ];

    // Sample Data for Payments (could be fetched from an API)
    const columns = ['Payment ID', 'Student Name', 'Amount', 'Payment Date', 'Status'];
    const data = [
        { 'Payment ID': 1, 'Student Name': 'أحمد علي', 'Amount': '500 ريال', 'Payment Date': '2025-01-20', 'Status': 'مكتمل' },
        { 'Payment ID': 2, 'Student Name': 'سارة محمد', 'Amount': '300 ريال', 'Payment Date': '2025-01-22', 'Status': 'غير مكتمل' },
        { 'Payment ID': 3, 'Student Name': 'مريم حسن', 'Amount': '200 ريال', 'Payment Date': '2025-01-23', 'Status': 'مكتمل' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}> {/* Pass dynamicTabs, activeTab, and onTabChange props */}
            {/* Tab Content for Payments */}
            {activeTab === 'view' && <Viewpayments />} {/* Display Table in "View" tab */}

            {/* Add Content for "Add" and "Edit" Tabs */}
            {activeTab === 'add' && <div>هنا يمكنك إضافة دفعة جديدة.</div>} {/* Content for Add Tab */}
            {activeTab === 'edit' && <div>هنا يمكنك تعديل بيانات الدفعة.</div>} {/* Content for Edit Tab */}
        </AdminLayout>
    );
};

export default PaymentsPage;
