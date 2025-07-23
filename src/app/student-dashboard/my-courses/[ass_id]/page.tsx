"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";  // Import useParams
import axios from "axios";
import CustomLoader from "@/app/components/spinned";
import TabBar from "@/app/teacher-dashboard/[ass_id]/components/TabBar";
import LessonsTab from "./tabs/lessontab";
import GradesTab from "./tabs/gradetab";
import AttendanceTab from "./tabs/AttendanceTab";

interface CourseData {
    ass_id: string;
    te_name: string;
    co_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
    co_stu_id: string;
}

const CourseDetails = () => {
    const { ass_id } = useParams();  // Use useParams to get ass_id
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'lessons' | 'Attendance' | 'grades'>('lessons');

    useEffect(() => {
        if (!ass_id) return; // If ass_id is not available, don't proceed with the fetch

        console.log("Fetching data for ass_id:", ass_id); // Log ass_id to verify it's being passed correctly

        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`https://24onlinesystem.vercel.app/course_students/ass_id=${ass_id}`);
                console.log("API Response:", response.data); // Log the response to verify the API response structure

                const courses: CourseData[] = response.data;

                const matchedCourse = courses.find((course) => course.ass_id === ass_id);
                console.log("Matched Course:", matchedCourse); // Log matched course data

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

        fetchCourseData();
    }, [ass_id]);

    if (loading) return <div className="flex justify-center items-center min-h-screen"><CustomLoader /></div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    let tabContent;
    switch (activeTab) {
        case "lessons":
            tabContent = <LessonsTab ass_id={courseData?.ass_id || ""} />;
            break;
        case "Attendance":
            tabContent = <AttendanceTab ass_id={courseData?.ass_id || ""} />;
            break;
        case "grades":
            tabContent = <GradesTab ass_id={courseData?.ass_id || ""} />;
            break;
        default:
            tabContent = <div>Select a tab</div>;
            break;
    }

    const dynamicTabs = [
        { label: 'الدروس', value: 'lessons' },
        { label: 'الحضور', value: 'Attendance' },
        { label: 'الدرجات', value: 'grades' },
    ];

    return (
        <div className="p-6" dir="rtl">
            <h2 className="text-3xl font-bold">{courseData?.co_name}</h2>
            <p className="text-lg text-gray-500">
                من {courseData?.start_date} إلى {courseData?.end_date}
            </p>
            <p className="text-lg">المدرس: {courseData?.te_name}</p>
            <p className="text-lg">بداية الدورة: {courseData?.start_time}</p>

            <TabBar activeTab={activeTab} onTabChange={setActiveTab} dynamicTabs={dynamicTabs} />

            {tabContent}
        </div>
    );
};

export default CourseDetails;
