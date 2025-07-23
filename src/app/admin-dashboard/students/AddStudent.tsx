"use client";
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// Define the type for student object
interface Student {
    en_id: string;
    co_name: string;
    // Add other properties if necessary
}

const AddStudent = () => {
    const [studentData, setStudentData] = useState({
        name: '',
        nationality: '',
        phone1: '',
        phone2: '', // إضافة حقل phone2
        gender: '', // سيكون إما true أو false
        birthdate: '',
        email: ''
    });

    const [errors, setErrors] = useState({
        name: '',
        nationality: '',
        phone1: '',
        phone2: '',
        gender: '',
        birthdate: '',
        email: ''
    });

    const [nationalities, setNationalities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch nationalities from API
    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const countries = await response.json();
                const nationalitiesList = countries
                    .map((country: any) => country.translations?.ara?.common)
                    .filter((name: string) => name); // Filter out countries without Arabic translation 

                // Sort the nationalities alphabetically
                nationalitiesList.sort((a: string, b: string) => a.localeCompare(b));

                setNationalities(nationalitiesList);
            } catch (error) {
                alert("حدث خطأ في تحميل الجنسيات");
            }
        };

        fetchNationalities();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setStudentData({
            ...studentData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {
            name: studentData.name ? '' : 'اسم الطالب مطلوب',
            nationality: studentData.nationality ? '' : 'الجنسية مطلوبة',
            phone1: studentData.phone1 ? (/^\d{9,}$/.test(studentData.phone1) ? '' : 'رقم الهاتف يجب أن يكون على الأقل 9 أرقام') : 'رقم الهاتف مطلوب',
            phone2: studentData.phone2 && !(/^\d{9,}$/.test(studentData.phone2)) ? 'رقم الهاتف الثاني يجب أن يكون على الأقل 9 أرقام' : '', // تحقق من phone2 إذا تم إدخاله
            gender: studentData.gender ? '' : 'الجنس مطلوب',
            birthdate: studentData.birthdate ? '' : 'تاريخ الميلاد مطلوب',
            email: studentData.email ? (/^\S+@\S+\.\S+$/.test(studentData.email) ? '' : 'البريد الإلكتروني غير صالح') : 'البريد الإلكتروني مطلوب'
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Log studentData to check the structure before sending
        console.log("Student Data to Submit: ", studentData);

        // Prepare data for submission
        const dataToSubmit = {
            stu_name: studentData.name,          // Map name to stu_name
            nationality: studentData.nationality,
            phone1: studentData.phone1,
            phone2: studentData.phone2 || null,  // إذا كانت phone2 فارغة يتم إرسالها كـ null
            gender: studentData.gender === 'male', // إما true أو false بناءً على القيمة
            birthdate: studentData.birthdate,
            email: studentData.email,
        };

        try {
            const response = await axios.post('https://24onlinesystem.vercel.app/students', dataToSubmit, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                alert('تم إضافة الطالب بنجاح');
                setStudentData({
                    name: '',
                    nationality: '',
                    phone1: '',
                    phone2: '',
                    gender: '',
                    birthdate: '',
                    email: ''
                });
            } else {
                console.log(response.status)
                alert(response.data.message || 'حدث خطأ أثناء إضافة الطالب');
            }
        } catch (error: unknown) {
            // Handle error in a user-friendly manner
            const axiosError = error as AxiosError;
            alert('حدث خطأ في الاتصال بالخادم');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Example of using the `studentsInCourse` variable with the correct type
    const studentsInCourse: Student[] = [
        { en_id: '001', co_name: 'Math 101' },
        { en_id: '002', co_name: 'History 202' },
        // Add other students as needed
    ];

    const uniqueStudents = Array.from(new Map(
        studentsInCourse.map((student: Student) => [`${student.en_id}-${student.co_name}`, student])
    ).values());

    return (
        <section className="bg-gray-100 bg-opacity-50 h-screen">
            <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
                    <h1 className="text-white text-lg font-semibold text-center">إضافة طالب جديد</h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم الطالب</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={studentData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل اسم الطالب"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Nationality and Phone Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">الجنسية</label>
                                    <select
                                        name="nationality"
                                        value={studentData.nationality}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    >
                                        <option value="">اختر الجنسية</option>
                                        {nationalities.map((nationality, index) => (
                                            <option key={index} value={nationality}>
                                                {nationality}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">رقم الهاتف</label>
                                    <input
                                        type="text"
                                        name="phone1"
                                        value={studentData.phone1}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                        placeholder="أدخل رقم الهاتف"
                                    />
                                    {errors.phone1 && <p className="text-red-500 text-xs mt-1">{errors.phone1}</p>}
                                </div>
                            </div>

                            {/* Phone2 Field */}
                            <div>
                                <label className="block text-sm text-gray-600">رقم الهاتف الثاني</label>
                                <input
                                    type="text"
                                    name="phone2"
                                    value={studentData.phone2}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل رقم الهاتف الثاني (اختياري)"
                                />
                                {errors.phone2 && <p className="text-red-500 text-xs mt-1">{errors.phone2}</p>}
                            </div>

                            {/* Birthdate and Gender Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">تاريخ الميلاد</label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={studentData.birthdate}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    />
                                    {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">الجنس</label>
                                    <select
                                        name="gender"
                                        value={studentData.gender}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    >
                                        <option value="">اختر الجنس</option>
                                        <option value="male">ذكر</option>
                                        <option value="female">أنثى</option>
                                    </select>
                                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm text-gray-600">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={studentData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل البريد الإلكتروني"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة طالب'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddStudent;
