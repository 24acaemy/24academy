import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";

interface GradeData {
    stu_id: string;
    stu_name: string;
    stu_email: string;
    type: string;
    state: string;
    score: string;
    pass_score: string;
    max_score: string;
    co_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
    te_name: string;
    created_at: string;
}

interface StudentData {
    stu_id: string;
    stu_name: string;
    email: string;
    co_name: string;
    te_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
    total_grade: string | null;
    ass_id: string;
    created_at: string;
}

interface GradesTabProps {
    ass_id: string;
}

const GradesTab: React.FC<GradesTabProps> = ({ ass_id }) => {
    const [mergedData, setMergedData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null); // Track expanded student

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsResponse, gradesResponse] = await Promise.all([
                    axios.get<StudentData[]>(`https://24onlinesystem.vercel.app/course_students/ass_id=${ass_id}`),
                    axios.get<GradeData[]>(`https://24onlinesystem.vercel.app/grades?ass_id=${ass_id}`)
                ]);

                // Group grades by student ID
                const gradesGrouped = gradesResponse.data.reduce((acc, grade) => {
                    if (!acc[grade.stu_id]) {
                        acc[grade.stu_id] = [];
                    }
                    acc[grade.stu_id].push(grade);
                    return acc;
                }, {});

                // Merge student data with their corresponding grades
                const merged = studentsResponse.data.map(student => {
                    const grades = gradesGrouped[student.stu_id] || [];
                    return {
                        stu_name: student.stu_name,
                        stu_email: student.email,
                        grades: grades.map(grade => ({
                            type: grade.type,
                            state: grade.state,
                            score: grade.score,
                            pass_score: grade.pass_score,
                            max_score: grade.max_score,
                        }))
                    };
                });

                setMergedData(merged);
            } catch (error) {
                setErrorMessage("Error fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ass_id]);

    const toggleStudentGrades = (stu_id: string) => {
        setExpandedStudent(expandedStudent === stu_id ? null : stu_id);
    };

    if (loading) return <CustomLoader />;
    if (errorMessage) return <div className="text-center text-red-500">{errorMessage}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">الدرجات للمهمة</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full table-auto">
                    <thead className="bg-[#051568] text-white">
                        <tr>
                            <th className="py-4 px-6 text-center">الاسم</th>
                            <th className="py-4 px-6 text-center">البريد الإلكتروني</th>
                            <th className="py-4 px-6 text-center">الاختبارات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedData.map((row, index) => (
                            <React.Fragment key={index}>
                                <tr
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-100 cursor-pointer`}
                                    onClick={() => toggleStudentGrades(row.stu_email)} // Toggle grades visibility
                                >
                                    <td className="py-4 px-6 text-center">{row.stu_name}</td>
                                    <td className="py-4 px-6 text-center">{row.stu_email}</td>
                                    <td className="py-4 px-6 text-center">
                                        {row.grades.length === 0 ? "-" : "عرض الدرجات"}
                                    </td>
                                </tr>

                                {/* Expandable Row for grades */}
                                {expandedStudent === row.stu_email && (
                                    <tr className="bg-gray-100">
                                        <td colSpan={3} className="py-4 px-6">
                                            <div className="space-y-4">
                                                {row.grades.map((grade, idx) => (
                                                    <div key={idx} className="border p-4 rounded-md">
                                                        <div><strong>نوع الاختبار:</strong> {grade.type}</div>
                                                        <div><strong>الحالة:</strong> {grade.state}</div>
                                                        <div><strong>الدرجة:</strong> {grade.score}</div>
                                                        <div><strong>الدرجة المطلوبة:</strong> {grade.pass_score}</div>
                                                        <div><strong>الدرجة القصوى:</strong> {grade.max_score}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GradesTab;
