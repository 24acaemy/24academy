import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomLoader from '@/app/components/spinned'; // Import the spinner component

interface Course {
    ass_id: string;
    te_name: string;
    email: string;
    co_name: string;
    start_time: string;
    start_date: string;
    end_date: string;
}

interface Enrollment {
    en_id: string;
    stu_name: string;
    email: string;
    co_name: string;
    wanted_time: string;
    payment: string;
    enrollment_date: string;
}

const AddCourseStudent = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [students, setStudents] = useState<Enrollment[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
    const [emailStatuses, setEmailStatuses] = useState<{ [key: string]: string }>({}); // Email status tracking

    // Fetch all courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://24onlinesystem.vercel.app/co_ass');
            setCourses(response.data);
        } catch {
            console.error('Error fetching courses');
        }
    };

    // Fetch students based on the selected course
    const fetchStudentsForCourse = async (courseName: string) => {
        try {
            const response = await axios.get('https://24onlinesystem.vercel.app/enrollments/notdivided');
            const normalizedCourseName = courseName.trim().toLowerCase();

            const studentsInCourse = response.data.filter((enrollment: Enrollment) =>
                enrollment.co_name.trim().toLowerCase() === normalizedCourseName
            );

            if (studentsInCourse.length === 0) {
                alert('لا يوجد طلاب مسجلين في هذه الدورة.');
            } else {
                const uniqueStudents = Array.from(new Map(
                    studentsInCourse.map(student => [`${student.en_id}-${student.co_name}`, student])
                ).values());

                setStudents(uniqueStudents);
            }
        } catch {
            alert('لا يوجد طلاب منضمين لهذه الدوره');
        }
    };

    // Handle course selection
    const handleCourseSelect = (courseId: string) => {
        setSelectedCourse(courseId);
        const selectedCourse = courses.find(course => course.ass_id === courseId);
        if (selectedCourse) {
            fetchStudentsForCourse(selectedCourse.co_name);
            setIsModalOpen(true); // Open modal when course is selected
        }
    };

    // Handle checkbox change (student selection)
    const handleStudentSelect = (studentId: string) => {
        setSelectedStudents(prevSelected => {
            const updated = new Set(prevSelected);
            if (updated.has(studentId)) {
                updated.delete(studentId); // Unselect if already selected
            } else {
                updated.add(studentId); // Select the student if not selected
            }
            return updated;
        });
    };

    // Assign selected students to the course and handle email sending status
    const handleAssignStudents = async () => {
        try {
            setLoading(true);

            // Create an array of objects with "en_id" and "ass_id" for each selected student
            const studentsToAssign = Array.from(selectedStudents).map(studentId => {
                const student = students.find(s => s.en_id === studentId); // Find the student details
                return {
                    en_id: studentId,
                    ass_id: selectedCourse,
                    name: student.stu_name,
                    email: student.email,
                    course: student.co_name,
                    start_time: student.wanted_time,
                    start_date: student.enrollment_date,
                    end_date: student.end_date, // Assuming you have this data
                };
            });

            // Send the array of students to the API to assign them
            const assignResponse = await axios.post('https://24onlinesystem.vercel.app/course_students', studentsToAssign);
            console.log('Assign Students Response:', assignResponse.data); // Log server response for assignment

            // Send email for each student added
            const emailPromises = studentsToAssign.map(async (studentData) => {
                setEmailStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [studentData.en_id]: 'sending', // Set email status to "sending"
                }));

                try {
                    console.log('Sending email data:', studentData); // Log data before sending
                    const emailResponse = await axios.post('https://24onlinesystem.vercel.app/course_students/sendemail', studentData);
                    console.log(`Email sent to ${studentData.email} - Response:`, emailResponse.data); // Log server response for email
                    setEmailStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [studentData.en_id]: 'sent', // Set email status to "sent"
                    }));
                } catch (error) {
                    console.error(`Error sending email to ${studentData.email}:`, error.response || error.message); // Log the error
                    setEmailStatuses(prevStatuses => ({
                        ...prevStatuses,
                        [studentData.en_id]: 'failed', // Set email status to "failed"
                    }));
                }
            });

            // Wait for all email sending tasks to finish
            await Promise.all(emailPromises);

            setLoading(false);
            alert('الطلاب تم توزيعهم على الدورة بنجاح!');
            setIsModalOpen(false); // Close modal after assignment
        } catch (error) {
            setLoading(false);
            console.error('Error assigning students:', error.response || error.message); // Log error for student assignment
            alert('حدث خطأ أثناء توزيع الطلاب على الدورة');
        }
    };

    // Close modal function
    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchCourses(); // Fetch courses when component mounts
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-[#051568] mb-6 text-center">إضافة طالب لدورة</h3>

            {/* Display courses */}
            <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">الدورات المتاحة</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div
                            key={course.ass_id} // Use ass_id as the unique key
                            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
                            onClick={() => handleCourseSelect(course.ass_id)}
                        >
                            <h5 className="font-bold text-lg">{course.co_name}</h5>
                            <p className="text-sm text-gray-500">المدرس: {course.te_name}</p>
                            <p className="text-sm">من {course.start_date} إلى {course.end_date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal to display students of the selected course */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative">
                        {/* Modal Header */}
                        <div className="absolute top-0 left-0 right-0 p-4 bg-[#051568] text-white rounded-t-lg flex justify-between items-center">
                            <h4 className="text-lg font-semibold">الطلاب في الدورة</h4>
                            <button onClick={closeModal} className="text-white text-xl">×</button>
                        </div>

                        {/* Modal Body */}
                        <div className="mt-16 overflow-y-auto max-h-80">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.size === students.length}
                                        onChange={() => {
                                            if (selectedStudents.size === students.length) {
                                                setSelectedStudents(new Set());
                                            } else {
                                                setSelectedStudents(new Set(students.map(student => student.en_id)));
                                            }
                                        }}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <p className="text-sm">تحديد الكل</p>
                                </div>

                                {/* List of students */}
                                {students.map(student => (
                                    <div key={student.en_id} className="flex items-center space-x-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedStudents.has(student.en_id)}
                                            onChange={() => handleStudentSelect(student.en_id)}
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                        />
                                        <p className="text-sm">{student.stu_name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-4 flex justify-between items-center">
                            <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-md">إغلاق</button>
                            <button
                                onClick={handleAssignStudents}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md"
                            >
                                {loading ? <CustomLoader /> : 'توزيع الطلاب'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCourseStudent;

