"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface Teacher {
    te_name: string;
}

interface Course {
    co_name: string;
}

interface ErrorResponse {
    message: string;
}

const AddAssignment = () => {
    const [assignmentData, setAssignmentData] = useState({
        te_name: "",
        co_name: "",
        start_time: "",
        start_date: "",
        end_date: "",
    });

    const [errors, setErrors] = useState({
        te_name: "",
        co_name: "",
        start_time: "",
        start_date: "",
        end_date: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    // Fetch teachers and courses from their respective endpoints
    useEffect(() => {
        const fetchTeachersAndCourses = async () => {
            try {
                const teacherResponse = await axios.get<Teacher[]>("https://24onlinesystem.vercel.app/teachers");
                setTeachers(teacherResponse.data);

                const courseResponse = await axios.get<Course[]>("https://24onlinesystem.vercel.app/courses");
                setCourses(courseResponse.data);
            } catch (error) {
                alert("حدث خطأ في تحميل المعلمين أو الدورات");
            }
        };

        fetchTeachersAndCourses();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setAssignmentData({
            ...assignmentData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const newErrors = {
            te_name: assignmentData.te_name ? "" : "اسم المعلم مطلوب",
            co_name: assignmentData.co_name ? "" : "اسم الدورة مطلوب",
            start_time: assignmentData.start_time ? "" : "وقت البداية مطلوب",
            start_date: assignmentData.start_date ? "" : "تاريخ البداية مطلوب",
            end_date: assignmentData.end_date ? "" : "تاريخ النهاية مطلوب",
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === "");
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        const dataToSubmit = {
            te_name: assignmentData.te_name,
            co_name: assignmentData.co_name,
            start_time: assignmentData.start_time,
            start_date: assignmentData.start_date,
            end_date: assignmentData.end_date,
        };

        try {
            // Step 1: Post assignment data to the backend
            const response = await axios.post(
                "https://24onlinesystem.vercel.app/co_ass",
                dataToSubmit,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                alert("تم إضافة التعيين بنجاح");

                // Step 2: Prepare the data for email
                const emailData = {
                    name: assignmentData.te_name,   // Teacher's name
                    email: "",  // You may need to fetch the teacher's email, assuming it's part of the data
                    course: assignmentData.co_name, // Course name
                    start_time: assignmentData.start_time,
                    start_date: assignmentData.start_date,
                    end_date: assignmentData.end_date,
                };

                // Step 3: Send email to the teacher about the new assignment
                try {
                    const emailResponse = await axios.post(
                        "https://24onlinesystem.vercel.app/co_ass/sendemail",
                        emailData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (emailResponse.status === 200) {
                        alert("تم إرسال البريد الإلكتروني بنجاح!");
                    }
                } catch (emailError) {
                    console.error("Error sending email:", emailError);
                    alert("حدث خطأ أثناء إرسال البريد الإلكتروني");
                }

                // Reset the form
                setAssignmentData({
                    te_name: "",
                    co_name: "",
                    start_time: "",
                    start_date: "",
                    end_date: "",
                });
            } else {
                alert(response.data.message || "حدث خطأ أثناء إضافة التعيين");
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError<ErrorResponse>;

            if (axiosError.response) {
                alert(
                    `حدث خطأ في الخادم: ${axiosError.response.data.message || "يرجى المحاولة لاحقًا"
                    }`
                );
            } else if (axiosError.request) {
                alert("حدث خطأ في الاتصال بالخادم");
            } else {
                alert("حدث خطأ أثناء إرسال البيانات");
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <section className="bg-gray-100 bg-opacity-50 h-screen">
            <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
                    <h1 className="text-white text-lg font-semibold text-center">
                        إضافة تعيين جديد
                    </h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Teacher Name Field */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم المعلم</label>
                                <select
                                    name="te_name"
                                    value={assignmentData.te_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                >
                                    <option value="">اختر المعلم</option>
                                    {teachers.map((teacher, index) => (
                                        <option key={index} value={teacher.te_name}>
                                            {teacher.te_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.te_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.te_name}</p>
                                )}
                            </div>

                            {/* Course Field */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم الدورة</label>
                                <select
                                    name="co_name"
                                    value={assignmentData.co_name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                >
                                    <option value="">اختر الدورة</option>
                                    {courses.map((course, index) => (
                                        <option key={index} value={course.co_name}>
                                            {course.co_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.co_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.co_name}</p>
                                )}
                            </div>

                            {/* Time Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">وقت البداية</label>
                                    <input
                                        type="time"
                                        name="start_time"
                                        value={assignmentData.start_time}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    />
                                    {errors.start_time && (
                                        <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
                                    )}
                                </div>
                            </div>

                            {/* Date Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">تاريخ البداية</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={assignmentData.start_date}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">تاريخ النهاية</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={assignmentData.end_date}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    />
                                    {errors.end_date && (
                                        <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    ) : (
                                        "إضافة تعيين"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddAssignment;
