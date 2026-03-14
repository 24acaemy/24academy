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

interface AttendanceTabProps {
  ass_id: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ ass_id }) => {
  const [records, setRecords] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `https://24onlinesystem.vercel.app/attendance?ass_id=${ass_id}`
        );
        if (response.data && response.data.length > 0) {
          setRecords(response.data);
          setErrorMessage(null);
        } else {
          setRecords([]);
          setErrorMessage("لا يوجد سجلات حضور لهذه الدورة.");
        }
      } catch {
        setErrorMessage("فشل تحميل بيانات الحضور. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [ass_id]);

  const present = records.filter((r) => r.attendance === "حاضر").length;
  const absent = records.filter((r) => r.attendance === "غائب").length;
  const total = records.length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  if (loading) return <CustomLoader />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">سجل الحضور</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#051568] text-white rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm mt-1">إجمالي الدروس</p>
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

      {errorMessage && (
        <div className="text-red-600 mb-4">{errorMessage}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-[#051568] text-white">
            <tr>
              <th className="py-4 px-6 text-center">الدرس</th>
              <th className="py-4 px-6 text-center">التاريخ</th>
              <th className="py-4 px-6 text-center">الوقت</th>
              <th className="py-4 px-6 text-center">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <tr
                  key={`${record.stu_id}-${record.date}`}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-indigo-100 transition-all duration-300 ease-in-out`}
                >
                  <td className="py-4 px-6 text-center">{record.title}</td>
                  <td className="py-4 px-6 text-center">{record.date}</td>
                  <td className="py-4 px-6 text-center">{record.start_time}</td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        record.attendance === "حاضر"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.attendance}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 px-6 text-center text-gray-500">
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

export default AttendanceTab;
