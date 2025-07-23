"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '@/app/components/admin/AdminLayout';
import EnrollmentTable from './viewenrollment.tsx';

const EnrollmentsPage = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'view' | 'edit'>('view');
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    axios.get('https://24onlinesystem.vercel.app/payments')
      .then(response => {
        const paymentData = response.data;
        setPayments(paymentData);
        setFilteredPayments(paymentData);
      })
      .catch(error => {
        console.error("Error fetching payments:", error);
      });
  }, []);

  useEffect(() => {
    let filtered = payments;

    if (paymentMethodFilter) {
      filtered = filtered.filter(payment => payment.pay_method.includes(paymentMethodFilter));
    }

    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status.includes(statusFilter));
    }

    if (dateFilter) {
      filtered = filtered.filter(payment => payment.created_at === dateFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.stu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm)
      );
    }

    setFilteredPayments(filtered);
  }, [payments, paymentMethodFilter, statusFilter, dateFilter, searchTerm]);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      { activeTab === 'view' && <EnrollmentTable />}

      {activeTab === 'add' && <div>هنا يمكنك إضافة تسجيل جديد.</div>}
      {activeTab === 'edit' && <div>هنا يمكنك تعديل بيانات التسجيل.</div>}
    </AdminLayout>
  );
};

export default EnrollmentsPage;
