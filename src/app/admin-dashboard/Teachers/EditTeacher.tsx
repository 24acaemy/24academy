"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

// Define the Teacher interface to type the teachers state properly
interface Teacher {
    te_id: string;
    te_name: string;
    specialization: string;
    email: string;
}

const ViewTeachers = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]); // Use the Teacher type here
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch teacher data from the API
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('https://24onlinesystem.vercel.app/teachers');
                if (response.data && response.data.length > 0) {
                    setTeachers(response.data); // Store the data if it exists
                } else {
                    setTeachers([]); // Clear the list if no data
                }
            } catch (err) {
                setError('فشل في جلب البيانات'); // Set error if fetching fails
            }
        };

        fetchTeachers();
    }, []);

    // Handle teacher deletion
    const handleDelete = async (teacherId: string) => {
        if (!window.confirm('هل أنت متأكد أنك تريد حذف هذا المعلم؟')) {
            return;
        }

        setLoading(true); // Set loading state while deleting
        try {
            const response = await fetch(`https://24onlinesystem.vercel.app/teachers/${teacherId}`, {
                method: 'PUT',
            });

            if (response.ok) {
                setTeachers(teachers.filter(teacher => teacher.te_id !== teacherId)); // Remove deleted teacher
                alert('تم حذف المعلم بنجاح');
            } else {
                alert('حدث خطأ أثناء حذف المعلم');
            }
        } catch {
            alert('حدث خطأ في الاتصال بالخادم'); // Handle connection errors
        } finally {
            setLoading(false); // Stop loading state after the operation
        }
    };

    // Render error message if there's an error
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">قائمة المعلمين</h3>
            {teachers.length === 0 ? (
                <p className="text-center">لا توجد بيانات لعرضها.</p> // If no teachers are available
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                        <div key={teacher.te_id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
                            <h4 className="text-xl font-semibold text-[#051568] mb-2">{teacher.te_name}</h4>
                            <p className="text-gray-600 mb-2"><strong>التخصص:</strong> {teacher.specialization}</p>
                            <p className="text-gray-600 mb-2"><strong>البريد الإلكتروني:</strong> {teacher.email}</p>
                            <p className="text-gray-600 mb-4"><strong>رقم المعلم:</strong> {teacher.te_id}</p>

                            <button
                                onClick={() => handleDelete(teacher.te_id)}
                                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                                disabled={loading} // Disable the button while loading
                            >
                                {loading ? 'جاري الحذف...' : <><FaTrashAlt /> حذف</>}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewTeachers;
