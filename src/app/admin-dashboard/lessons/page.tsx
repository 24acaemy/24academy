"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
// This would be the component for editing a lesson
import ViewLessons from './ViewLessons'; // This is your existing component for viewing lessons
import AddLesson from './AddLesson';
import EditLesson from './EditLesson';

const LessonsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Lessons page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة درس', value: 'add' },
        { label: 'عرض الدروس', value: 'view' },
        { label: 'تعديل درس', value: 'edit' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Tab Content for Lessons */}
            {activeTab === 'view' && <ViewLessons />} {/* Display ViewLessons component in "view" tab */}
            {activeTab === 'add' && <AddLesson />}   {/* Content for Add Lesson tab */}
            {activeTab === 'edit' && <EditLesson />} {/* Content for Edit Lesson tab */}
        </AdminLayout>
    );
};

export default LessonsPage;
