"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";

interface GradeData {
    stu_id: string;
    name_stu: string;
    email: string;
    type: string;
    state: string;
    score: string;
    pass_score: number;
    max_score: number;
    co_name: string;
    created_at: string;
}

interface AddGradeForm {
    stu_id: string;
    ass_id: string;
    type: string;
    score: string;
    pass_score: string;
    max_score: string;
}

interface FinalGradeForm {
    co_stu_id: string;
    total_grade: string;
}

interface EditGradeForm {
    stu_id: string;
    ass_id: string;
    type: string;
    score: string;
    pass_score: string;
    max_score: string;
}

interface GradesTabProps {
    ass_id: string;
}

const GradesTab: React.FC<GradesTabProps> = ({ ass_id }) => {
    const [grades, setGrades]             = useState<GradeData[]>([]);
    const [loading, setLoading]           = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [showAddModal, setShowAddModal]     = useState<boolean>(false);
    const [showFinalModal, setShowFinalModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal]   = useState<boolean>(false);

    const [addForm, setAddForm] = useState<AddGradeForm>({
        stu_id: "", ass_id, type: "", score: "", pass_score: "", max_score: "",
    });

    const [finalForm, setFinalForm] = useState<FinalGradeForm>({
        co_stu_id: "", total_grade: "",
    });

    const [editForm, setEditForm] = useState<EditGradeForm>({
        stu_id: "", ass_id, type: "", score: "", pass_score: "", max_score: "",
    });

    const fetchGrades = async (): Promise<void> => {
        setLoading(true);
        try {
            const response = await axios.get<GradeData[]>(
                `https://24onlinesystem.vercel.app/grades?ass_id=${ass_id}`
            );
            setGrades(response.data?.length > 0 ? response.data : []);
            setErrorMessage(null);
        } catch {
            setErrorMessage("فشل تحميل الدرجات. حاول مرة أخرى.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGrades(); }, [ass_id]);

    const handleAdd = async (): Promise<void> => {
        if (parseFloat(addForm.score) > parseFloat(addForm.max_score)) {
            setErrorMessage("الدرجة لا يمكن أن تتجاوز الدرجة العظمى.");
            return;
        }
        try {
            await axios.post("https://24onlinesystem.vercel.app/grades", {
                ...addForm,
                score:      parseFloat(addForm.score),
                pass_score: parseFloat(addForm.pass_score),
                max_score:  parseFloat(addForm.max_score),
            });
            setSuccessMessage("تمت إضافة الدرجة بنجاح.");
            setShowAddModal(false);
            setAddForm({ stu_id: "", ass_id, type: "", score: "", pass_score: "", max_score: "" });
            fetchGrades();
        } catch {
            setErrorMessage("فشل إضافة الدرجة.");
        }
    };

    const handleFinal = async (): Promise<void> => {
        try {
            await axios.put(
                "https://24onlinesystem.vercel.app/course_students",
                finalForm
            );
            setSuccessMessage("تمت إضافة الدرجة النهائية بنجاح.");
            setShowFinalModal(false);
            setFinalForm({ co_stu_id: "", total_grade: "" });
            fetchGrades();
        } catch {
            setErrorMessage("فشل إضافة الدرجة النهائية.");
        }
    };

    const handleEditOpen = (grade: GradeData): void => {
        setEditForm({
            stu_id:     grade.stu_id,
            ass_id,
            type:       grade.type,
            score:      grade.score,
            pass_score: String(grade.pass_score),
            max_score:  String(grade.max_score),
        });
        setShowEditModal(true);
    };

    const handleEdit = async (): Promise<void> => {
        try {
            await axios.put("https://24onlinesystem.vercel.app/grades", {
                ...editForm,
                score:      parseFloat(editForm.score),
                pass_score: parseFloat(editForm.pass_score),
                max_score:  parseFloat(editForm.max_score),
            });
            setSuccessMessage("تم تعديل الدرجة بنجاح.");
            setShowEditModal(false);
            fetchGrades();
        } catch {
            setErrorMessage("فشل تعديل الدرجة.");
        }
    };

    const scores: number[] = grades
        .map((g) => parseFloat(g.score))
        .filter((s) => !isNaN(s));

    const avg: number     = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highest: number = scores.length > 0 ? Math.max(...scores) : 0;
    const lowest: number  = scores.length > 0 ? Math.min(...scores) : 0;
    const passCount: number = grades.filter((g) => g.state === "ناجح").length;
    const passRate: number  = grades.length > 0 ? Math.round((passCount / grades.length) * 100) : 0;

    if (loading) return <CustomLoader />;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-semibold text-gray-800">درجات الطلاب</h3>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-[#006F88] text-white px-5 py-2 rounded-lg hover:bg-[#005a70] transition"
                    >
                        + إضافة درجة
                    </button>
                    <button
                        onClick={() => setShowFinalModal(true)}
                        className="bg-[#051568] text-white px-5 py-2 rounded-lg hover:bg-[#03103f] transition"
                    >
                        + الدرجة النهائية
                    </button>
                </div>
            </div>

            {/* Aggregate Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#051568] text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{avg}</p>
                    <p className="text-sm mt-1">متوسط الدرجات</p>
                </div>
                <div className="bg-green-600 text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{highest}</p>
                    <p className="text-sm mt-1">أعلى درجة</p>
                </div>
                <div className="bg-red-500 text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{lowest}</p>
                    <p className="text-sm mt-1">أدنى درجة</p>
                </div>
                <div className="bg-[#006F88] text-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{passRate}%</p>
                    <p className="text-sm mt-1">نسبة النجاح</p>
                    <div className="mt-2 bg-white/30 rounded-full h-2">
                        <div
                            className="bg-white rounded-full h-2 transition-all"
                            style={{ width: `${passRate}%` }}
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
                            <th className="py-4 px-6 text-center">نوع الامتحان</th>
                            <th className="py-4 px-6 text-center">الدرجة</th>
                            <th className="py-4 px-6 text-center">أعلى درجة</th>
                            <th className="py-4 px-6 text-center">درجة النجاح</th>
                            <th className="py-4 px-6 text-center">التقدم</th>
                            <th className="py-4 px-6 text-center">الحالة</th>
                            <th className="py-4 px-6 text-center">تعديل</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.length > 0 ? (
                            grades.map((grade, index) => {
                                const pct: number = Math.round(
                                    (parseFloat(grade.score) / grade.max_score) * 100
                                );
                                return (
                                    <tr
                                        key={`${grade.stu_id}-${grade.type}-${index}`}
                                        className={`${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        } hover:bg-indigo-100 transition-all duration-300 ease-in-out`}
                                    >
                                        <td className="py-4 px-6 text-center">{grade.name_stu}</td>
                                        <td className="py-4 px-6 text-center">{grade.email}</td>
                                        <td className="py-4 px-6 text-center">{grade.type}</td>
                                        <td className="py-4 px-6 text-center">{grade.score}</td>
                                        <td className="py-4 px-6 text-center">{grade.max_score}</td>
                                        <td className="py-4 px-6 text-center">{grade.pass_score}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-[#006F88] rounded-full h-2 transition-all"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-600 w-10">{pct}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                grade.state === "ناجح"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                                {grade.state}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleEditOpen(grade)}
                                                className="text-[#006F88] hover:text-[#051568] font-semibold underline text-sm"
                                            >
                                                تعديل
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={9} className="py-4 px-6 text-center text-gray-500">
                                    لا توجد بيانات
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Grade Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
                        <h4 className="text-xl font-bold text-gray-800 mb-6">إضافة درجة</h4>
                        <div className="space-y-4">
                            {(
                                [
                                    { label: "رقم الطالب (stu_id)", key: "stu_id",     type: "text"   },
                                    { label: "نوع الامتحان",         key: "type",       type: "text"   },
                                    { label: "الدرجة",               key: "score",      type: "number" },
                                    { label: "درجة النجاح",          key: "pass_score", type: "number" },
                                    { label: "الدرجة العظمى",        key: "max_score",  type: "number" },
                                ] as { label: string; key: keyof AddGradeForm; type: string }[]
                            ).map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                        value={addForm[key]}
                                        onChange={(e) => setAddForm({ ...addForm, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
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

            {/* Final Grade Modal */}
            {showFinalModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
                        <h4 className="text-xl font-bold text-gray-800 mb-6">إضافة الدرجة النهائية</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    رقم تسجيل الطالب (co_stu_id)
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={finalForm.co_stu_id}
                                    onChange={(e) => setFinalForm({ ...finalForm, co_stu_id: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    الدرجة النهائية
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                    value={finalForm.total_grade}
                                    onChange={(e) => setFinalForm({ ...finalForm, total_grade: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleFinal}
                                className="flex-1 bg-[#051568] text-white py-2 rounded-lg hover:bg-[#03103f] transition font-semibold"
                            >
                                حفظ
                            </button>
                            <button
                                onClick={() => setShowFinalModal(false)}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Grade Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
                        <h4 className="text-xl font-bold text-gray-800 mb-6">تعديل الدرجة</h4>
                        <div className="space-y-4">
                            {(
                                [
                                    { label: "نوع الامتحان",  key: "type",       type: "text"   },
                                    { label: "الدرجة",        key: "score",      type: "number" },
                                    { label: "درجة النجاح",   key: "pass_score", type: "number" },
                                    { label: "الدرجة العظمى", key: "max_score",  type: "number" },
                                ] as { label: string; key: keyof EditGradeForm; type: string }[]
                            ).map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <input
                                        type={type}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006F88]"
                                        value={editForm[key]}
                                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
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

export default GradesTab;
