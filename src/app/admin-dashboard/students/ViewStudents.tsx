import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaUserGraduate, FaRedo } from 'react-icons/fa';
import { CircleLoader } from 'react-spinners';
import CustomLoader from '@/app/components/spinned';

// Define the types for Student
interface Student {
    stu_id: string;
    stu_name: string;
    nationality: string;
    phone1: string;
    gender: string;
    birthdate: string;
    email: string;
    created_at: string;
}

// Card component to display individual student details
const Card: React.FC<{ student: Student }> = ({ student }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#051568] mb-2 flex items-center">
                    <FaUserGraduate className="mr-2" /> {student.stu_name}
                </h3>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">البريد الإلكتروني:</span> {student.email}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">الجنسية:</span> {student.nationality}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">الهاتف:</span> {student.phone1}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">تاريخ الميلاد:</span> {student.birthdate}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                    <span className="font-medium">الجنس:</span> {student.gender}
                </p>
            </div>
        </div>
    );
};

const ViewStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('latest');
    const [nationalityFilter, setNationalityFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);

    // Default data to use if API fails
    const defaultData: Student[] = [
        { stu_id: "1", stu_name: "أحمد علي", nationality: "مصر", phone1: "0123456789", gender: "ذكر", birthdate: "01/01/2000", email: "ahmed.ali@example.com", created_at: "01/01/2023" },
        { stu_id: "2", stu_name: "سارة محمد", nationality: "سعودية", phone1: "9876543210", gender: "أنثى", birthdate: "02/02/2001", email: "sara.mohamed@example.com", created_at: "02/02/2023" }
    ];

    // Fetch students data from API
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/students');
                if (response.data && response.data.length > 0) {
                    setStudents(response.data);
                } else {
                    setStudents(defaultData);
                }
            } catch (err) {
                setStudents(defaultData);
                setError('فشل في جلب البيانات. استخدام البيانات الافتراضية.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Memoize filtering and sorting to avoid unnecessary recalculations
    const filteredStudents = useMemo(() => {
        return students
            .filter((student) => nationalityFilter === 'all' || student.nationality === nationalityFilter)
            .sort((a, b) => {
                if (filter === 'name-asc') {
                    return a.stu_name.localeCompare(b.stu_name);
                } else if (filter === 'name-desc') {
                    return b.stu_name.localeCompare(a.stu_name);
                } else if (filter === 'latest') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else {
                    return 0;
                }
            });
    }, [students, filter, nationalityFilter]);

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

    if (students.length === 0) {
        return <div className="text-center mt-4">لا توجد بيانات لعرضها.</div>;
    }

    // Convert Set to Array for compatibility
    const nationalities = Array.from(new Set(students.map((student) => student.nationality)));

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">قائمة الطلاب</h3>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <FaFilter className="text-[#051568]" />
                    <select
                        value={nationalityFilter}
                        onChange={(e) => setNationalityFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    >
                        <option value="all">جميع الجنسيات</option>
                        {nationalities.map((nationality) => (
                            <option key={nationality} value={nationality}>
                                {nationality}
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

            {/* Students Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                    <Card key={student.stu_id} student={student} />
                ))}
            </div>
        </div>
    );
};

export default ViewStudents;
