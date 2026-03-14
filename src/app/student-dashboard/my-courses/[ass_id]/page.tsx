"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";
import TabBar, { TeacherTab } from "@/app/teacher-dashboard/[ass_id]/components/TabBar";
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

type StudentTab = 'lessons' | 'Attendance' | 'grades';

const dynamicTabs: { label: string; value: StudentTab }[] = [
    { label: 'الدروس',  value: 'lessons'    },
    { label: 'الحضور',  value: 'Attendance' },
    { label: 'الدرجات', value: 'grades'     },
];

const CourseDetails: React.FC = () => {
    const { ass_id } = useParams();
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading]       = useState<boolean>(true);
    const [error, setError]           = useState<string | null>(null);
    const [activeTab, setActiveTab]   = useState<StudentTab>('lessons');

    useEffect(() => {
        if (!ass_id) return;

        const fetchCourseData = async (): Promise<void> => {
            try {
                const response = await axios.get<CourseData[]>(
                    `https://24onlinesystem.vercel.app/course_students/ass_id=${ass_id}`
                );
                const matched = response.data.find(
                    (course) => course.ass_id === ass_id
                );
                if (!matched) {
                    setError("الدورة غير موجودة");
                    return;
                }
                setCourseData(matched);
            } catch {
                setError("خطأ في تحميل البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [ass_id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <CustomLoader />
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 mt-10">{error}</div>
    );

    const id: string = courseData?.ass_id ?? "";

    const renderTab = (): React.ReactNode => {
        switch (activeTab) {
            case "lessons":    return <LessonsTab    ass_id={id} />;
            case "Attendance": return <AttendanceTab ass_id={id} />;
            case "grades":     return <GradesTab     ass_id={id} />;
        }
    };

    return (
        <div className="p-6" dir="rtl">
            <h2 className="text-3xl font-bold">{courseData?.co_name}</h2>
            <p className="text-lg text-gray-500">
                من {courseData?.start_date} إلى {courseData?.end_date}
            </p>
            <p className="text-lg">المدرس: {courseData?.te_name}</p>
            <p className="text-lg">بداية الدورة: {courseData?.start_time}</p>

            <TabBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                dynamicTabs={dynamicTabs}
            />

            <div className="mt-6">
                {renderTab()}
            </div>
        </div>
    );
};

export default CourseDetails;
