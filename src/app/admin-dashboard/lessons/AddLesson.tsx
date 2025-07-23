import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddLesson = () => {
    const [lessonData, setLessonData] = useState({
        title: '',
        content: '',
        live_link: '',
        watching_link: '',
        homework: '',
        co_name: '',
        te_name: '',
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coAss, setCoAss] = useState<any[]>([]);
    const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);

    // جلب الكورسات والمعلمين
    useEffect(() => {
        const fetchCoursesAndTeachers = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/co_ass');
                setCoAss(response.data);
            } catch (error) {
                alert('حدث خطأ في تحميل الكورسات والمعلمين');
            }
        };

        fetchCoursesAndTeachers();
    }, []);

    // فلترة المعلمين بناءً على الكورس المختار
    useEffect(() => {
        if (lessonData.co_name) {
            const filtered = coAss.filter(item => item.co_name === lessonData.co_name);
            setFilteredTeachers(filtered);
        } else {
            setFilteredTeachers([]);
        }
    }, [lessonData.co_name, coAss]);

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
            content: '', // content ليس مطلوبًا
            homework: '', // الواجب ليس مطلوبًا
            co_name: lessonData.co_name ? '' : 'اسم الكورس مطلوب',
            te_name: lessonData.te_name ? '' : 'اسم المعلم مطلوب',
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // تعريف المتغير dataToSubmit هنا
        const dataToSubmit = {
            title: lessonData.title,
            content: lessonData.content,
            live_link: lessonData.live_link,
            watching_link: lessonData.watching_link,
            homework: lessonData.homework,
            co_name: lessonData.co_name,
            te_name: lessonData.te_name,
        };

        console.log("Data to Submit:", dataToSubmit); // طباعة البيانات للتأكد

        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "https://24onlinesystem.vercel.app/lessons",
                dataToSubmit,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                alert("تم إضافة الدرس بنجاح");
                setLessonData({
                    title: '',
                    content: '',
                    live_link: '',
                    watching_link: '',
                    homework: '',
                    co_name: '',
                    te_name: '',
                });
            } else {
                alert(response.data.message || "حدث خطأ أثناء إضافة الدرس");
            }
        } catch (error) {
            console.error("Error during POST request:", error);  // طباعة تفاصيل الخطأ
            alert("حدث خطأ أثناء إرسال البيانات");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 bg-opacity-50 h-screen">
            <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
                    <h1 className="text-white text-lg font-semibold text-center">
                        إضافة درس جديد
                    </h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Title Field */}
                            <div>
                                <label className="block text-sm text-gray-600">عنوان الدرس</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={lessonData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل عنوان الدرس"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Content Field */}
                            <div>
                                <label className="block text-sm text-gray-600">محتوى الدرس</label>
                                <textarea
                                    name="content"
                                    value={lessonData.content}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل محتوى الدرس (اختياري)"
                                />
                                {errors.content && (
                                    <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                                )}
                            </div>

                            {/* Live Link Field */}
                            <div>
                                <label className="block text-sm text-gray-600">رابط البث المباشر</label>
                                <input
                                    type="text"
                                    name="live_link"
                                    value={lessonData.live_link}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل رابط البث المباشر"
                                />
                                {errors.live_link && (
                                    <p className="text-red-500 text-xs mt-1">{errors.live_link}</p>
                                )}
                            </div>

                            {/* Watching Link Field */}
                            <div>
                                <label className="block text-sm text-gray-600">رابط المشاهدة</label>
                                <input
                                    type="text"
                                    name="watching_link"
                                    value={lessonData.watching_link}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل رابط المشاهدة"
                                />
                                {errors.watching_link && (
                                    <p className="text-red-500 text-xs mt-1">{errors.watching_link}</p>
                                )}
                            </div>

                            {/* Homework Field */}
                            <div>
                                <label className="block text-sm text-gray-600">الواجب</label>
                                <input
                                    type="text"
                                    name="homework"
                                    value={lessonData.homework}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل الواجب (اختياري)"
                                />
                                {errors.homework && (
                                    <p className="text-red-500 text-xs mt-1">{errors.homework}</p>
                                )}
                            </div>

                            {/* Course Name Field (Dropdown) */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم الكورس</label>
                                <select
                                    name="co_name"
                                    value={lessonData.co_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                >
                                    <option value="">اختر الكورس</option>
                                    {coAss.map((item, index) => (
                                        <option key={`${item.co_name}-${index}`} value={item.co_name}>
                                            {item.co_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.co_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.co_name}</p>
                                )}
                            </div>

                            {/* Teacher Name Field (Dropdown) */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم المعلم</label>
                                <select
                                    name="te_name"
                                    value={lessonData.te_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                >
                                    <option value="">اختر المعلم</option>
                                    {filteredTeachers.map((item, index) => (
                                        <option key={`${item.te_name}-${index}`} value={item.te_name}>
                                            {item.te_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.te_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.te_name}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        "إضافة الدرس"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLesson;
