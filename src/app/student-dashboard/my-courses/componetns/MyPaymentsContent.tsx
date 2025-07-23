"use client";
import { useState, useEffect } from 'react';
import { auth } from '@/services/firebase'; // Assuming firebase is already configured
import axios from 'axios'; // Assuming axios is used for API requests
import CustomLoader from '@/app/components/spinned';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const MyPaymentsContent = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Track loading state

    // Filter states
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>(''); // Filter by payment method
    const [statusFilter, setStatusFilter] = useState<string>(''); // Filter by status
    const [dateFilter, setDateFilter] = useState<string>(''); // Filter by date
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search by name or other fields

    // Filter options (explicitly typed as string arrays)
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]); // Available payment methods
    const [statuses, setStatuses] = useState<string[]>([]); // Available statuses
    const [dates, setDates] = useState<string[]>([]); // Available dates for filtering

    // Fetch user email from Firebase
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch payments for the current user
    useEffect(() => {
        if (userEmail) {
            setLoading(true); // Start loading
            axios.get(`https://24onlinesystem.vercel.app/payments/email=${userEmail}`)
                .then(response => {
                    const paymentData = response.data;
                    setPayments(paymentData); // Assuming response contains an array of payments
                    setFilteredPayments(paymentData); // Initialize filtered payments with all data

                    // Extract filter options from the fetched data
                    const methods = Array.from(new Set(paymentData.map((payment: { pay_method: any; }) => payment.pay_method))) as string[];
                    const statuses = Array.from(new Set(paymentData.map((payment: { status: any; }) => payment.status))) as string[];
                    const dates = Array.from(new Set(paymentData.map((payment: { created_at: string; }) => payment.created_at.substring(0, 10)))) as string[];

                    setPaymentMethods(methods);
                    setStatuses(statuses);
                    setDates(dates);

                    setLoading(false); // Stop loading
                })
                .catch(error => {
                    console.error("Error fetching payments:", error);
                    setLoading(false); // Stop loading
                });
        }
    }, [userEmail]);

    // Filter payments based on filter criteria
    useEffect(() => {
        let filtered = payments;

        if (paymentMethodFilter) {
            filtered = filtered.filter(payment => payment.pay_method.includes(paymentMethodFilter));
        }

        if (statusFilter) {
            filtered = filtered.filter(payment => payment.status.includes(statusFilter));
        }

        if (dateFilter) {
            filtered = filtered.filter(payment => payment.created_at.substring(0, 10) === dateFilter); // Match only the date (YYYY-MM-DD)
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
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg" dir="rtl">
            <h2 className="text-xl font-semibold text-gray-700">هذه هي المدفوعات التي قمت بها.</h2>

            {/* If userEmail is null, show a message asking the user to log in */}
            {!userEmail ? (
                <p className="text-gray-600">الرجاء تسجيل الدخول لعرض المدفوعات الخاصة بك.</p>
            ) : (
                <div>
                    {/* Show loader if data is loading */}
                    {loading ? (
                        <CustomLoader />
                    ) : (
                        <div>
                            {/* Filters */}
                            <div className="mb-4 flex gap-4">
                                {/* Payment Method Filter */}
                                <select
                                    className="p-2 border rounded"
                                    value={paymentMethodFilter}
                                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                >
                                    <option value="">جميع الطرق</option>
                                    {paymentMethods.map((method, index) => (
                                        <option key={index} value={method}>{method}</option>
                                    ))}
                                </select>

                                {/* Status Filter */}
                                <select
                                    className="p-2 border rounded"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">جميع الحالات</option>
                                    {statuses.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    ))}
                                </select>

                                {/* Date Filter */}
                                <select
                                    className="p-2 border rounded"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    <option value="">جميع التواريخ</option>
                                    {dates.map((date, index) => (
                                        <option key={index} value={date}>{date}</option>
                                    ))}
                                </select>

                                {/* Search Filter */}
                                <input
                                    type="text"
                                    className="p-2 border rounded"
                                    placeholder="ابحث بالاسم أو المبلغ"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {filteredPayments.length === 0 ? (
                                <p className="text-gray-600">لا توجد مدفوعات لعرضها.</p>
                            ) : (
                                <div className="overflow-x-auto"> {/* Add horizontal scrolling */}
                                    <table className="min-w-full table-auto mt-4">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 border">الطريقة</th>
                                                <th className="px-4 py-2 border">الاسم</th>
                                                <th className="px-4 py-2 border">المبلغ</th>
                                                <th className="px-4 py-2 border">الحالة</th>
                                                <th className="px-4 py-2 border">التاريخ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPayments.map((payment) => (
                                                <tr key={payment.pay_id}>
                                                    <td className="px-4 py-2 border">{payment.pay_method}</td>
                                                    <td className="px-4 py-2 border">{payment.stu_name}</td>
                                                    <td className="px-4 py-2 border">{payment.amount} ريال</td>
                                                    <td className="px-4 py-2 border">{payment.status}</td>
                                                    <td className="px-4 py-2 border">{payment.created_at}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* PDF Download Button */}

                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyPaymentsContent;
