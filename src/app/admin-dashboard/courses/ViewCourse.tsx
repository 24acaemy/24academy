import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaRedo } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned';

// Define the types for Course based on your provided data structure
interface Course {
    co_id: string;
    co_name: string;
    description: string;
    duration: string;
    price: string;
    curriculum: string;
    created_at: string;
    specialization: string;
}

// Card component to display individual course details
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#051568] mb-2">
                    {course.co_name}
                </h3>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">التخصص:</span> {course.specialization}
                </p>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">المُدة:</span> {course.duration}
                </p>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">السعر:</span> {course.price} جنيه
                </p>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">الوصف:</span> {course.description}
                </p>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">رابط المنهج:</span> <a href={course.curriculum} className="text-blue-500">{course.curriculum}</a>
                </p>
                <p className="text-gray-600 mb-1">
                    <span className="font-medium">تاريخ الإضافة:</span> {course.created_at}
                </p>
            </div>
        </div>
    );
};

const ViewCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('latest');
    const [specializationFilter, setSpecializationFilter] = useState<string>('all');
    const [loading, setLoading] = useState<boolean>(true);

    // Default data to use if API fails
    const defaultData: Course[] = [
        {
            co_id: "1",
            co_name: "دورة Word 2024",
            description: "صمم مستنداتك الخاصة بتعلم اللوورد 2024",
            duration: "10 أيام",
            price: "5000",
            curriculum: "https://learn.com",
            created_at: "26/11/2024 06:27 PM",
            specialization: "حاسوب",
        },
        {
            co_id: "2",
            co_name: "دورة JavaScript",
            description: "مقدمة للغة JavaScript.",
            duration: "4 ساعات",
            price: "1500",
            curriculum: "https://jscourse.com",
            created_at: "01/01/2025 09:00 AM",
            specialization: "برمجة",
        }
    ];

    // Fetch courses data from API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/courses');
                if (response.data && response.data.length > 0) {
                    setCourses(response.data);
                } else {
                    setCourses(defaultData);
                }
            } catch (err) {
                setCourses(defaultData);
                setError('فشل في جلب البيانات. استخدام البيانات الافتراضية.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Memoize filtering and sorting to avoid unnecessary recalculations
    const filteredCourses = useMemo(() => {
        return courses
            .filter((course) => specializationFilter === 'all' || course.specialization === specializationFilter)
            .sort((a, b) => {
                if (filter === 'name-asc') {
                    return a.co_name.localeCompare(b.co_name);
                } else if (filter === 'name-desc') {
                    return b.co_name.localeCompare(a.co_name);
                } else if (filter === 'latest') {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                } else {
                    return 0;
                }
            });
    }, [courses, filter, specializationFilter]);

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

    if (courses.length === 0) {
        return <div className="text-center mt-4">لا توجد بيانات لعرضها.</div>;
    }

    // Convert Set to Array for compatibility
    const specializations = Array.from(new Set(courses.map((course) => course.specialization)));

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">قائمة الكورسات</h3>

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
                        {specializations.map((specialization) => (
                            <option key={specialization} value={specialization}>
                                {specialization}
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

            {/* Courses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <CourseCard key={course.co_id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default ViewCourses;
