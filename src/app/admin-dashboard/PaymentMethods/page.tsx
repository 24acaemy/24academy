"use client";

import React, { useState } from 'react';
import AdminLayout from '@/app/components/admin/AdminLayout';
import ViewPaymentMethods from './ViewPayment_Methods';
import AddPaymentMethod from './AddPayment_Methods';
import ManagePaymentMethods from './EditPayment_Methods';

const PaymentMethodsPage = () => {
    const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view'); // Default to 'view' tab

    // Define dynamic tabs specific to the Payment Methods page with strict value types
    const dynamicTabs: { label: string; value: 'view' | 'add' | 'edit' }[] = [
        { label: 'إضافة طريقة دفع', value: 'add' },
        { label: 'عرض طرق الدفع', value: 'view' },
        { label: 'تعديل طريقة دفع', value: 'edit' },
    ];

    return (
        <AdminLayout dynamicTabs={dynamicTabs} activeTab={activeTab} onTabChange={setActiveTab}>
            {/* Tab Content for Payment Methods */}
            {activeTab === 'view' && <ViewPaymentMethods />} {/* Display Table in "View" tab */}

            {/* Add Content for "Add" and "Edit" Tabs */}
            {activeTab === 'add' && <AddPaymentMethod />} {/* Content for Add Tab */}
            {activeTab === 'edit' && <ManagePaymentMethods />} {/* Content for Edit Tab */}
        </AdminLayout>
    );
};

export default PaymentMethodsPage;
