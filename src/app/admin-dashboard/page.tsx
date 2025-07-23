"use client";
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { Bar } from "react-chartjs-2"; // تم إزالة Line من هنا
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"; // تم إزالة العناصر غير الضرورية
import axios from "axios";
import CustomLoader from "../components/spinned";

// تسجيل مكونات Chart.js الضرورية فقط
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const primaryColor = "#051568";
const accentColor = "#03457d";
const gridColor = "#e2ebf0";

interface Student {
    created_at: string;
}

interface Enrollment {
    co_name: string;
}

interface CourseAssignment {
    ass_id: string;
    te_name: string;
    email: string;
    co_name: string;
    start_time: string;
    start_date: string | Date;
    end_date: string | Date;
    created_at: string;
    updated_at: string;
}

const AdminDashboard = () => {
    // الحالات الأساسية
    const [registrationsData, setRegistrationsData] = useState<Student[]>([]);
    const [enrollmentsData, setEnrollmentsData] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isClient, setIsClient] = useState<boolean>(false);

    // حالات الدورات
    const [runningCourses, setRunningCourses] = useState<CourseAssignment[]>([]);
    const [finishedCourses, setFinishedCourses] = useState<CourseAssignment[]>([]);
    const [plannedCourses, setPlannedCourses] = useState<CourseAssignment[]>([]);
    const [coursesLoading, setCoursesLoading] = useState({
        running: true,
        finished: true,
        planned: true,
    });
    const [finishedLimit, setFinishedLimit] = useState<number>(5);

    const fetchAllData = async () => {
        try {
            const [studentsRes, enrollmentsRes, runningRes, finishedRes, plannedRes] =
                await Promise.all([
                    axios.get<Student[]>("https://24onlinesystem.vercel.app/students"),
                    axios.get<Enrollment[]>("https://24onlinesystem.vercel.app/enrollments/notdivided"),
                    axios.get<CourseAssignment[]>("https://24onlinesystem.vercel.app/co_ass/running"),
                    axios.get<CourseAssignment[]>("https://24onlinesystem.vercel.app/co_ass/finished"),
                    axios.get<CourseAssignment[]>("https://24onlinesystem.vercel.app/co_ass/planned"),
                ]);

            setRegistrationsData(studentsRes.data);
            setEnrollmentsData(enrollmentsRes.data);
            setRunningCourses(runningRes.data);
            setFinishedCourses(finishedRes.data);
            setPlannedCourses(plannedRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            setCoursesLoading({
                running: false,
                finished: false,
                planned: false,
            });
        }
    };

    // إعداد بيانات المخطط العمودي فقط
    const prepareChartData = () => {
        // معالجة بيانات تسجيلات الدورات
        const courseCounts = enrollmentsData.reduce((acc, enrollment) => {
            acc[enrollment.co_name] = (acc[enrollment.co_name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const sortedCourses = Object.entries(courseCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        return {
            labels: sortedCourses.map(([course]) => course),
            datasets: [{
                label: "عدد الطلاب",
                data: sortedCourses.map(([, count]) => count),
                backgroundColor: sortedCourses.map((_, i) =>
                    `hsl(219, 100%, ${35 + i * 5}%)`),
                borderColor: primaryColor,
                borderWidth: 1,
                borderRadius: 4,
            }]
        };
    };

    const CourseSection: React.FC<{
        title: string;
        courses: CourseAssignment[];
        loading: boolean;
        color: string;
        showLoadMore?: boolean;
        onLoadMore?: () => void;
    }> = ({ title, courses, loading, color, showLoadMore = false, onLoadMore }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className={`text-xl font-semibold mb-4 border-b-2 pb-2 border-${color}-500`}>
                {title} ({courses.length})
            </h3>

            {loading ? (
                <CustomLoader />
            ) : courses.length === 0 ? (
                <p className="text-gray-500">لا توجد دورات متاحة</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {courses.map((course) => (
                            <div key={course.ass_id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-[#051568]">{course.co_name}</h4>
                                        <p className="text-gray-600 text-sm">{course.te_name}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{course.start_time}</span>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-500">تاريخ البدء: </span>
                                        {formatDate(course.start_date)}
                                    </div>
                                    <div>
                                        <span className="text-gray-500">تاريخ الانتهاء: </span>
                                        {formatDate(course.end_date)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showLoadMore && finishedCourses.length > finishedLimit && (
                        <button
                            onClick={onLoadMore}
                            className="mt-4 w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 text-[#051568] rounded-md transition-colors"
                        >
                            تحميل المزيد
                        </button>
                    )}
                </>
            )}
        </div>
    );

    // دالة لتهيئة التواريخ المعروضة
    const formatDate = (date: string | Date): string => {
        // التأكد من أن التاريخ هو عبارة عن سلسلة نصية أو كائن Date
        return date.toString();
    };



    useEffect(() => {
        setIsClient(true);
        fetchAllData();
    }, []);

    if (!isClient || loading) return <CustomLoader />;

    const { labels, datasets } = prepareChartData();

    return (
        <AdminLayout>
            <div className="p-6 space-y-8">
                <header className="text-center">
                    <h1 className="text-4xl font-bold text-[#051568] mb-2">لوحة التحكم الإدارية</h1>
                    <p className="text-gray-600">نظرة عامة على إحصائيات المنصة</p>
                </header>

                {/* بطاقات الإحصائيات */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg text-gray-600">إجمالي الطلاب المسجلين</h3>
                        <p className="text-3xl font-bold text-[#051568] mt-2">
                            {registrationsData.length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg text-gray-600">إجمالي الطلاب</h3>
                        <p className="text-3xl font-bold text-[#051568] mt-2">
                            {enrollmentsData.length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg text-gray-600">عدد الدورات</h3>
                        <p className="text-3xl font-bold text-[#051568] mt-2">
                            {Object.keys(labels).length}
                        </p>
                    </div>
                </div>

                {/* قسم المخططات */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-[#051568] mb-4">
                            توزيع الطلاب على الدورات
                        </h3>
                        <div className="h-96">
                            <Bar
                                data={{ labels, datasets }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: { rtl: true }
                                    },
                                    scales: {
                                        x: {
                                            display: true,
                                            grid: { color: gridColor },
                                            beginAtZero: true
                                        },
                                        y: {
                                            display: true,
                                            grid: { display: false },
                                            ticks: {
                                                autoSkip: false,
                                                maxRotation: 45,
                                                minRotation: 45
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* قسم الدورات */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <CourseSection
                        title="الدورات القائمة"
                        courses={runningCourses}
                        loading={coursesLoading.running}
                        color="green"
                    />

                    <CourseSection
                        title="الدورات المنتهية"
                        courses={finishedCourses.slice(0, finishedLimit)}
                        loading={coursesLoading.finished}
                        color="red"
                        showLoadMore={finishedCourses.length > 5}
                        onLoadMore={() => setFinishedLimit(prev => prev + 5)}
                    />

                    <CourseSection
                        title="الدورات المستقبلية"
                        courses={plannedCourses}
                        loading={coursesLoading.planned}
                        color="blue"
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
