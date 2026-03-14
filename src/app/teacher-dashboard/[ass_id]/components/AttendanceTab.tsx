"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";

interface AttendanceData {
    stu_id: string;
    name_stu: string;
    email: string;
    date: string;
    attendance: string;
    title: string;
    co_name: string;
    start_time: string;
    name_te: string;
    te_email: string;
    created_at: string;
}

interface AddForm {
    stu_id: string;
    ass_id: string;
    attendance: string;
    date: string;
}

interface EditForm {
    stu_id: string;
    ass_id: string;
    attendance: string;
    date: string;
}

interface AttendanceTabProps {
    ass_id: string;
}

const ATTENDANCE_OPTIONS: string[] = ["حاضر", "غائب"];

const AttendanceTab: React.FC<AttendanceTabProps> = ({ ass_id }) => {
    const [records, setRecords]               = useState<AttendanceData[]>([]);
    const [loading, setLoading]               = useState<boolean>(true);
    const [errorMessage, setErrorMessage]     = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [addForm, setAddForm]           = useState<AddForm>({
        stu_id: "", ass_id, attendance: "حاضر", date: "",
    });

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editForm, setEditForm]           = useState<EditForm>({
        stu_id: "", ass_id, attendance: "حاضر", date: "",
    });

    const fetchAttendance = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get<AttendanceData[]>(
                `https://24onlinesystem.vercel.app/attendance?ass_id=${ass_id}`
            );
            setRecords(response.data?.length > 0 ? response.data : []);
            setErrorMessage(null);
        } catch {
            setErrorMessage("فشل تحميل بيانات الحضور. حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAttendance(); }, [ass_id]);

    const handleAdd = async (): Promise<void> => {
        try {
            await axios.post("https://24onlinesystem.vercel.app/attendance", addForm);
            setSuccessMessage("تمت إضافة سجل الحضور بنجاح.");
            setShowAddModal(false);
            setAddForm({ stu_id: "", ass_id, attendance: "حاضر", date: "" });
            fetchAttendance();
        } catch {
            setErrorMessage("فشل إضافة سجل الحضور.");
        }
    };

    const handleEditOpen = (record: AttendanceData): void => {
        setEditForm({
            stu_id: record.stu_id,
            ass_id,
            attendance: record.attendance,
            date: record.date,
        });
        setShowEditModal(true);
    };

    const handleEdit = async (): Promise<void> => {
        try {
            await axios.put("https://24onlinesystem.vercel.app/attendance", editForm);
            setSuccessMessage("تم تعديل سجل الحضور بنجاح.");
            setShowEditModal(false);
            fetchAttendance();
        } catch {
            setErrorMessage("فشل تعديل سجل الحضور.");
        }
    };

    const present: number    = records.filter((r) => r.attendance === "حاضر").length;
    const absent: number     = records.filter((r) => r.attendance === "غائب").length;
    const total: number      = records.length;
    const percentage: number = total > 0 ? Math.round((present / total) * 100) : 0;

    if (loading) return <CustomLoader />;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-semibold text-gray-800">سجل الحضور</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#006F88] text-white px-5 py-2 rounded-lg hover:bg-[#005a70] transition"
                >
                    + إضافة حضور
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#051568] text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{total}</p>
                    <p className="text-sm mt-1">إجمالي السجلات</p>
                </div>
                <div className="bg-green-600 text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{present}</p>
                    <p className="text-sm mt-1">حاضر</p>
                </div>
                <div className="bg-red-500 text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{absent}</p>
                    <p className="text-sm mt-1">غائب</p>
                </div>
                <div className="bg-[#006F88] text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{percentage}%</p>
                    <p className="text-sm mt-1">نسبة الحضور</p>
                    <div className="mt-2 bg-white/30 rounded-full h-2">
                        <div
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="text-green-600 mb-4 bg-green-50 p-3 rounded-lg">{successMessage}</div>
            )}
            {errorMessage && (
                <div className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg">{errorMessage}</div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full table-auto">
                    <thead className="bg-[#051568] text-white">
                        <tr>
                            <th className="py-4 px-6 text-center">اسم الطالب</th>
                            <th className="py-4 px-6 text-center">البريد الإلكتروني</th>
                            <th className="py-4 px-6 text-center">الدرس</th>
                            <th className="py-4 px-6 text-center">التاريخ</th>
                            <th className="py-4 px-6 text-center">الوقت</th>
                            <th className="py-4 px-6 text-center">الحالة</th>
                            <th className="py-4 px-6 text-center">تعديل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <tr
                                    key={`${record.stu_id}-${record.date}-${index}`}
                                    className={`${
                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } hover:bg-indigo-100 transition-all duration-300 ease-in-out`}
                                >
                                    <td className="py-4 px-6 text-center">{record.name_stu}</td>
                                    <td className="py-4 px-6 text-center">{record.email}</td>
                                    <td className="py-4 px-6 text-center">{record.title}</td>
                                    <td className="py-4 px-6 text-center">{record.date}</td>
                                    <td className="py-4 px-6 text-center">{record.start_time}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            record.attendance === "حاضر"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                            {record.attendance}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => handleEditOpen(record)}
                                            className="text-[#006F88] hover:text-[#051568] font-semibold underline text-sm"
                                        >
                                            تعديل
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-4 px-6 text-center text-gray-500">
                                    لا توجد بيانات
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
                        <h4 className="text-xl font-bold text-gray-800 mb-6">إضافة سجل حضور</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    رقم الطالب (stu_id)
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={addForm.stu_id}
                                    onChange={(e) => setAddForm({ ...addForm, stu_id: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    التاريخ
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={addForm.date}
                                    onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الحالة
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={addForm.attendance}
                                    onChange={(e) => setAddForm({ ...addForm, attendance: e.target.value })}
                                >
                                    {ATTENDANCE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-[#006F88] text-white py-2 rounded-lg hover:bg-[#005a70] transition font-semibold"
                            >
                                حفظ
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
                        <h4 className="text-xl font-bold text-gray-800 mb-6">تعديل سجل الحضور</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    التاريخ
                                </label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={editForm.date}
                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الحالة
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={editForm.attendance}
                                    onChange={(e) => setEditForm({ ...editForm, attendance: e.target.value })}
                                >
                                    {ATTENDANCE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleEdit}
                                className="flex-1 bg-[#006F88] text-white py-2 rounded-lg hover:bg-[#005a70] transition font-semibold"
                            >
                                تحديث
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceTab;
