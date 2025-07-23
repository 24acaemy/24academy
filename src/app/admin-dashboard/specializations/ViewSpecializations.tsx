"use client";

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaRedo } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned';

// Define the types for Specialization
interface Specialization {
    spec_id: string;
    spec_name: string;
    created_at: string;
}

const Card: React.FC<{ specialization: Specialization }> = ({ specialization }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#051568] mb-2">{specialization.spec_name}</h3>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">التخصص:</span> {specialization.spec_name}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">تاريخ الإنشاء:</span> {specialization.created_at}
                </p>
            </div>
        </div>
    );
};

const ViewSpecializations = () => {
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('latest');
    const [loading, setLoading] = useState<boolean>(true);

    // Default data to use if API fails
    const defaultData: Specialization[] = [
        { spec_id: "1", spec_name: "محاسبة", created_at: "26/11/2024 06:27 PM" },
        { spec_id: "2", spec_name: "إدارة الأعمال", created_at: "01/02/2024 10:00 AM" }
    ];

    // Fetch specializations data from API
    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/specializations');
                if (response.data && response.data.length > 0) {
                    setSpecializations(response.data);
                } else {
                    setSpecializations(defaultData);
                }
            } catch (err) {
                setSpecializations(defaultData);
                setError('فشل في جلب البيانات. استخدام البيانات الافتراضية.');
            } finally {
                setLoading(false);
            }
        };

        fetchSpecializations();
    }, []);

    // Memoize filtering and sorting to avoid unnecessary recalculations
    const filteredSpecializations = useMemo(() => {
        const dataToUse = specializations.length > 0 ? specializations : defaultData;
        return dataToUse.sort((a, b) => {
            if (filter === 'name-asc') {
                return a.spec_name.localeCompare(b.spec_name);
            } else if (filter === 'name-desc') {
                return b.spec_name.localeCompare(a.spec_name);
            } else if (filter === 'latest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else {
                return 0;
            }
        });
    }, [specializations, filter]);

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

    if (specializations.length === 0) {
        return <div className="text-center mt-4">لا توجد بيانات لعرضها.</div>;
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">قائمة التخصصات</h3>

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

            {/* Specializations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpecializations.map((specialization) => (
                    <Card key={specialization.spec_id} specialization={specialization} />
                ))}
            </div>
        </div>
    );
};

export default ViewSpecializations;
