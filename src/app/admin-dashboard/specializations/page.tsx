"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ViewSpecializations from './ViewSpecializations';
import AddSpecialization from './AddSpecializations';

const SpecializationsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Specializations page
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة تخصص', value: 'add' },
        { label: 'عرض التخصصات', value: 'view' },
        { label: 'تعديل تخصص', value: 'edit' },
    ];

    // Sample Data for Specializations (could be fetched from an API)
    const columns = ['Specialization ID', 'Specialization Name', 'Department'];
    const data = [
        { 'Specialization ID': 1, 'Specialization Name': 'البرمجة', Department: 'علوم الكمبيوتر' },
        { 'Specialization ID': 2, 'Specialization Name': 'التصميم الجرافيكي', Department: 'الفنون' },
        { 'Specialization ID': 3, 'Specialization Name': 'إدارة الأعمال', Department: 'الاقتصاد' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Tab Content for Specializations */}
            {activeTab === 'view' && <ViewSpecializations />} {/* Display Table in "View" tab */}

            {/* Add Content for "Add" and "Edit" Tabs */}
            {activeTab === 'add' && <AddSpecialization />} {/* Content for Add Tab */}
            {activeTab === 'edit' && <div>لا يوجد تعديل على التخصص.</div>} {/* Content for Edit Tab */}
        </AdminLayout>
    );
};

export default SpecializationsPage;
