import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaBook, FaChalkboardTeacher, FaFileAlt, FaCalendarAlt, FaVideo, FaLink, FaTimes } from "react-icons/fa";
import CustomLoader from "@/app/components/spinned";

interface LessonData {
    le_id: string;
    title: string;
    live_link: string;
    description: string;
    te_name: string;
    co_name: string;
    content: string;
    homework: string;
    watching_link: string;
    date: string;
    created_at: string;  // Added created date
    updated_at: string;  // Added updated date
}

interface LessonsTabProps {
    ass_id: string; // Add ass_id here to identify the course/assignment
}

const LessonsTab: React.FC<LessonsTabProps> = ({ ass_id }) => {
    const [lessons, setLessons] = useState<LessonData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [lessonData, setLessonData] = useState<LessonData>({
        le_id: '',
        title: '',
        content: '',
        live_link: '',
        watching_link: '',
        homework: '',
        co_name: '',
        te_name: '',
        description: '',
        date: '',
        created_at: '',
        updated_at: '',
    });
    const [errors, setErrors] = useState({
        title: '',
        content: '',
        live_link: '',
        watching_link: '',
        homework: '',
        co_name: '',
        te_name: '',
    });
    const [successMessage, setSuccessMessage] = useState<string>('');

    const fetchLessons = useCallback(async () => {
        try {
            const response = await axios.get(`https://24onlinesystem.vercel.app/lessons?ass_id=${ass_id}`);

            if (Array.isArray(response.data)) {
                setLessons(response.data); // Set fetched lessons
            }
        } catch (error) {
            console.error('Error fetching lessons:', error);
            setLessons([]); // Set empty lessons in case of an error
        } finally {
            setLoading(false); // End loading state
        }
    }, [ass_id]); // Dependency on `ass_id` to fetch lessons when it changes

    useEffect(() => {
        fetchLessons(); // Fetch lessons when the component mounts or `ass_id` changes
    }, [fetchLessons]);

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };


    if (loading) return <CustomLoader />;

    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">الدروس الخاصة بالدورة</h3>
            {successMessage && (
                <div className="mb-4 p-2 text-green-700 bg-green-200 rounded">
                    {successMessage}
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {lessons.map((lesson) => (
                    <div
                        key={lesson.le_id}
                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden transform hover:scale-105"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-[#051568] mb-4 flex items-center">
                                <FaBook className="mr-2 text-[#051568]" />
                                {lesson.title}
                            </h3>
                            <p>{lesson.content}</p>
                            <p>{lesson.homework}</p>
                            <p className="text-sm text-gray-500">{formattedDate(lesson.created_at)} -تم تنزيل فيدو الشرح : {formattedDate(lesson.updated_at)}</p>

                            <div className="mt-4">
                                <button
                                    onClick={() => window.open(lesson.live_link, "_blank")}
                                    className="mr-2 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded"
                                >
                                    <FaVideo className="mr-2" />
                                    رابط البث المباشر
                                </button>
                                <button
                                    onClick={() => window.open(lesson.watching_link, "_blank")}
                                    className="mr-2 text-white bg-green-500 hover:bg-green-700 p-2 rounded"
                                >
                                    <FaLink className="mr-2" />
                                    رابط المشاهدة
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonsTab;
