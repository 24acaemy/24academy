"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { auth } from "@/services/firebase"; // Make sure firebase is correctly configured
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link from next/link
import CustomLoader from "../components/spinned"; // Your custom loader component

// Interface for the course data structure
interface Course {
    ass_id: string;
    co_name: string;
    start_date: string;
    end_date: string;
    email: string; // Email to filter courses by teacher
    start_time: string;
    te_name: string;
}

const CourseCard = ({
    course,
    calculateProgress,
}: {
    course: Course;
    calculateProgress: (course: Course) => number;
}) => (
    <div
        key={course.ass_id}
        className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
        <Link href={`/teacher-dashboard/${course.ass_id}`} className="block cursor-pointer">
            <h3 className="font-bold text-xl">{course.co_name}</h3>
            <p className="text-sm text-gray-500">
                من {course.start_date} إلى {course.end_date}
            </p>
            <div className="mt-4 flex items-center justify-between">
                <p className="text-lg">الإنجاز:</p>
                <p className="text-lg">{calculateProgress(course)}%</p>
            </div>
            <div className="w-full bg-gray-200 h-2 mt-2 rounded">
                <div
                    style={{ width: `${calculateProgress(course)}%` }}
                    className="bg-blue-500 h-2 rounded"
                ></div>
            </div>
            <div className="mt-4 flex items-center text-gray-600">
                <FaCheckCircle className="mr-2 text-green-500" />
                <span>الدورة جارية</span>
            </div>
        </Link>
    </div>
);

const Dashboard = () => {
    const [ongoingCourses, setOngoingCourses] = useState<Course[]>([]);
    const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null); // Error handling state
    const router = useRouter();

    // Fetch the current user email from Firebase Auth
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const parseDate = (dateString: string): Date => {
        // Assuming dates are in the format "dd/mm/yyyy"
        const [day, month, year] = dateString.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    // Calculate progress of a course based on the start and end dates
    const calculateProgress = useCallback((course: Course): number => {
        if (typeof window === "undefined") return 0;  // Ensure it's on the client side

        const today = new Date();
        const startDate = parseDate(course.start_date);
        const endDate = parseDate(course.end_date);

        if (today < startDate) return 0;
        if (today > endDate) return 100;

        const timePassed = today.getTime() - startDate.getTime();
        const totalDuration = endDate.getTime() - startDate.getTime();
        const progress = (timePassed / totalDuration) * 100;
        return Math.min(Math.max(progress, 0), 100);
    }, []);

    useEffect(() => {
        if (userEmail) {
            const fetchCourses = async () => {
                try {
                    const response = await axios.get("https://24onlinesystem.vercel.app/co_ass");
                    const allCourses: Course[] = response.data;
                    const today = new Date();
                    const normalizedUserEmail = userEmail.toLowerCase();

                    // Filter courses by email (only courses for the logged-in teacher)
                    const teacherCourses = allCourses.filter(
                        (course: Course) => course.email.toLowerCase() === normalizedUserEmail
                    );

                    // Ongoing: start_date <= today <= end_date
                    const ongoing = teacherCourses.filter((course: Course) => {
                        const startDate = parseDate(course.start_date);
                        const endDate = parseDate(course.end_date);
                        return startDate <= today && endDate >= today;
                    });

                    // Upcoming: courses that have not yet started or are still in the future
                    const upcoming = teacherCourses.filter(
                        (course: Course) => parseDate(course.start_date) > today
                    );

                    // Completed: courses that ended before today
                    const completed = teacherCourses.filter(
                        (course: Course) => parseDate(course.end_date) < today
                    );

                    setOngoingCourses(ongoing);
                    setUpcomingCourses(upcoming);
                    setCompletedCourses(completed);
                    setLoading(false);
                } catch (err: any) {
                    console.error(`Error fetching courses:${err}`);
                    setError(
                        err?.response?.data?.message ||
                        "هناك مشكلة في تحميل البيانات. يرجى المحاولة لاحقاً."
                    );
                    setLoading(false);
                }
            };

            fetchCourses();
        }
    }, [userEmail]);

    if (loading) return <CustomLoader />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto" dir="rtl">
            <h1 className="text-3xl font-bold text-[#051568] mb-8 text-center">
                لوحة التحكم
            </h1>
            <div className="text-center mb-6">
                <p className="text-lg">البريد الإلكتروني: {userEmail}</p>
            </div>

            {/* Ongoing Courses */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">الدورات الحالية</h2>
                {ongoingCourses.length === 0 ? (
                    <div className="text-center">
                        <img src="/loogo.png" alt="No courses" className="mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد لديك دورات قائمة حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ongoingCourses.map((course) => (
                            <CourseCard key={course.ass_id} course={course} calculateProgress={calculateProgress} />
                        ))}
                    </div>
                )}
            </div>

            {/* Upcoming Courses */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">الدورات القادمة</h2>
                {upcomingCourses.length === 0 ? (
                    <div className="text-center">
                        <img src="/empty-state.png" alt="No upcoming courses" className="mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد لديك دورات قادمة حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingCourses.map((course) => (
                            <CourseCard key={course.ass_id} course={course} calculateProgress={calculateProgress} />
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Courses */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">الدورات المنتهية</h2>
                {completedCourses.length === 0 ? (
                    <div className="text-center">
                        <img src="/empty-state.png" alt="No completed courses" className="mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد لديك دورات منتهية حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedCourses.map((course) => (
                            <CourseCard key={course.ass_id} course={course} calculateProgress={calculateProgress} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
