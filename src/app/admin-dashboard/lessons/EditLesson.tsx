"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import CustomLoader from "@/app/components/spinned";

interface Lesson {
    le_id: string;
    title: string;
    content: string;
    live_link: string;
    watching_link: string;
    homework: string | null;
    created_at: string;
    updated_at: string | null;
    co_name: string;
    te_name: string;
}

const ManageLessons = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axios.get("https://24onlinesystem.vercel.app/lessons");
                if (response.data) {
                    setLessons(response.data);
                }
            } catch (err) {
                setError("فشل في جلب البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const handleEdit = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    const handleDelete = async (lessonId: string) => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الدرس؟")) return;

        setLoading(true);

        try {
            const response = await axios.put(
                `https://24onlinesystem.vercel.app/lessons/id=${lessonId}`
            );

            if (response.status >= 200 && response.status < 300) {
                alert("تم حذف الدرس بنجاح");
                setLessons(lessons.filter((lesson) => lesson.le_id !== lessonId));
            } else {
                alert("فشل في حذف الدرس");
            }
        } catch (error) {
            console.error("Error while deleting lesson:", error);
            alert("حدث خطأ أثناء حذف الدرس");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLesson) return;

        setLoading(true);

        try {
            const response = await axios.put(
                `https://24onlinesystem.vercel.app/lessons`,
                selectedLesson
            );

            if (response.status >= 200 && response.status < 300) {
                alert("تم تحديث الدرس بنجاح");
                setLessons(
                    lessons.map((lesson) =>
                        lesson.le_id === selectedLesson.le_id ? selectedLesson : lesson
                    )
                );
                setIsModalOpen(false);
            } else {
                alert("فشل في تحديث الدرس");
            }
        } catch (error) {
            console.error("Error while updating lesson:", error);
            alert("حدث خطأ أثناء تحديث الدرس");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Ensuring `name` is a valid key of `Lesson`
        if (name in selectedLesson!) {
            setSelectedLesson((prev) => ({ ...prev, [name]: value }));
        }
    };

    if (loading) return <CustomLoader />;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">إدارة الدروس</h3>
            {lessons.length === 0 ? (
                <p className="text-center">لا توجد دروس لعرضها.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <div
                            key={lesson.le_id}
                            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                        >
                            <h4 className="text-xl font-semibold text-[#051568] mb-2">{lesson.title}</h4>
                            <p className="text-gray-600 mb-2">
                                <strong>المعلم:</strong> {lesson.te_name}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>التاريخ:</strong> {new Date(lesson.created_at).toLocaleDateString("ar-EG")}
                            </p>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => handleEdit(lesson)}
                                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(lesson.le_id)}
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedLesson && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                        <h4 className="text-xl font-semibold text-[#051568] mb-4">تعديل الدرس</h4>
                        <form onSubmit={handleSubmit}>
                            {["title", "content", "live_link", "watching_link", "homework"].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label className="block text-[#051568] font-semibold capitalize" htmlFor={field}>
                                        {field.replace("_", " ")}
                                    </label>
                                    {field === "content" ? (
                                        <textarea
                                            id={field}
                                            name={field}
                                            value={selectedLesson[field as keyof Lesson] || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                            rows={4}
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            id={field}
                                            name={field}
                                            value={selectedLesson[field as keyof Lesson] || ""}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="grid grid-cols-2 gap-4">
                                {["co_name", "te_name"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-[#051568] font-semibold capitalize" htmlFor={field}>
                                            {field.replace("_", " ")}
                                        </label>
                                        <input
                                            type="text"
                                            id={field}
                                            name={field}
                                            value={selectedLesson[field as keyof Lesson] || ""}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-2 bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white p-2 rounded-md"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? "جاري التحديث..." : "تحديث الدرس"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageLessons;
