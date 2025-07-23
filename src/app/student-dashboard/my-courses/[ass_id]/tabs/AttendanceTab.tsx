import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaUser, FaCalendarDay, FaCheckCircle, FaTimesCircle, FaChalkboardTeacher } from "react-icons/fa";
import CustomLoader from "@/app/components/spinned";

interface AttendanceData {
    stu_id: string;
    stu_name: string;
    email: string;
    date: string;
    attendance: string;
    title: string;
    co_name: string;
    start_time: string;
    te_name: string;
    te_email: string;
    created_at: string;
}

interface AttendanceTabProps {
    ass_id: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ ass_id }) => {
    const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [serverMessage, setServerMessage] = useState<string | null>(null);

    const fetchAttendanceData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://24onlinesystem.vercel.app/attendance?ass_id=${ass_id}`);

            if (Array.isArray(response.data)) {
                setAttendanceData(response.data);
            } else {
                setAttendanceData([]); // Reset if no valid data
                setServerMessage("لا توجد بيانات للحضور لهذا المعرف الدراسي");
            }
        } catch (error) {
            setLoading(false);

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 400) {
                        setError(null); // Clear the error message
                        setServerMessage(null);
                    } else {
                        setError(`Error: ${error.response.status} - ${error.response.data}`);
                    }
                } else {
                    setError('Network Error. Please check your connection.');
                }
            } else {
                setError('An unknown error occurred.');
            }

            setServerMessage(null);
        }
    }, [ass_id]);

    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) return <CustomLoader />;

    if (error) {
        return (
            <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{error}</h3>
            </div>
        );
    }

    if (serverMessage) {
        return (
            <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{serverMessage}</h3>
                <p>يرجى المحاولة لاحقاً أو التواصل مع الدعم الفني إذا استمرت المشكلة.</p>
            </div>
        );
    }

    if (attendanceData.length === 0) {
        return (
            <div className="text-center p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">لا توجد بيانات للحضور</h3>
                <p>لا توجد بيانات متاحة لعرضها، يرجى المحاولة لاحقاً.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">بيانات الحضور</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {attendanceData.map((data) => (
                    <div
                        key={data.stu_id}
                        className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden transform hover:scale-105"
                    >
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-[#051568] mb-4 flex items-center">
                                <FaUser className="mr-2 text-[#051568]" />
                                {data.stu_name}
                            </h3>
                            <p className="text-lg mb-2">عنوان الدورة: {data.title}</p>
                            <p className="text-sm text-gray-500">
                                {formattedDate(data.date)}
                            </p>

                            <div className="mt-4">
                                <div className="mb-2 flex items-center">
                                    <FaCalendarDay className="mr-2 text-gray-600" />
                                    <span className="text-gray-600">الحضور: {data.attendance}</span>
                                </div>

                                <div className="mb-2 flex items-center">
                                    {data.attendance === "موجود" ? (
                                        <FaCheckCircle className="mr-2 text-green-600" />
                                    ) : (
                                        <FaTimesCircle className="mr-2 text-red-600" />
                                    )}
                                    <span className="text-gray-600">الحالة: {data.attendance}</span>
                                </div>

                                <div className="mt-4">
                                    <button
                                        onClick={() => window.open(data.co_name, "_blank")}
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

export default AttendanceTab;
