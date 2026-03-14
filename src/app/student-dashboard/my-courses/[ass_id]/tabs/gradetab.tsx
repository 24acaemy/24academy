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
  start_time: string;
  start_date: string;
  end_date: string;
  name_te: string;
  created_at: string;
}

interface GradesTabProps {
  ass_id: string;
}

const GradesTab: React.FC<GradesTabProps> = ({ ass_id }) => {
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `https://24onlinesystem.vercel.app/grades?ass_id=${ass_id}`
        );
        if (response.data && response.data.length > 0) {
          setGrades(response.data);
          setErrorMessage(null);
        } else {
          setGrades([]);
          setErrorMessage("لا توجد درجات لهذه الدورة.");
        }
      } catch {
        setErrorMessage("فشل تحميل الدرجات. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [ass_id]);

  if (loading) return <CustomLoader />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">الدرجات</h3>

      {errorMessage && (
        <div className="text-red-600 mb-4">{errorMessage}</div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-[#051568] text-white">
            <tr>
              <th className="py-4 px-6 text-center">نوع الامتحان</th>
              <th className="py-4 px-6 text-center">الدرجة</th>
              <th className="py-4 px-6 text-center">أعلى درجة</th>
              <th className="py-4 px-6 text-center">درجة النجاح</th>
              <th className="py-4 px-6 text-center">التقدم</th>
              <th className="py-4 px-6 text-center">الحالة</th>
              <th className="py-4 px-6 text-center">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {grades.length > 0 ? (
              grades.map((grade, index) => {
                const pct = Math.round(
                  (parseFloat(grade.score) / grade.max_score) * 100
                );
                return (
                  <tr
                    key={`${grade.stu_id}-${grade.type}-${index}`}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-100 transition-all duration-300 ease-in-out`}
                  >
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          grade.state === "ناجح"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {grade.state}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">{grade.created_at}</td>
                  </tr>
                );
              })
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
    </div>
  );
};

export default GradesTab;
