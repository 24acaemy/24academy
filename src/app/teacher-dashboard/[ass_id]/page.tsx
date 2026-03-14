"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";
import StudentsTab from "./components/studentstab";
import LessonsTab from "./components/lessonstab";
import ExamsTab from "./components/examstab";
import GradesTab from "./components/gradestab";
import AttendanceTab from "./components/AttendanceTab";
import TabBar from "./components/TabBar";

interface CourseData {
    ass_id: string;
    te_name: string;
    co_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
}

type TeacherTab = 'students' | 'lessons' | 'grades' | 'attendance';

const dynamicTabs: { label: string; value: TeacherTab }[] = [
    { label: 'الطلاب',  value: 'students'   },
    { label: 'الدروس',  value: 'lessons'    },
    { label: 'الحضور',  value: 'attendance' },
    { label: 'الدرجات', value: 'grades'     },
];

const CourseDetails: React.FC = () => {
    const { ass_id } = useParams();
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading]       = useState<boolean>(true);
    const [error, setError]           = useState<string | null>(null);
    const [activeTab, setActiveTab]   = useState<TeacherTab>('students');

    useEffect(() => {
        if (!ass_id) return;

        const fetchCourseData = async (): Promise<void> => {
            try {
                const response = await axios.get<CourseData[]>(
                    "https://24onlinesystem.vercel.app/co_ass"
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
            case "students":
                return (
                    <StudentsTab
                        ass_id={id}
                    />
                );
            case "lessons":
                return (
                    <LessonsTab
                        courseName={courseData?.co_name || ""}
                        teacherName={courseData?.te_name || ""}
                        ass_id={id}
                    />
                );
            case "attendance":
                return (
                    <AttendanceTab
                        ass_id={id}
                    />
                );
            case "grades":
                return (
                    <GradesTab
                        ass_id={id}
                        startTime={courseData?.start_time || ""}
                        teacherName={courseData?.te_name || ""}
                    />
                );
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
