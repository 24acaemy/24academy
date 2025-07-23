"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';

const AttendancePage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');

    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة حضور', value: 'add' },
        { label: 'عرض الحضور', value: 'view' },
        { label: 'تعديل الحضور', value: 'edit' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'view' && <div>هنا يمكنك عرض الحضور.</div>}
            {activeTab === 'add' && <div>هنا يمكنك إضافة حضور جديد.</div>}
            {activeTab === 'edit' && <div>هنا يمكنك تعديل بيانات الحضور.</div>}
        </AdminLayout>
    );
};

export default AttendancePage;
