import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";

interface ExamData {
    exam_id: string;
    type: string;
    max_score: number;
    duration: string;
}

interface QuestionData {
    question: string;
    answer: {
        '1': string;
        '2': string;
        '3': string;
    };
    correct_answer: number;
    mark: number;
    section: string;
    type: string;
}

interface Course {
    id: string;
    name: string;
}

interface ExamsTabProps {
    courseName: string;
    ass_id: string; // This can be used as the initial co_id in the modal
    coursesList: Course[] | undefined; // List of courses (with co_id) for dynamic selection
}

const ExamsTab: React.FC<ExamsTabProps> = ({ courseName, ass_id, coursesList = [] }) => {
    const [exams, setExams] = useState<ExamData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [questionData, setQuestionData] = useState<QuestionData>({
        question: '',
        answer: {
            '1': '',
            '2': '',
            '3': ''
        },
        correct_answer: 1,
        mark: 1,
        section: 'reading',
        type: ''
    });

    const [newExamData, setNewExamData] = useState({
        type: '',
        max_score: 25,
        pass_score: 20,
        number_of_questions: 15,
        duration: '1 hour',
        co_id: ass_id, // Dynamically set co_id from ass_id passed as prop
    });

    // Fetching the exams based on the course
    const fetchExams = useCallback(async () => {

        try {
            const response = await axios.get(
                `https://24onlinesystem.vercel.app/exams/co_id=${newExamData.co_id}`
            );
            setExams(response.data);
        } catch (error) {

            setExams([]);
        } finally {
            setLoading(false);
        }
    }, [newExamData.co_id]);

    // Fetching courses to automatically set co_id
    const fetchCourses = useCallback(async () => {
        try {
            const response = await axios.get(
                'https://24onlinesystem.vercel.app/courses/'
            );
            const courses = response.data;
            const matchedCourse = courses.find((course: any) => course.co_name === courseName);
            if (matchedCourse) {
                setNewExamData(prev => ({
                    ...prev,
                    co_id: matchedCourse.co_id, // Automatically set co_id based on courseName
                }));
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }, [courseName]);

    // When the component mounts or the course changes, fetch exams and courses
    useEffect(() => {
        fetchExams();
        fetchCourses();
    }, [fetchExams, fetchCourses]);

    // Adding a new question
    const handleAddQuestion = async () => {
        try {
            const response = await axios.post(
                'https://24onlinesystem.vercel.app/questions',
                questionData
            );
            console.log('Question added:', response.data);
            setIsModalOpen(false); // Close modal after success
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    // Handle changes in the form fields for question data
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setQuestionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle answer field changes
    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        setQuestionData(prev => ({
            ...prev,
            answer: {
                ...prev.answer,
                [index.toString()]: value
            }
        }));
    };

    // Handle change in correct answer selection
    const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestionData(prev => ({
            ...prev,
            correct_answer: parseInt(e.target.value)
        }));
    };

    // Adding a new exam
    const handleAddExam = async () => {
        try {
            const response = await axios.post(
                'https://24onlinesystem.vercel.app/exams',
                newExamData
            );
            console.log('Exam added:', response.data);
            fetchExams(); // Re-fetch exams after adding a new one
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding exam:', error);
        }
    };

    // Handle changes in the form fields for new exam data
    const handleNewExamDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewExamData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Opening the modal for adding a question
    const openModal = (examType: string) => {
        setQuestionData(prev => ({
            ...prev,
            type: examType
        }));
        setIsModalOpen(true);
    };

    if (loading) return <CustomLoader />;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
            <h3 className="text-2xl font-bold text-[#051568] mb-6">الاختبارات</h3>

            {/* Add New Exam Button */}
            <div className="mb-4 flex justify-between items-center">
                <h4 className="text-xl font-semibold">إضافة اختبار جديد</h4>
                <button
                    onClick={() => setIsModalOpen(true)} // Open modal for adding exam
                    className="px-6 py-3 bg-[#051568] text-white font-semibold rounded-md shadow-md hover:bg-[#042b5d] transition duration-300"
                >
                    إضافة اختبار
                </button>
            </div>

            {/* Exam List */}
            <div className="space-y-4">
                {exams.length > 0 ? (
                    <ul className="list-none">
                        {exams.map((exam) => (
                            <li
                                key={exam.exam_id}
                                className="border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition duration-200"
                            >
                                <p className="text-xl font-medium">{exam.type}</p>
                                <p className="text-sm text-gray-600">الدرجة النهائية: {exam.max_score}</p>
                                <p className="text-sm text-gray-600">المدة: {exam.duration}</p>
                                {/* Add question button for each exam */}
                                <button
                                    onClick={() => openModal(exam.type)}
                                    className="mt-2 px-4 py-2 bg-[#051568] text-white rounded-md hover:bg-[#042b5d] transition duration-300"
                                >
                                    إضافة سؤال إلى الاختبار
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600">لا توجد اختبارات متاحة حالياً.</p>
                )}
            </div>

            {/* Modal for adding exam */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h4 className="text-xl font-semibold text-[#051568] mb-4">إضافة اختبار جديد</h4>
                        <form>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">نوع الاختبار</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={newExamData.type}
                                    onChange={handleNewExamDataChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="أدخل نوع الاختبار"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">الدرجة النهائية</label>
                                <input
                                    type="number"
                                    name="max_score"
                                    value={newExamData.max_score}
                                    onChange={handleNewExamDataChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="أدخل الدرجة النهائية"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">الدرجة للنجاح</label>
                                <input
                                    type="number"
                                    name="pass_score"
                                    value={newExamData.pass_score}
                                    onChange={handleNewExamDataChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="أدخل درجة النجاح"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">عدد الأسئلة</label>
                                <input
                                    type="number"
                                    name="number_of_questions"
                                    value={newExamData.number_of_questions}
                                    onChange={handleNewExamDataChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="أدخل عدد الأسئلة"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">المدة</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={newExamData.duration}
                                    onChange={handleNewExamDataChange}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="أدخل مدة الاختبار"
                                />
                            </div>
                            {/* Removed co_id selection */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleAddExam}
                                    className="px-6 py-3 bg-[#051568] text-white font-semibold rounded-md shadow-md hover:bg-[#042b5d] transition duration-300"
                                >
                                    إضافة الاختبار
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 ml-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
                                >
                                    إغلاق
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamsTab;
