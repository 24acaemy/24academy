"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { auth } from "@/services/firebase"; // Assuming you are using Firebase for authentication
import CustomLoader from "@/app/components/spinned";

const MyCoursesContent = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch user email from Firebase
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
                console.log("User email:", user.email); // Log user email
            } else {
                setUserEmail(null);
                console.log("No user signed in."); // Log when no user is signed in
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch courses for the current user
    useEffect(() => {
        if (userEmail) {
            setLoading(true);
            axios
                .get("https://24onlinesystem.vercel.app/course_students")
                .then((response) => {
                    const filteredCourses = response.data.filter((course: any) => {
                        return (
                            course.stu_email.trim().toLowerCase() ===
                            userEmail.trim().toLowerCase()
                        );
                    });
                    setCourses(filteredCourses);
                    console.log("Fetched courses:", filteredCourses); // Log fetched courses data
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching courses:", error);
                
                    setLoading(false);
                });
        }
    }, [userEmail]);

    // Navigate to course details page with ass_id only
    const navigateToCourseDetails = (ass_id: string) => {
        if (ass_id) {
            console.log("Navigating to course details with ass_id:", ass_id); // Log ass_id being passed
            router.push(`/student-dashboard/my-courses/${ass_id}`);  // Correct URL structure
        } else {
            console.error("ass_id is undefined or null");
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg" dir="rtl">
            <h2 className="text-xl font-semibold text-gray-700">هذه هي الدورات التي أدرسها.</h2>

            {!userEmail ? (
                <p className="text-gray-600">الرجاء تسجيل الدخول لعرض الدورات التي أدرسها.</p>
            ) : (
                <div>
                    {loading ? (
                        <CustomLoader />
                    ) : (
                        <div>
                            {error && <div className="text-center text-red-500">{error}</div>}

                            {courses.length === 0 ? (
                                <p className="text-gray-600">لا توجد دورات لعرضها.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {courses.map((course) => {
                                        return (
                                            <div key={course.co_stu_id} className="bg-white shadow-md rounded-lg p-6">
                                                <h3 className="text-lg font-semibold text-gray-800">{course.co_name}</h3>
                                                <p className="text-gray-600 mt-2">اسم الطالب: {course.stu_name}</p>
                                                <p className="text-gray-600 mt-2">البريد الإلكتروني: {course.stu_email}</p>
                                                <p className="text-gray-600 mt-2">اسم المعلم: {course.te_name}</p>
                                                <p className="text-gray-600 mt-2">البريد الإلكتروني للمعلم: {course.te_email}</p>
                                                <p className="text-gray-600 mt-2">الوقت المحدد: {course.start_time}</p>
                                                <p className="text-gray-600 mt-2">تاريخ بدء الدورة: {course.start_date}</p>
                                                <p className="text-gray-600 mt-2">تاريخ انتهاء الدورة: {course.end_date}</p>

                                                <div className="mt-4 flex justify-between items-center">
                                                    <button
                                                        onClick={() =>
                                                            navigateToCourseDetails(course.ass_id)  // Pass ass_id to the URL
                                                        }
                                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        تفاصيل الدورة
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyCoursesContent;
