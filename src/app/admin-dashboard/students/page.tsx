"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';

import AddStudent from './AddStudent';
import EditStudent from './EditStudent';
import ViewStudents from './ViewStudents';


const StudentsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // تعريف الـ Tabs الديناميكية الخاصة بالطلاب
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة طالب', value: 'add' },
        { label: 'عرض الطلاب', value: 'view' },
        { label: 'تعديل طالب', value: 'edit' },
    ];

    // بيانات الطلاب كمثال (يمكنك جلبها من API)
    const columns = ['ID', 'الاسم', 'الصف', 'العمر'];
    const data = [
        { ID: 1, name: 'محمد علي', grade: 'الصف الأول', age: 10 },
        { ID: 2, name: 'مريم حسن', grade: 'الصف الثاني', age: 11 },
        { ID: 3, name: 'جمال حسين', grade: 'الصف الثالث', age: 12 },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* محتوى التبويبات للطلاب */}
            {activeTab === 'view' && <ViewStudents />} {/* عرض الجدول في التبويب "عرض الطلاب" */}

            {/* محتوى التبويبات "إضافة" و "تعديل" */}
            {activeTab === 'add' && <AddStudent />} {/* محتوى التبويب "إضافة طالب" */}
            {activeTab === 'edit' && <EditStudent />} {/* محتوى التبويب "تعديل طالب" */}
        </AdminLayout>
    );
};

export default StudentsPage;
