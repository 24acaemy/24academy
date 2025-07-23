import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaRedo, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaLink, FaVideo, FaFileAlt } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned'; // Assuming CustomLoader is used for loading states

// Define the types for Lesson
interface Lesson {
    le_id: string;
    title: string;
    content: string;
    live_link: string;
    watching_link: string;
    homework: string | null;
    created_at: string;
    co_name: string;
    te_name: string;
}

const Card: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    const formattedDate = new Date(lesson.created_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden transform hover:scale-105">
            <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-[#051568] mb-4 flex items-center">
                    <FaBook className="mr-2 text-[#051568]" />
                    {lesson.title}
                </h3>

                {/* Instructor */}
                <div className="flex items-center text-gray-600 mb-3">
                    <FaChalkboardTeacher className="mr-2 text-[#051568]" />
                    <span className="font-medium">المدرب:</span> {lesson.te_name}
                </div>

                {/* Course */}
                <div className="flex items-center text-gray-600 mb-3">
                    <FaBook className="mr-2 text-[#051568]" />
                    <span className="font-medium">الكورس:</span> {lesson.co_name}
                </div>

                {/* Content */}
                <div className="flex items-start text-gray-600 mb-3">
                    <FaFileAlt className="mr-2 text-[#051568] mt-1" />
                    <span className="font-medium">المحتوى:</span> {lesson.content}
                </div>

                {/* Date */}
                <div className="flex items-center text-gray-600 mb-3">
                    <FaCalendarAlt className="mr-2 text-[#051568]" />
                    <span className="font-medium">التاريخ:</span> {formattedDate}
                </div>

                {/* Homework (if available) */}
                {lesson.homework && (
                    <div className="flex items-start text-gray-600 mb-4">
                        <FaFileAlt className="mr-2 text-[#051568] mt-1" />
                        <span className="font-medium">الواجب:</span> {lesson.homework}
                    </div>
                )}

                {/* Links */}
                <div className="flex gap-4 mt-4">
                    <a
                        href={lesson.live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                        <FaVideo className="mr-2" />
                        مشاهدة البث المباشر
                    </a>
                    <a
                        href={lesson.watching_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                        <FaLink className="mr-2" />
                        مشاهدة التسجيل
                    </a>
                </div>
            </div>
        </div>
    );
};

const ViewLessons = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [courseFilter, setCourseFilter] = useState<string>(''); // Filter by course name
    const [instructorFilter, setInstructorFilter] = useState<string>(''); // Filter by instructor name

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/lessons');
                if (response.data) {
                    setLessons(response.data);
                } else {
                    setError('لا توجد دروس حالياً.');
                }
            } catch (err: any) {
                setError(`فشل في جلب البيانات: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    // Memoized lesson data with filtering
    const filteredLessons = useMemo(() => {
        return lessons.filter((lesson) => {
            const matchesCourse = courseFilter ? lesson.co_name === courseFilter : true;
            const matchesInstructor = instructorFilter ? lesson.te_name === instructorFilter : true;
            return matchesCourse && matchesInstructor;
        });
    }, [lessons, courseFilter, instructorFilter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CustomLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center mt-4">
                <div className="flex items-center justify-center">
                    <FaRedo className="animate-spin mr-2" />
                    <span>{error}</span>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-[#051568] text-white p-2 rounded-md hover:bg-[#051568]/90 transition-colors duration-300"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    const courseOptions = Array.from(new Set(lessons.map((lesson) => lesson.co_name)));
    const instructorOptions = Array.from(new Set(lessons.map((lesson) => lesson.te_name)));

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-[#051568] mb-8 text-center">قائمة الدروس</h3>

            {/* Filter Inputs (Always visible) */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <div className="flex-1">
                        <label htmlFor="courseFilter" className="text-gray-600 mb-2 block">فلتر حسب اسم الكورس:</label>
                        <select
                            id="courseFilter"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                        >
                            <option value="">اختيار الكورس</option>
                            {courseOptions.map((course) => (
                                <option key={course} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="instructorFilter" className="text-gray-600 mb-2 block">فلتر حسب اسم المدرب:</label>
                        <select
                            id="instructorFilter"
                            value={instructorFilter}
                            onChange={(e) => setInstructorFilter(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                        >
                            <option value="">اختيار المدرب</option>
                            {instructorOptions.map((instructor) => (
                                <option key={instructor} value={instructor}>
                                    {instructor}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Show message if no lessons match the filters */}
            {filteredLessons.length === 0 && (
                <div className="text-center mt-8 text-gray-500">
                    لا توجد بيانات لعرضها.
                </div>
            )}

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLessons.map((lesson) => (
                    <Card key={lesson.le_id} lesson={lesson} />
                ))}
            </div>
        </div>
    );
};

export default ViewLessons;
