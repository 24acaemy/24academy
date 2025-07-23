"use client";
import { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is used for API requests
import CustomLoader from '@/app/components/spinned';
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const ViewPayments = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false); // Track loading state
    const [modalVisible, setModalVisible] = useState<boolean>(false); // Track modal visibility
    const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null); // Track the payment being edited
    const [selectedStatus, setSelectedStatus] = useState<number>(0); // Track selected status in modal

    // Filter states
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>(''); // Filter by payment method
    const [statusFilter, setStatusFilter] = useState<string>(''); // Filter by status
    const [dateFilter, setDateFilter] = useState<string>(''); // Filter by date
    const [searchTerm, setSearchTerm] = useState<string>(''); // Search by name or other fields

    // Filter options (explicitly typed as string arrays)
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]); // Available payment methods
    const [statuses, setStatuses] = useState<string[]>([]); // Available statuses
    const [dates, setDates] = useState<string[]>([]); // Available dates for filtering

    // Request permission for browser notifications
    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                console.log("Notification permission:", permission);
            });
        }
    }, []);

    // Fetch payments from API
    useEffect(() => {
        setLoading(true); // Start loading
        axios.get('https://24onlinesystem.vercel.app/payments') // Correct API URL
            .then(response => {
                const paymentData = response.data;
                setPayments(paymentData); // Assuming response contains an array of payments
                setFilteredPayments(paymentData); // Initialize filtered payments with all data

                // Extract filter options from the fetched data
                const methods = Array.from(new Set(paymentData.map((payment: { pay_method: any; }) => payment.pay_method))) as string[];
                const statuses = Array.from(new Set(paymentData.map((payment: { status: any; }) => payment.status))) as string[];
                const dates = Array.from(new Set(paymentData.map((payment: { created_at: string; }) => payment.created_at))) as string[];

                setPaymentMethods(methods);
                setStatuses(statuses);
                setDates(dates);

                setLoading(false); // Stop loading
            })
            .catch(error => {
                console.error("Error fetching payments:", error);
                setLoading(false); // Stop loading
            });
    }, []);

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
            filtered = filtered.filter(payment => payment.created_at === dateFilter); // Match only the date (DD/MM/YYYY)
        }

        if (searchTerm) {
            filtered = filtered.filter(payment =>
                payment.stu_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.amount.toString().includes(searchTerm)
            );
        }

        setFilteredPayments(filtered);
    }, [payments, paymentMethodFilter, statusFilter, dateFilter, searchTerm]);

    // Handler to update the payment status
    const handleStatusChange = (paymentId: number, newStatus: number) => {
        axios.put('https://24onlinesystem.vercel.app/payments', {
            status: newStatus,
            pay_id: paymentId
        })
            .then(response => {
                // After successfully updating the payment status, check if it's "مقبول"
                if (newStatus === 1) { // If status is "مقبول"
                    const payment = payments.find(payment => payment.pay_id === paymentId);

                    if (payment) {
                        // Fetch course data to get the corresponding co_id
                        axios.get('https://24onlinesystem.vercel.app/courses')
                            .then(courseResponse => {
                                const courses = courseResponse.data;
                                const selectedCourse = courses.find((course: { co_name: any; }) => course.co_name === payment.co_name);

                                if (selectedCourse) {
                                    const enrollmentData = {
                                        email: payment.email,
                                        co_id: selectedCourse.co_id, // Use dynamic co_id based on course name
                                           email: payment.email,
        co_id: selectedCourse.co_id,
        pay_id: payment.pay_id // إضافة pay_id إلى البيانات المرسلة
                                    
                                    };

                                    // Send data to enrollments API
                                    axios.post('https://24onlinesystem.vercel.app/enrollments', enrollmentData)
                                        .then(() => {
                                            toast.success("تم تسجيل الطالب في الدورة بنجاح!");
                                        })
                                        .catch(error => {
                                            console.error("Error enrolling student:", error);
                                            toast.error("فشل في تسجيل الطالب.");
                                        });

                                    // Send an email notification
                                    const emailData = {
                                        email: payment.email,
                                        name: payment.stu_name,
                                        course: payment.co_name,
                                        status: newStatus
                                    };

                                    axios.post('https://24onlinesystem.vercel.app/payments/sendemail', emailData)
                                        .then(() => {
                                            toast.success("تم إرسال البريد الإلكتروني بنجاح!");
                                        })
                                        .catch(error => {
                                            console.error("Error sending email:", error);
                                            toast.error("فشل في إرسال البريد الإلكتروني.");
                                        });
                                } else {
                                    toast.error("الدورة غير موجودة.");
                                }
                            })
                            .catch(error => {
                                console.error("Error fetching courses:", error);
                                toast.error("فشل في جلب الدورات.");
                            });
                    }
                }

                // Refresh payment data after status update
                axios.get('https://24onlinesystem.vercel.app/payments')
                    .then(response => {
                        const paymentData = response.data;
                        setPayments(paymentData); // Update the payments state with new data
                        setFilteredPayments(paymentData); // Reset filtered payments with updated data
                    })
                    .catch(error => {
                        console.error("Error fetching updated payments:", error);
                    });

                // Show success toast for payment status change
                toast.success("تم تغيير حالة الدفع بنجاح!");

                // Show a browser notification if permission is granted
                if (Notification.permission === "granted") {
                    new Notification("تم تغيير حالة الدفع", {
                        body: "تم تغيير حالة الدفع الخاصة بك بنجاح.",
                        icon: "/path/to/your/icon.png", // Optionally, you can add an icon for the notification
                    });
                }

                setModalVisible(false); // Close modal after update
            })
            .catch(error => {
                console.error("Error updating payment status:", error);
                toast.error("فشل في تغيير الحالة.");
            });
    };

    // Open the modal when the change status button is clicked
    const openModal = (paymentId: number, currentStatus: number) => {
        setSelectedPaymentId(paymentId);
        setSelectedStatus(currentStatus);
        setModalVisible(true);
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg" dir="rtl">
            <h2 className="text-xl font-semibold text-gray-700">هذه هي المدفوعات التي قمت بها.</h2>

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

                    {/* Payments Table */}
                    <table className="min-w-full border-collapse table-auto">
                        <thead>
                            <tr>
                                <th className="border p-2">الاسم</th>
                                <th className="border p-2">طريقة الدفع</th>
                                <th className="border p-2">المبلغ</th>
                                <th className="border p-2">الحالة</th>
                                <th className="border p-2">التاريخ</th>
                                <th className="border p-2">إجراء</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map((payment) => (
                                <tr key={payment.pay_id}>
                                    <td className="border p-2">{payment.stu_name}</td>
                                    <td className="border p-2">{payment.pay_method}</td>
                                    <td className="border p-2">{payment.amount}</td>
                                    <td className="border p-2">{payment.status}</td>
                                    <td className="border p-2">{payment.created_at}</td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded"
                                            onClick={() => openModal(payment.pay_id, payment.status)}
                                        >
                                            تغيير الحالة
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Toast notifications */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl />

            {/* Modal for changing status */}
            {modalVisible && selectedPaymentId !== null && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold">تغيير حالة الدفع</h3>
                        <div className="mb-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                                className="p-2 border rounded"
                            >
                                <option value={0}>غير مقبول</option>
                                <option value={1}>مقبول</option>
                            </select>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 p-2 rounded"
                                onClick={() => setModalVisible(false)}
                            >
                                إغلاق
                            </button>
                            <button
                                className="bg-green-500 text-white p-2 rounded"
                                onClick={() => handleStatusChange(selectedPaymentId, selectedStatus)}
                            >
                                حفظ التغييرات
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewPayments;
