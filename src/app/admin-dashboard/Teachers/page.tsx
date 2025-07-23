"use client";
import AdminLayout from '@/app/components/admin/AdminLayout';
import React, { useState } from 'react';
import AddTeacher from './AddTeacher';
import EditTeacher from './EditTeacher';
import ViewTeachers from './ViewTeachers';


const TeachersPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

    // Define dynamic tabs specific to the Teachers page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة معلم', value: 'add' },
        { label: 'عرض المعلمين', value: 'view' },
        { label: 'تعديل معلم', value: 'edit' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Tab Content for Teachers */}
            {activeTab === 'view' && <ViewTeachers />}
            {activeTab === 'add' && <AddTeacher />}
            {activeTab === 'edit' && <EditTeacher />}
        </AdminLayout>
    );
};

export default TeachersPage;
