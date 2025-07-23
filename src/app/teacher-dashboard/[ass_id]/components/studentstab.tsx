import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";

interface StudentData {
    stu_id: string;
    stu_name: string;
    stu_email: string;
    total_grade: string | null;
}

interface StudentsTabProps {
    ass_id: string;
}

const StudentsTab: React.FC<StudentsTabProps> = ({ ass_id }) => {
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(
                    `https://24onlinesystem.vercel.app/course_students/ass_id=${ass_id}`
                );
                if (response.data && response.data.length > 0) {
                    setStudents(response.data);
                    setErrorMessage(null);  // Reset error message if data is available
                } else {
                    setStudents([]);  // Ensure students is set to an empty array
                    setErrorMessage("No students found for this course.");  // Display a message if no data
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setErrorMessage("Failed to fetch students. Please try again.");
            }
        };

        fetchStudents();
    }, [ass_id]);

    if (loading) return <CustomLoader />;

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">
                الطلاب المنضمين الى الدورة
            </h3>
            {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full table-auto">
                    <thead className="bg-[#051568] text-white">
                        <tr>
                            <th className="py-4 px-6 text-center">الاسم</th>
                            <th className="py-4 px-6 text-center">البريد الإلكتروني</th>
                            <th className="py-4 px-6 text-center">الدرجة الإجمالية</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr
                                    key={student.stu_id}
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        } hover:bg-indigo-100 transition-all duration-300 ease-in-out`}>
                                    <td className="py-4 px-6">{student.stu_name}</td>
                                    <td className="py-4 px-6">{student.stu_email}</td>
                                    <td className="py-4 px-6 text-right">
                                        {student.total_grade ? student.total_grade : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-4 px-6 text-center text-gray-500">
                                    لا توجد بيانات
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentsTab;
