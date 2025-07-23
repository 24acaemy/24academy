"use client";

import React, { useState } from 'react';

import AdminLayout from '@/app/components/admin/AdminLayout';
import ViewCourses from './ViewCourse';
import EditCourses from './EditCourses';
import AddCourses from './AddCourses';

const CoursesPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Courses page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة كورس', value: 'add' },
        { label: 'عرض الكورسات', value: 'view' },
        { label: 'تعديل كورس', value: 'edit' },
    ];

    // Sample Data for Courses (could be fetched from an API)
    const columns = ['Course ID', 'Course Name', 'Instructor', 'Duration'];
    const data = [
        { 'Course ID': 1, 'Course Name': 'دورة البرمجة', Instructor: 'أحمد سعيد', Duration: '3 أشهر' },
        { 'Course ID': 2, 'Course Name': 'دورة التصميم', Instructor: 'منى يوسف', Duration: '2 أشهر' },
        { 'Course ID': 3, 'Course Name': 'دورة التسويق', Instructor: 'محمد علي', Duration: '1 أشهر' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}> {/* Pass dynamicTabs, activeTab, and onTabChange props */}
            {/* Tab Content for Courses */}
            {activeTab === 'view' && <ViewCourses />} {/* Display Table in "View" tab */}

            {/* Add Content for "Add" and "Edit" Tabs */}
            {activeTab === 'add' && <AddCourses />} {/* Content for Add Tab */}
            {activeTab === 'edit' && <EditCourses />} {/* Content for Edit Tab */}
        </AdminLayout>
    );
};

export default CoursesPage;
