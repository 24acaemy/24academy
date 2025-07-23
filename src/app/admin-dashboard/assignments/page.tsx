"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ViewAssignments from './ViewAssigns';
import AddAssignment from './AddAssigns';
import ManageAssignments from './EditAssigns';




const AssignmentsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Assignments page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة تعيين', value: 'add' },
        { label: 'عرض التعيين', value: 'view' },
        { label: 'تعديل تعيين', value: 'edit' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Tab Content for Assignments */}
            {activeTab === 'view' && <ViewAssignments />}
            {activeTab === 'add' && <AddAssignment />}
            {activeTab === 'edit' && < ManageAssignments />}
        </AdminLayout>
    );
};

export default AssignmentsPage;
