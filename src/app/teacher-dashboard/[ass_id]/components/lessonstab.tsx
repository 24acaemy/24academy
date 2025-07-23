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
    courseName: string;
    teacherName: string;
    ass_id: string; // Add ass_id here to identify the course/assignment
}

const LessonsTab: React.FC<LessonsTabProps> = ({ courseName, teacherName, ass_id }) => {
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
        co_name: courseName,
        te_name: teacherName,
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
            const response = await axios.get(
                `https://24onlinesystem.vercel.app/lessons?ass_id=${ass_id}` // Fetch lessons based on `ass_id`
            );
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setLessonData({
            ...lessonData,
            [e.target.name]: e.target.value,
        });
    };

    const isValidUrl = (url: string) => {
        const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
        return regex.test(url);
    };

    const validateForm = () => {
        const newErrors = {
            title: lessonData.title ? '' : 'عنوان الدرس مطلوب',
            live_link: lessonData.live_link && !isValidUrl(lessonData.live_link) ? 'رابط البث المباشر غير صالح' : '',
            watching_link: lessonData.watching_link && !isValidUrl(lessonData.watching_link) ? 'رابط المشاهدة غير صالح' : '',
            content: '',
            homework: '',
            co_name: lessonData.co_name ? '' : 'اسم الكورس مطلوب',
            te_name: lessonData.te_name ? '' : 'اسم المعلم مطلوب',
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Prepare only the required fields for the PUT/POST request
        const dataToSubmit = {
            le_id: lessonData.le_id, // Include the lesson ID here
            title: lessonData.title,
            content: lessonData.content,
            live_link: lessonData.live_link, // Included live link
            watching_link: lessonData.watching_link, // Included watching link
            homework: lessonData.homework, // Included homework
            co_name: lessonData.co_name, // Include course name
            te_name: lessonData.te_name, // Include teacher name
            date: lessonData.date, // Included date
            ass_id: ass_id, // Include ass_id for course/assignment identification
        };

        setLoading(true);

        try {
            let response;
            if (lessonData.le_id) {
                // Update existing lesson (PUT request)
                response = await axios.put(
                    "https://24onlinesystem.vercel.app/lessons",
                    dataToSubmit,  // Send data with the lesson ID
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else {
                // Create new lesson (POST request)
                response = await axios.post(
                    "https://24onlinesystem.vercel.app/lessons",
                    dataToSubmit,  // Send data with lesson details
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            if (response.status >= 200 && response.status < 300) {
                setSuccessMessage(lessonData.le_id ? "تم تحديث الدرس بنجاح" : "تم إضافة الدرس بنجاح");
                setLessonData({
                    le_id: '',
                    title: '',
                    content: '',
                    live_link: '',
                    watching_link: '',
                    homework: '',
                    co_name: courseName,
                    te_name: teacherName,
                    
                    date: '',
                    created_at: '',
                    updated_at: '',
                });
                fetchLessons(); // Re-fetch lessons after adding or updating
            } else {
                alert(response.data.message || "حدث خطأ أثناء إضافة/تحديث الدرس");
            }
        } catch (error) {
            console.error("Error during request:", error);
            alert("حدث خطأ أثناء إرسال البيانات");
        } finally {
            setLoading(false);
            setIsModalOpen(false); // Close the modal after submitting
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleEdit = (lesson: LessonData) => {
        setLessonData(lesson); // Populate the form with the lesson data
        setIsModalOpen(true); // Open the modal for editing
    };

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("ar-SA", {
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
                {lessons.map((lesson) => {
                    return (
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
                                <p className="text-sm text-gray-500">{lesson.created_at} - تم التحديث في: {lesson.updated_at}</p>

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

                                <button
                                    onClick={() => handleEdit(lesson)}
                                    className="mt-2 text-blue-500 hover:text-blue-700"
                                >
                                    إضافة رابط مشاهدة
                                </button>
                                <button
  onClick={() => window.open("https://docs.google.com/forms", "_blank")}
  className="mt-2 text-white bg-purple-500 hover:bg-purple-700 p-2 rounded"
>
                                    
                              </button>       
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={toggleModal}
                className="mt-4 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded"
            >
                إضافة درس
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg w-full sm:w-11/12 md:w-1/2 lg:w-1/3 xl:w-1/4 max-h-[80vh] overflow-y-auto relative">
                        {/* Close Button */}
                        <button
                            onClick={toggleModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        <h3 className="text-2xl font-semibold mb-4">{lessonData.le_id ? "تعديل الدرس" : "إضافة درس جديد"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Form Inputs */}
                                <div>
                                    <label className="block text-sm text-gray-600">عنوان الدرس</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={lessonData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">رابط البث المباشر</label>
                                    <input
                                        type="text"
                                        name="live_link"
                                        value={lessonData.live_link}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                                    />
                                    {errors.live_link && <p className="text-red-500 text-xs mt-1">{errors.live_link}</p>}
                                </div>

                                {/* Flexbox Layout for Teacher and Course Name */}
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600">اسم الكورس</label>
                                        <input
                                            type="text"
                                            name="co_name"
                                            value={lessonData.co_name}
                                            disabled
                                            className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-gray-200"
                                        />
                                        {errors.co_name && <p className="text-red-500 text-xs mt-1">{errors.co_name}</p>}
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600">اسم المعلم</label>
                                        <input
                                            type="text"
                                            name="te_name"
                                            value={lessonData.te_name}
                                            disabled
                                            className="w-full p-3 mt-2 border border-gray-300 rounded-md bg-gray-200"
                                        />
                                        {errors.te_name && <p className="text-red-500 text-xs mt-1">{errors.te_name}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">المحتوى</label>
                                    <textarea
                                        name="content"
                                        value={lessonData.content}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">رابط المشاهدة</label>
                                    <input
                                        type="text"
                                        name="watching_link"
                                        value={lessonData.watching_link}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">الواجب</label>
                                    <textarea
                                        name="homework"
                                        value={lessonData.homework}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>

                              

                                <div>
                                    <label className="block text-sm text-gray-600">تاريخ الدرس</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={lessonData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-6 w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-700"
                                disabled={loading}
                            >
                                {lessonData.le_id ? "تحديث الدرس" : "إضافة الدرس"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonsTab;
