import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaFilter, FaSortAlphaDown, FaUserGraduate, FaRedo } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned';

// Define the types for Teacher
interface Teacher {
    te_id: string;
    te_name: string;
    nationality: string;
    phone: string;
    gender: string;
    birthdate: string;
    specialization: string;
    email: string;
    created_at: string;
}

// Card component to display individual teacher details
const Card: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#051568] mb-2 flex items-center">
                    <FaUserGraduate className="mr-2" /> {teacher.te_name}
                </h3>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">التخصص:</span> {teacher.specialization}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">البريد الإلكتروني:</span> {teacher.email}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">الجنسية:</span> {teacher.nationality}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">الهاتف:</span> {teacher.phone}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">تاريخ الميلاد:</span> {teacher.birthdate}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">الجنس:</span> {teacher.gender}
                </p>
            </div>
        </div>
    );
};

const ViewTeachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('latest');
    const [specializationFilter, setSpecializationFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);

    // Default data to use if API fails
    const defaultData: Teacher[] = [
        { te_id: "1", te_name: "محمد أحمد", nationality: "مصري", phone: "123456789", gender: "ذكر", birthdate: "01/01/1980", specialization: "رياضيات", email: "mohamed.ahmed@example.com", created_at: "01/01/2023" },
        { te_id: "2", te_name: "فاطمة الزهراء", nationality: "مغربي", phone: "987654321", gender: "أنثى", birthdate: "02/02/1990", specialization: "فيزياء", email: "fatima.zahra@example.com", created_at: "02/02/2023" }
    ];

    // Fetch teachers data from API
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/teachers');
                if (response.data && response.data.length > 0) {
                    setTeachers(response.data);
                } else {
                    setTeachers(defaultData);
                }
            } catch {
                setTeachers(defaultData);
                setError('فشل في جلب البيانات. استخدام البيانات الافتراضية.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []); // defaultData does not need to be added here

    // Memoize filtering and sorting to avoid unnecessary recalculations
    const filteredTeachers = useMemo(() => {
        return teachers
            .filter((teacher) => specializationFilter === 'all' || teacher.specialization === specializationFilter)
            .sort((a, b) => {
                if (filter === 'name-asc') {
                    return a.te_name.localeCompare(b.te_name);
                } else if (filter === 'name-desc') {
                    return b.te_name.localeCompare(a.te_name);
                } else if (filter === 'latest') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else {
                    return 0;
                }
            });
    }, [teachers, filter, specializationFilter]);

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

    if (teachers.length === 0) {
        return <div className="text-center mt-4">لا توجد بيانات لعرضها.</div>;
    }

    // Convert Set to Array for compatibility
    const specializations = Array.from(new Set(teachers.map((teacher) => teacher.specialization)));

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">قائمة المعلمين</h3>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <FaFilter className="text-[#051568]" />
                    <select
                        value={specializationFilter}
                        onChange={(e) => setSpecializationFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    >
                        <option value="all">جميع التخصصات</option>
                        {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                                {spec}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <FaSortAlphaDown className="text-[#051568]" />
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

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                    <Card key={teacher.te_id} teacher={teacher} />
                ))}
            </div>
        </div>
    );
};

export default ViewTeachers;
