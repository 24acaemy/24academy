"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import CustomLoader from "@/app/components/spinned";

interface Assignment {
    ass_id: string;
    te_name: string;
    co_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string | null;
}

const ManageAssignments = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get("https://24onlinesystem.vercel.app/co_ass");
                if (response.data) {
                    setAssignments(response.data);
                }
            } catch {
                setError("فشل في جلب البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const handleEdit = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsModalOpen(true);
    };

    const handleDelete = async (assignmentId: string) => {
        if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا التعيين؟")) return;

        setLoading(true);
        try {
            await axios.put(`https://24onlinesystem.vercel.app/co_ass/${assignmentId}`);
            setAssignments(assignments.filter((assignment) => assignment.ass_id !== assignmentId));
            alert("تم حذف التعيين بنجاح");
        } catch {
            alert("فشل في حذف التعيين");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAssignment) return;

        setLoading(true);

        try {
            const response = await axios.put(`https://24onlinesystem.vercel.app/co_ass`, {
                ass_id: selectedAssignment.ass_id,
                te_name: selectedAssignment.te_name,
                co_name: selectedAssignment.co_name,
                start_time: selectedAssignment.start_time,
                start_date: selectedAssignment.start_date,
                end_date: selectedAssignment.end_date
            });

            if (response.status >= 200 && response.status < 300) {
                alert("تم تحديث التعيين بنجاح");
                setAssignments(assignments.map((assignment) => (assignment.ass_id === selectedAssignment.ass_id ? selectedAssignment : assignment)));
                setIsModalOpen(false);
            } else {
                alert("فشل في تحديث التعيين");
            }
        } catch {
            alert("حدث خطأ أثناء تحديث التعيين");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedAssignment((prev) =>
            prev ? { ...prev, [name]: value } : prev
        );
    };

    if (loading) return <CustomLoader />;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">إدارة التعيينات</h3>
            {assignments.length === 0 ? (
                <p className="text-center">لا توجد تعيينات لعرضها.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.ass_id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105">
                            <h4 className="text-xl font-semibold text-[#051568] mb-2">{assignment.co_name}</h4>
                            <p className="text-gray-600 mb-2"><strong>المعلم:</strong> {assignment.te_name}</p>
                            <p className="text-gray-600 mb-2"><strong>تاريخ البداية:</strong> {new Date(assignment.start_date).toLocaleDateString("ar-EG")}</p>
                            <div className="flex justify-between items-center mt-4">
                                <button onClick={() => handleEdit(assignment)} className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(assignment.ass_id)} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && selectedAssignment && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                        <h4 className="text-xl font-semibold text-[#051568] mb-4">تعديل التعيين</h4>
                        <form onSubmit={handleSubmit}>
                            {["te_name", "co_name", "start_time", "start_date", "end_date"].map((field) => (
                                <div className="mb-4" key={field}>
                                    <label className="block text-[#051568] font-semibold capitalize" htmlFor={field}>
                                        {field.replace("_", " ")}
                                    </label>
                                    {field === "start_date" || field === "end_date" ? (
                                        <input
                                            type="date"
                                            id={field}
                                            name={field}
                                            value={selectedAssignment[field as keyof Assignment] || ""}  // Default empty string if null
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                        />
                                    ) : field === "start_time" || field === "end_time" ? (
                                        <input
                                            type="time"
                                            id={field}
                                            name={field}
                                            value={selectedAssignment[field as keyof Assignment] || ""}  // Default empty string if null
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            id={field}
                                            name={field}
                                            value={selectedAssignment[field as keyof Assignment] || ""}  // Default empty string if null
                                            onChange={handleInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-2"
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded-md">
                                    إلغاء
                                </button>
                                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
                                    {loading ? "جاري التحديث..." : "تحديث التعيين"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAssignments;
