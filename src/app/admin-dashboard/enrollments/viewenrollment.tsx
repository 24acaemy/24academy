"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiCalendar, FiBook, FiLoader } from "react-icons/fi";

type Enrollment = {
  en_id: string;
  stu_name: string;
  email: string;
  co_name: string;
  wanted_time: string | null;
  payment: string | null;
  enrollment_date: string;
  pay_id: number | null;
};

export default function EnrollmentTable() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [filteredData, setFilteredData] = useState<Enrollment[]>([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("https://24onlinesystem.vercel.app/enrollments/notdivided")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setFilteredData(json);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchDate = searchDate ? item.enrollment_date.includes(searchDate) : true;
      const matchCourse = searchCourse ? item.co_name.includes(searchCourse) : true;
      const matchSearch = searchTerm 
        ? Object.values(item).some(
            val => val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      
      return matchDate && matchCourse && matchSearch;
    });
    setFilteredData(filtered);
  }, [searchDate, searchCourse, searchTerm, data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">سجل التسجيلات</h1>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
            العدد الكلي: <span className="font-bold">{filteredData.length}</span> طالب
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Global Search */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="بحث شامل..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="فلترة بالتاريخ (مثال: 18/06/2025)"
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>

            {/* Course Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiBook className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="فلترة بالكورس"
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchCourse}
                onChange={(e) => setSearchCourse(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <FiLoader className="animate-spin text-blue-500 text-2xl mr-2" />
              <span>جاري تحميل البيانات...</span>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              لا توجد نتائج تطابق معايير البحث
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإيميل</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكورس</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوقت</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الدفع</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={item.en_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.stu_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.co_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.enrollment_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.wanted_time || <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${item.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.payment || 'قيد الانتظار'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination would go here */}
        {filteredData.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>عرض 1 إلى {filteredData.length} من {filteredData.length} عنصر</div>
            {/* Pagination buttons would go here */}
          </div>
        )}
      </div>
    </div>
  );
}
