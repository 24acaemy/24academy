"use client";

import React, { useState } from 'react';


import AdminLayout from '@/app/components/admin/AdminLayout';

const QuestionsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Questions page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة سؤال', value: 'add' },
        { label: 'عرض الأسئلة', value: 'view' },
        { label: 'تعديل سؤال', value: 'edit' },
    ];

    // Sample Data for Questions (could be fetched from an API)
    const columns = ['Question ID', 'Question Text', 'Difficulty Level'];
    const data = [
        { 'Question ID': 1, 'Question Text': 'ما هي عاصمة مصر؟', 'Difficulty Level': 'سهل' },
        { 'Question ID': 2, 'Question Text': 'ما هو أكبر كوكب في النظام الشمسي؟', 'Difficulty Level': 'متوسط' },
        { 'Question ID': 3, 'Question Text': 'ما هو العنصر الكيميائي الذي يوجد في قلب الشمس؟', 'Difficulty Level': 'صعب' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}> {/* Pass dynamicTabs, activeTab, and onTabChange props */}
            {/* Tab Content for Questions */}
            {activeTab === 'view' && <div>هنا يمكنك إضافة سؤال جديد.</div>} {/* Display Table in "View" tab */}

            {/* Add Content for "Add" and "Edit" Tabs */}
            {activeTab === 'add' && <div>هنا يمكنك إضافة سؤال جديد.</div>} {/* Content for Add Tab */}
            {activeTab === 'edit' && <div>هنا يمكنك تعديل بيانات السؤال.</div>} {/* Content for Edit Tab */}
        </AdminLayout>
    );
};

export default QuestionsPage;
