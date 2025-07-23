"use client";
import { useState, useEffect } from 'react';
import { auth } from '@/services/firebase'; // Assuming firebase is already configured
import axios from 'axios'; // Assuming axios is used for API requests
import CustomLoader from '@/app/components/spinned'; // Assuming you already have a custom loader

const MyEnrollmentsContent = () => {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [enrollments, setEnrollments] = useState<any[]>([]); // Store enrollments
    const [loading, setLoading] = useState<boolean>(false); // Track loading state

    // Fetch user email from Firebase
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setUserEmail(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Fetch enrollments for the current user
    useEffect(() => {
        if (userEmail) {
            setLoading(true); // Start loading
            axios.get(`https://24onlinesystem.vercel.app/enrollments/email=${userEmail}`)
                .then(response => {
                    setEnrollments(response.data); // Set enrollments data
                    setLoading(false); // Stop loading
                })
                .catch(error => {
                    console.error("Error fetching enrollments:", error);
                    setLoading(false); // Stop loading
                });
        }
    }, [userEmail]);

    // Fetch course details based on course name (curriculum URL)
    const getCourseDetails = async (coName: string) => {
        try {
            const courseResponse = await axios.get(`https://24onlinesystem.vercel.app/courses/co_name=${coName}`);
            return courseResponse.data;
        } catch (error) {
            console.error("Error fetching course details:", error);
            return null;
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg" dir="rtl">
            <h2 className="text-xl font-semibold text-gray-700">هذه هي الدورات التي قمت بالتسجيل فيها.</h2>

            {/* If userEmail is null, show a message asking the user to log in */}
            {!userEmail ? (
                <p className="text-gray-600">الرجاء تسجيل الدخول لعرض الدورات التي قمت بالتسجيل فيها.</p>
            ) : (
                <div>
                    {/* Show loader if data is loading */}
                    {loading ? (
                        <CustomLoader />
                    ) : (
                        <div>
                            {/* Check if enrollments exist */}
                            {enrollments.length === 0 ? (
                                <p className="text-gray-600">لا توجد دورات لعرضها.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {enrollments.map((enrollment) => (
                                        <div key={enrollment.en_id} className="bg-white shadow-md rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-gray-800">{enrollment.co_name}</h3>
                                            <p className="text-gray-600 mt-2">الاسم: {enrollment.stu_name}</p>
                                            <p className="text-gray-600 mt-2">الوقت المطلوب: {enrollment.wanted_time}</p>
                                            <p className="text-gray-600 mt-2">تاريخ التسجيل: {enrollment.enrollment_date}</p>

                                            {/* Fetch and display the curriculum URL dynamically */}
                                            <p className="text-gray-600 mt-2">
                                                <a
                                                    href={getCourseDetails(enrollment.co_name)?.curriculum}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    رابط المنهج
                                                </a>
                                            </p>

                                            <div className="mt-4 flex justify-between items-center">
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                    تفاصيل الدورة
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyEnrollmentsContent;
