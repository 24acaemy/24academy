"use client";
import AdminLayout from '@/app/components/admin/AdminLayout';
import React, { useState } from 'react';
import ViewCourseStudents from './ViewCourseStudents'; // Assuming this is the component for viewing students in courses
import AddCourseStudent from './AddCourseStudent';
// Placeholder for editing course details

const CourseStudentsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

    // Define dynamic tabs specific to the CourseStudents page
    const dynamicTabs: { label: string; value: 'add' | 'view' | 'edit' }[] = [
        { label: 'إضافة طالب لدورة', value: 'add' },
        { label: 'عرض الطلاب المنضمين للدورات', value: 'view' },
        { label: 'تعديل دورة', value: 'edit' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Tab Content for Courses and Students */}
            {activeTab === 'view' && <ViewCourseStudents />}
            {activeTab === 'add' && <AddCourseStudent />}
            {activeTab === 'edit' && <div></div>}
        </AdminLayout>
    );
};

export default CourseStudentsPage;
