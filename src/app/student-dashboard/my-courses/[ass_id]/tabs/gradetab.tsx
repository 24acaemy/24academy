import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaUser, FaFileAlt, FaCheckCircle, FaTimesCircle, FaChalkboardTeacher } from "react-icons/fa";
import CustomLoader from "@/app/components/spinned";

interface GradeData {
    stu_id: string;
    stu_name: string;
    email: string;
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

interface GradesTabProps {
    ass_id: string; // Add ass_id here to identify the course/assignment
}

const GradesTab: React.FC<GradesTabProps> = ({ ass_id }) => {
    const [grades, setGrades] = useState<GradeData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [serverMessage, setServerMessage] = useState<string | null>(null); // State to hold server message

    const fetchGrades = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://24onlinesystem.vercel.app/grades?ass_id=${ass_id}`);

            if (Array.isArray(response.data)) {
                setGrades(response.data);
            } else {
                setGrades([]); // Reset grades if no valid data
                setServerMessage("لا توجد درجات لهذا المعرف الدراسي");
            }
        } catch (error) {
            setLoading(false); // End loading immediately upon error

            if (axios.isAxiosError(error)) {
                // Handle axios-specific errors
                if (error.response) {
                    if (error.response.status === 400) {
                        // If error status is 400, show a table with "No marks available"
                        setError(null); // Clear the error message, as we're showing a different table for 400
                        setServerMessage(null); // Clear any server message
                    } else {
                        setError(`Error: ${error.response.status} - ${error.response.data}`);
                    }
                } else {
                    setError('Network Error. Please check your connection.');
                }
            } else {
                // General error fallback
                setError('An unknown error occurred.');
            }

            setServerMessage(null); // Clear any server messages on error
        }
    }, [ass_id]);

    useEffect(() => {
        fetchGrades();
    }, [fetchGrades]);

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) return <CustomLoader />;

    // If error status is 400, show a table with student names and no marks available
    if (error && error.includes("400")) {
        return (
            <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">لا توجد درجات حالياً</h3>
                <p>لا توجد درجات متاحة لعرضها في الوقت الحالي.</p>
                <table className="min-w-full mt-4 table-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-left">اسم الطالب</th>
                            <th className="border px-4 py-2 text-left">الدرجة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Create a row for each student */}
                        {grades.length > 0 ? (
                            grades.map((grade) => (
                                <tr key={grade.stu_id}>
                                    <td className="border px-4 py-2">{grade.stu_name}</td>
                                    <td className="border px-4 py-2 text-gray-500">لا توجد درجات حتى الآن</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="border px-4 py-2 text-center text-gray-500">
                                    لا توجد درجات متاحة لعرضها.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    // If there's a server message, display it
    if (serverMessage) {
        return (
            <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{serverMessage}</h3>
                <p>يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني إذا استمر المشكلة.</p>
            </div>
        );
    }

    // If there are no grades
    if (grades.length === 0) {
        return (
            <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">لا توجد درجات عزيزي الطالب</h3>
                <p>لا توجد درجات متاحة لعرضها، يرجى المحاولة لاحقاً.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">الدرجات الخاصة بالدورة</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {grades.map((grade) => (
                    <div
                        key={grade.stu_id}
                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden transform hover:scale-105"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-[#051568] mb-4 flex items-center">
                                <FaUser className="mr-2 text-[#051568]" />
                                {grade.stu_name}
                            </h3>
                            <p className="text-lg mb-2">نوع الاختبار: {grade.type}</p>
                            <p className="text-sm text-gray-500">
                                {formattedDate(grade.start_date)} إلى {formattedDate(grade.end_date)}
                            </p>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center">
                                    <FaFileAlt className="mr-2 text-gray-600" />
                                    <span className="text-gray-600">الدرجة: {grade.score} / {grade.max_score}</span>
                                </div>

                                <div className="mb-2 flex items-center">
                                    <FaCheckCircle className="mr-2 text-green-600" />
                                    <span className="text-gray-600">الدرجة المطلوبة للنجاح: {grade.pass_score}</span>
                                </div>

                                <div className="mb-2 flex items-center">
                                    {grade.state === "ناجح" ? (
                                        <FaCheckCircle className="mr-2 text-green-600" />
                                    ) : (
                                        <FaTimesCircle className="mr-2 text-red-600" />
                                    )}
                                    <span className="text-gray-600">الحالة: {grade.state}</span>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={() => window.open(grade.co_name, "_blank")}
                                        className="mr-2 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded"
                                    >
                                        <FaChalkboardTeacher className="mr-2" />
                                        رابط الدورة
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GradesTab;
