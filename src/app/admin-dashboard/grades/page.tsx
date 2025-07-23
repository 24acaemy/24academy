"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';


const GradesPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Grades page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة درجة', value: 'add' },
        { label: 'عرض الدرجات', value: 'view' },
        { label: 'تعديل درجة', value: 'edit' },
    ];

    // Sample Data for Grades (could be fetched from an API)
    const columns = ['Grade ID', 'Student Name', 'Subject', 'Grade'];
    const data = [
        { 'Grade ID': 1, 'Student Name': 'أحمد علي', 'Subject': 'الرياضيات', 'Grade': 'A' },
        { 'Grade ID': 2, 'Student Name': 'سارة محمد', 'Subject': 'العلوم', 'Grade': 'B' },
        { 'Grade ID': 3, 'Student Name': 'محمود جابر', 'Subject': 'اللغة العربية', 'Grade': 'A+' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}> {/* Pass dynamicTabs, activeTab, and onTabChange props */}
            {/* Tab Content for Grades */}
            {activeTab === 'view' && <Table columns={columns} data={data} />} {/* Display Table in "View" tab */}

            {/* Add Content for "Add" and "Edit" Tabs */}
            {activeTab === 'add' && <div>هنا يمكنك إضافة درجة جديدة.</div>} {/* Content for Add Tab */}
            {activeTab === 'edit' && <div>هنا يمكنك تعديل بيانات الدرجة.</div>} {/* Content for Edit Tab */}
        </AdminLayout>
    );
};

export default GradesPage;
