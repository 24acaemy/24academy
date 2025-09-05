"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";
import StudentsTab from "./components/studentstab";
import LessonsTab from "./components/lessonstab";
import ExamsTab from "./components/examstab";
import GradesTab from "./components/gradestab";
import TabBar from "./components/TabBar"; // Import the TabBar component

interface CourseData {
    ass_id: string;
    te_name: string;
    co_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
}

const CourseDetails = () => {
    const { ass_id } = useParams();
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'students' | 'lessons' >('students'); // Set initial tab

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // 🟢 Fetch all courses
                const response = await axios.get("https://24onlinesystem.vercel.app/co_ass");
                const courses: CourseData[] = response.data;

                // 🔍 Find the course with the matching `ass_id`
                const matchedCourse = courses.find((course) => course.ass_id === ass_id);
                if (!matchedCourse) {
                    setError("الدورة غير موجودة");
                    setLoading(false);
                    return;
                }
                setCourseData(matchedCourse);
            } catch (err) {
                setError("خطأ في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        if (ass_id) {
            fetchCourseData();
        }
    }, [ass_id]);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><CustomLoader /></div>; // Center the loader
    if (error) return <div className="text-center text-red-500">{error}</div>;

    // Render the content based on the active tab
    let tabContent;
    switch (activeTab) {
        case "students":
            tabContent = <StudentsTab ass_id={courseData?.ass_id || ""} />;
            break;
        case "lessons":
            tabContent = <LessonsTab
                courseName={courseData?.co_name || ""}
                teacherName={courseData?.te_name || ""}
                ass_id={courseData?.ass_id || ""} // Pass ass_id to LessonsTab
            />;
            break;
        case "exams":
            tabContent = <ExamsTab courseName={courseData?.co_name || ""} />;
            break;
        case "grades":
            tabContent = <GradesTab
                ass_id={courseData?.ass_id || ""}
                startTime={courseData?.start_time || ""}
                teacherName={courseData?.te_name || ""}
            />;
            break;
        default:
            tabContent = <div>Select a tab</div>;
            break;
    }

    // Dynamic tabs configuration
    const dynamicTabs = [
        { label: 'الطلاب', value: 'students' },
        { label: 'الدروس', value: 'lessons' },
    
    ];

    return (
        <div className="p-6" dir="rtl">
            <h2 className="text-3xl font-bold">{courseData?.co_name}</h2>
            <p className="text-lg text-gray-500">
                من {courseData?.start_date} إلى {courseData?.end_date}
            </p>
            <p className="text-lg">المدرس: {courseData?.te_name}</p>
            <p className="text-lg">بداية الدورة: {courseData?.start_time}</p>

            {/* Tab navigation */}
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} dynamicTabs={dynamicTabs} />

            {/* Tab content */}
            {tabContent}
        </div>
    );
};

export default CourseDetails;
