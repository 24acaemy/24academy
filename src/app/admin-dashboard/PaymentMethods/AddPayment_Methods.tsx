"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const AddPaymentMethod = () => {
    const [paymentData, setPaymentData] = useState({
        method: '',
        details: '',
    });

    const [errors, setErrors] = useState({
        method: '',
        details: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentData({
            ...paymentData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {
            method: paymentData.method ? '' : 'طريقة الدفع مطلوبة',
            details: paymentData.details ? '' : 'التفاصيل مطلوبة',
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Prepare data for submission
        const dataToSubmit = {
            method: paymentData.method,
            details: paymentData.details,
        };

        try {
            const response = await axios.post('https://24onlinesystem.vercel.app/payment_methods', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                alert('تم إضافة طريقة الدفع بنجاح');
                setPaymentData({
                    method: '',
                    details: '',
                });
            } else {
                alert(response.data.message || 'حدث خطأ أثناء إضافة طريقة الدفع');
            }
        } catch {
            alert('حدث خطأ في الاتصال بالخادم');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-gray-100 bg-opacity-50 h-screen">
            <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
                    <h1 className="text-white text-lg font-semibold text-center">إضافة طريقة دفع جديدة</h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Method Field */}
                            <div>
                                <label className="block text-sm text-gray-600">طريقة الدفع</label>
                                <input
                                    type="text"
                                    name="method"
                                    value={paymentData.method}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل طريقة الدفع"
                                />
                                {errors.method && <p className="text-red-500 text-xs mt-1">{errors.method}</p>}
                            </div>

                            {/* Details Field */}
                            <div>
                                <label className="block text-sm text-gray-600">التفاصيل</label>
                                <input
                                    type="text"
                                    name="details"
                                    value={paymentData.details}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل تفاصيل طريقة الدفع"
                                />
                                {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة طريقة دفع'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddPaymentMethod;
