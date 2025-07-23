"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CourseStudent {
    stu_id: string;
    stu_name: string;
    stu_email: string;
    co_name: string;
    te_name: string;
    te_email: string;
    start_time: string;
    start_date: string;
    end_date: string;
    total_grade: string;
}

const ViewCourseStudents = () => {
    const [courseStudents, setCourseStudents] = useState<CourseStudent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourseStudents = async () => {
        try {
            const response = await axios.get('https://24onlinesystem.vercel.app/course_students');
            if (response.data) {
                setCourseStudents(response.data);
            }
        } catch {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseStudents();
    }, []);

    const handleDelete = (stuId: string) => {
        if (!window.confirm("لا يمكنك الحذف")) return;

        setLoading(true);

        axios.put(`https://24onlinesystem.vercel.app/course_students/${stuId}`)
            .then(() => {
                setCourseStudents(prevStudents => prevStudents.filter(student => student.stu_id !== stuId));
                toast.success("Student deleted successfully!");
            })
            .catch((error) => {
                console.error("Error while deleting student:", error);
                toast.error("Error while deleting student");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading && !error) return <CustomLoader />;
    if (error) return (
        <div className="text-center">
            <p className="text-red-500">{error}</p>
            <button
                onClick={fetchCourseStudents}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">عرض الطلاب المنضمين للدورات</h3>
            {courseStudents.length === 0 ? (
                <p className="text-center">لا يوجد طلاب للعرض.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courseStudents.map((student, index) => (
                        <div
                            key={`${student.stu_id}-${student.co_name}-${index}`}  // Ensure unique key by combining stu_id, co_name, and index
                            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
                        >
                            <h4 className="text-xl font-semibold text-[#051568] mb-2">{student.stu_name}</h4>
                            <p className="text-gray-600 mb-2"><strong>المدرس:</strong> {student.te_name}</p>
                            <p className="text-gray-600 mb-2"><strong>البريد الإلكتروني للطالب:</strong> {student.stu_email}</p>
                            <p className="text-gray-600 mb-2"><strong>بريد المدرس الإلكتروني:</strong> {student.te_email}</p>
                            <p className="text-gray-600 mb-2"><strong>وقت بداية الدورة:</strong> {student.start_time}</p>
                            <p className="text-gray-600 mb-2"><strong>تاريخ البداية:</strong> {new Date(student.start_date).toLocaleDateString("ar-EG")}</p>
                            <p className="text-gray-600 mb-2"><strong>تاريخ النهاية:</strong> {new Date(student.end_date).toLocaleDateString("ar-EG")}</p>
                            <p className="text-gray-600 mb-2"><strong>الدرجة الإجمالية:</strong> {student.total_grade}</p>
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={() => alert("لا يمكنك التعديل البيانات!")}
                                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(student.stu_id)}
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewCourseStudents;
