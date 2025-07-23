"use client";

import React, { useState } from 'react';
import axios from 'axios';

const AddSpecialization = () => {
    const [specializationData, setSpecializationData] = useState({
        spec_name: '',  // Specialization name field
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpecializationData({
            ...specializationData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!specializationData.spec_name) {
            setError('اسم التخصص مطلوب');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const dataToSubmit = {
            spec_name: specializationData.spec_name,
        };

        try {
            const response = await axios.post('https://24onlinesystem.vercel.app/specializations', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                alert('تم إضافة التخصص بنجاح');
                setSpecializationData({
                    spec_name: '',  // Clear the input after successful submission
                });
            } else {
                alert('حدث خطأ أثناء إضافة التخصص');
            }
        } catch (error) {
            alert('حدث خطأ في الاتصال بالخادم');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-gray-100 bg-opacity-50 h-screen">
            <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
                    <h1 className="text-white text-lg font-semibold text-center">إضافة تخصص جديد</h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Specialization Name Field */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم التخصص</label>
                                <input
                                    type="text"
                                    name="spec_name"
                                    value={specializationData.spec_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل اسم التخصص"
                                />
                                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة تخصص'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddSpecialization;
