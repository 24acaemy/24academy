import React, { useEffect, useState, useMemo } from 'react';
import { FaFilter, FaSortAlphaDown, FaRedo } from 'react-icons/fa';
import CustomLoader from '@/app/components/spinned';  // تأكد من أنك تستخدم loader مناسب

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

const ViewAssignments = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [filter, setFilter] = useState<string>('latest'); // الفلترة حسب التاريخ
    const [courseFilter, setCourseFilter] = useState<string>('all'); // الفلترة حسب الدورة
    const [statusFilter, setStatusFilter] = useState<string>('all'); // الفلترة حسب الانتهاء (تم/لم يتم)

    const defaultAssignments: Assignment[] = [
        {
            ass_id: "1",
            te_name: "وحدة يحيى",
            co_name: "literacy",
            start_time: "10:00 AM",
            start_date: "02/10/2025",
            end_date: "02/12/2025",
            created_at: "01/02/2025 10:00 AM",
            updated_at: null,
        },
        {
            ass_id: "2",
            te_name: "وحدة عادل",
            co_name: "mathematics",
            start_time: "11:00 AM",
            start_date: "03/10/2025",
            end_date: "03/12/2025",
            created_at: "01/03/2025 11:00 AM",
            updated_at: null,
        },
    ];

    // جلب بيانات التعيينات من الـ API
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch('https://24onlinesystem.vercel.app/co_ass');
                if (!response.ok) {
                    throw new Error('فشل في جلب البيانات');
                }
                const data = await response.json();
                setAssignments(data);
            } catch {
                setAssignments(defaultAssignments); // استخدام البيانات الافتراضية في حال فشل الجلب
                setError('فشل في جلب البيانات. استخدام البيانات الافتراضية.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []); // No need to add defaultAssignments as a dependency, it's constant

    // معالجة الفلاتر وترتيب التعيينات
    const filteredAssignments = useMemo(() => {
        return assignments
            .filter((assignment) => courseFilter === 'all' || assignment.co_name === courseFilter)
            .filter((assignment) => {
                if (statusFilter === 'completed') {
                    return new Date(assignment.end_date) < new Date(); // التعيينات التي انتهت
                } else if (statusFilter === 'pending') {
                    return new Date(assignment.end_date) >= new Date(); // التعيينات التي لم تنتهِ بعد
                } else if (statusFilter === 'planned') {
                    return new Date(assignment.start_date) > new Date(); // التعيينات التي لم تبدأ بعد
                }
                return true; // عرض جميع التعيينات إذا كانت الفلترة حسب الكل
            })
            .sort((a, b) => {
                if (filter === 'latest') {
                    return new Date(b.end_date).getTime() - new Date(a.end_date).getTime(); // ترتيب حسب التاريخ
                }
                return 0;
            });
    }, [assignments, filter, courseFilter, statusFilter]);

    if (error) {
        return (
            <div className="text-red-500 text-center mt-4">
                <div className="flex items-center justify-center">
                    <FaRedo className="animate-spin mr-2" />
                    <span>{error}</span>
                </div>
                <button onClick={() => window.location.reload()} className="mt-4 bg-[#051568] text-white p-2 rounded-md">
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (loading) {
        return <CustomLoader />;
    }

    if (assignments.length === 0) {
        return <div className="text-center mt-4">لا توجد بيانات لعرضها.</div>;
    }

    return (
        <div className="p-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">عرض التعيينات</h3>

            {/* قسم الفلاتر */}
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <FaFilter className="text-[#051568]" />
                    <select
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    >
                        <option value="all">جميع الدورات</option>
                        {Array.from(new Set(assignments.map((a) => a.co_name))).map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <FaSortAlphaDown className="text-[#051568]" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    >
                        <option value="all">جميع التعيينات</option>
                        <option value="completed">التي انتهت</option>
                        <option value="pending">التي لم تنتهِ بعد</option>
                        <option value="planned">المخطط لها</option> {/* إضافة الخيار الجديد */}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <FaSortAlphaDown className="text-[#051568]" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    >
                        <option value="latest">الأحدث أولاً</option>
                        <option value="name-asc">الأبجدية (أ-ي)</option>
                        <option value="name-desc">الأبجدية (ي-أ)</option>
                    </select>
                </div>
            </div>

            {/* جدول التعيينات */}
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">اسم المعلم</th>
                        <th className="border px-4 py-2">اسم الكورس</th>
                        <th className="border px-4 py-2">تاريخ البداية</th>
                        <th className="border px-4 py-2">تاريخ النهاية</th>
                        <th className="border px-4 py-2">تاريخ الإضافة</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAssignments.map((assignment, index) => (
                        <tr key={assignment.ass_id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{assignment.te_name}</td>
                            <td className="border px-4 py-2">{assignment.co_name}</td>
                            <td className="border px-4 py-2">{assignment.start_date} {assignment.start_time}</td>
                            <td className="border px-4 py-2">{assignment.end_date}</td>
                            <td className="border px-4 py-2">{assignment.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAssignments;
