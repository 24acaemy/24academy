import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaFilter, FaRedo } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned';

// Define the types for Payment Method
interface PaymentMethod {
    me_id: string;
    method: string;
    details: string;
    created_at: string;
}

// Card component to display individual payment method details
const Card: React.FC<{ payment: PaymentMethod }> = ({ payment }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#051568] mb-2">
                    {payment.method}
                </h3>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">التفاصيل:</span> {payment.details}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">تاريخ الإضافة:</span> {payment.created_at}
                </p>
            </div>
        </div>
    );
};

const ViewPaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('latest');
    const [loading, setLoading] = useState<boolean>(true);

    // Default data to use if API fails
    const defaultData: PaymentMethod[] = [
        { me_id: "1", method: "onecash", details: "على مدار 24 ساعة", created_at: "30/11/2024 07:25 PM" },
        { me_id: "2", method: "paypal", details: "طريقة الدفع عبر الانترنت", created_at: "25/12/2024 03:00 PM" }
    ];

    // Fetch payment methods data from API
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/payment_methods');
                if (response.data && response.data.length > 0) {
                    setPaymentMethods(response.data);
                } else {
                    setPaymentMethods(defaultData);
                }
            } catch {
                setPaymentMethods(defaultData);
                setError('فشل في جلب البيانات. استخدام البيانات الافتراضية.');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentMethods();
    }, []); // defaultData is static, no need to include in dependency array

    // Memoize filtering and sorting to avoid unnecessary recalculations
    const filteredPaymentMethods = useMemo(() => {
        return paymentMethods.sort((a, b) => {
            if (filter === 'name-asc') {
                return a.method.localeCompare(b.method);
            } else if (filter === 'name-desc') {
                return b.method.localeCompare(a.method);
            } else if (filter === 'latest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else {
                return 0;
            }
        });
    }, [paymentMethods, filter]);

    if (error) {
        return (
            <div className="text-red-500 text-center mt-4">
                <div className="flex items-center justify-center">
                    <FaRedo className="animate-spin mr-2" />
                    <span>{error}</span>
                </div>
                <button onClick={() => window.location.reload()} className="mt-4 bg-[#051568] text-white p-2 rounded-md">
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (loading) {
        return <CustomLoader />;
    }

    if (paymentMethods.length === 0) {
        return <div className="text-center mt-4">لا توجد بيانات لعرضها.</div>;
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">طرق الدفع</h3>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <FaFilter className="text-[#051568]" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    >
                        <option value="latest">الأحدث أولاً</option>
                        <option value="name-asc">الأبجدية (أ-ي)</option>
                        <option value="name-desc">الأبجدية (ي-أ)</option>
                    </select>
                </div>
            </div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPaymentMethods.map((payment) => (
                    <Card key={payment.me_id} payment={payment} />
                ))}
            </div>
        </div>
    );
};

export default ViewPaymentMethods;
