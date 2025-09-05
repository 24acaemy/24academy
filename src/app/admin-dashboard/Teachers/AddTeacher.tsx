"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/services/firebase'; // Adjust path if necessary
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; // Import Firestore functions for setting document

interface Country {
    translations: {
        ara?: {
            common: string;
        };
    };
}

const AddTeacher = () => {
    const [teacherData, setTeacherData] = useState({
        name: '',
        nationality: '',
        phone: '',
        gender: '',
        birthdate: '',
        specialization: '',
        email: '',
        password: '' // Add password field
    });

    const [errors, setErrors] = useState({
        name: '',
        nationality: '',
        phone: '',
        gender: '',
        birthdate: '',
        specialization: '',
        email: '',
        password: '' // Add password error field
    });

    const [nationalities, setNationalities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch nationalities from API
    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const countries: Country[] = await response.json(); // Now using a typed array
                const nationalitiesList = countries
                    .map((country) => country.translations?.ara?.common)
                    .filter((name) => name); // Filter out countries without Arabic translation

                // Sort the nationalities alphabetically
                nationalitiesList.sort((a, b) => a.localeCompare(b));

                setNationalities(nationalitiesList);
            } catch (err) {
            }
        };

        fetchNationalities();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setTeacherData({
            ...teacherData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {
            name: teacherData.name ? '' : 'اسم المعلم مطلوب',
            phone: teacherData.phone ? (/^\d+$/.test(teacherData.phone) ? '' : 'رقم الهاتف يجب أن يحتوي على أرقام فقط') : 'رقم الهاتف مطلوب',
            gender: teacherData.gender ? '' : 'الجنس مطلوب',
            birthdate: teacherData.birthdate ? '' : 'تاريخ الميلاد مطلوب',
            specialization: teacherData.specialization ? '' : 'التخصص مطلوب',
            email: teacherData.email ? (/^\S+@\S+\.\S+$/.test(teacherData.email) ? '' : 'البريد الإلكتروني غير صالح') : 'البريد الإلكتروني مطلوب',
            password: teacherData.password ? (teacherData.password.length >= 6 ? '' : 'كلمة المرور يجب أن تكون 6 أحرف على الأقل') : 'كلمة المرور مطلوبة' // Validate password length
        };

        setErrors(newErrors);
        return Object.values(newErrors).every((err) => err === '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Prepare data for submission
        const dataToSubmit = {
            te_name: teacherData.name, // Map name to te_name
            nationality: teacherData.nationality || "لم يحدد",
            phone: teacherData.phone,
            gender: teacherData.gender === 'male' ? false : true, // false for male, true for female
            birthdate: teacherData.birthdate,
            specialization: teacherData.specialization,
            email: teacherData.email,
        };

        try {
            // Create user in Firebase Authentication with password (without signing in)
            const userCredential = await createUserWithEmailAndPassword(auth, teacherData.email, teacherData.password);
            // We don't use the userCredential.user here to avoid automatic sign-in

            // Send the role data to Firestore without signing in
            await setDoc(doc(db, "users", userCredential.user.uid), {
                role: "teacher", // Only send the role
            });

            // Send the data to the API endpoint
            const response = await fetch("https://24onlinesystem.vercel.app/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSubmit), // Send the data in the required format
            });

            if (!response.ok) {
                throw new Error("Failed to send data to the server");
            }

            alert('تم إضافة المعلم بنجاح');

            // Clear form data
            setTeacherData({
                name: '',
                nationality: '',
                phone: '',
                gender: '',
                birthdate: '',
                specialization: '',
                email: '',
                password: '' // Clear the password field after successful submission
            });

        } catch (error) {
            console.error(error);
            alert('حدث خطأ في الاتصال بالخادم أو في إنشاء المستخدم');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-gray-100 bg-opacity-50 h-screen">
            <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
                <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
                    <h1 className="text-white text-lg font-semibold text-center">إضافة معلم جديد</h1>
                </div>

                <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm text-gray-600">اسم المعلم</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={teacherData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل اسم المعلم"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Nationality and Phone Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">الجنسية</label>
                                    <select
                                        name="nationality"
                                        value={teacherData.nationality}
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
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">رقم الهاتف</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={teacherData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                        placeholder="أدخل رقم الهاتف"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            {/* Birthdate and Specialization Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600">تاريخ الميلاد</label>
                                    <input
                                        type="date"
                                        name="birthdate"
                                        value={teacherData.birthdate}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    />
                                    {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">التخصص</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={teacherData.specialization}
                                        onChange={handleInputChange}
                                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                        placeholder="أدخل التخصص"
                                    />
                                    {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                                </div>
                            </div>

                            {/* Gender Field */}
                            <div>
                                <label className="block text-sm text-gray-600">الجنس</label>
                                <select
                                    name="gender"
                                    value={teacherData.gender}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                >
                                    <option value="">اختر الجنس</option>
                                    <option value="male">ذكر</option>
                                    <option value="female">أنثى</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm text-gray-600">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={teacherData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل البريد الإلكتروني"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm text-gray-600">كلمة المرور</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={teacherData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                                    placeholder="أدخل كلمة المرور"
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="w-full text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة معلم'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddTeacher;
