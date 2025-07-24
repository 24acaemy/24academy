"use client";
import { auth } from '@/services/firebase';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRegisterValidation } from "@/validationSchema/auth";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/constants/routes";
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
    const router = useRouter();
    const { handleSubmit, register, formState: { errors }, reset } = useRegisterValidation();
    const [nationalities, setNationalities] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch nationalities from REST Countries API
    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                if (!response.ok) {
                    throw new Error('Failed to fetch nationalities');
                }
                const countries = await response.json();
                const nationalitiesList = countries
                    .map((country: any) => country.translations?.ara?.common)
                    .filter(Boolean)
                    .sort((a: string, b: string) => a.localeCompare(b));
                setNationalities(nationalitiesList);
            } catch (error) {
                console.error("Error fetching nationalities:", error);
                setServerError("حدث خطأ في تحميل قائمة الجنسيات. يرجى المحاولة لاحقاً");
            }
        };
        fetchNationalities();
    }, []);

    // Handle form submission
    const submitForm = async (values: {
        firstName: string;
        birthDate: string;
        gender: string;
        phoneNumber: string;
        nationality: string;
        email: string;
        password: string;
        cnfPassword: string;
        terms: boolean;
    }) => {
        if (!values.terms) {
            setServerError("يجب الموافقة على الشروط والأحكام");
            return;
        }

        setIsSubmitting(true);
        setServerError(null);
        setSuccessMessage(null);

        try {
            // Convert gender string to boolean
            const genderBoolean = values.gender === "true";

            // Prepare user data for backend
            const userData = {
                stu_name: values.firstName,
                gender: genderBoolean,
                email: values.email.toLowerCase(),
                nationality: values.nationality || "لم يحدد",
                birthdate: values.birthDate,
                phone1: values.phoneNumber,
                phone2: null,
                created_at: new Date().toISOString(),
            };

            // Step 1: Create Firebase user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email.toLowerCase(),
                values.password
            );

            // Step 2: Save user data to backend
            const response = await axios.post(
                "https://24onlinesystem.vercel.app/students",
                userData,
                { 
                    headers: { "Content-Type": "application/json" },
                    validateStatus: (status) => status < 500 // Consider status codes less than 500 as success
                }
            );

            if (response.status !== 201) {
                // Rollback Firebase user if backend fails
                await auth.currentUser?.delete();
                
                // Handle server validation errors
                if (response.data?.errors) {
                    const serverErrors = Object.values(response.data.errors).join('\n');
                    throw new Error(serverErrors);
                }
                
                throw new Error(response.data?.message || "رفض السيرفر الطلب");
            }

            // Reset form and show success message
            reset();
            setSuccessMessage("تم إنشاء الحساب بنجاح! سيتم توجيهك إلى الصفحة الرئيسية...");
            
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push(HOME_ROUTE);
            }, 2000);

        } catch (error: any) {
            let errorMessage = "حدث خطأ غير متوقع";
            
            // Firebase Errors
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = "البريد الإلكتروني مستخدم بالفعل";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "بريد إلكتروني غير صالح";
                        break;
                    case 'auth/weak-password':
                        errorMessage = "كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)";
                        break;
                    default:
                        errorMessage = "حدث خطأ في إنشاء الحساب";
                }
            } 
            // Axios Errors
            else if (error.response) {
                errorMessage = error.response.data?.message || 
                              error.response.data?.error ||
                              `خطأ في السيرفر (${error.response.status})`;
            } 
            else if (error.request) {
                errorMessage = "لا يوجد اتصال بالسيرفر، يرجى المحاولة لاحقاً";
            } 
            else {
                errorMessage = error.message || "حدث خطأ أثناء الإرسال";
            }

            setServerError(errorMessage);
            console.error("Submission error:", {
                error: error,
                time: new Date().toISOString(),
                email: values.email
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-white lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="شعار الموقع"
                        src="/logo.png"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                </section>

                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6" dir="rtl">
                    <div className="max-w-xl lg:max-w-3xl w-full">
                        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                            مرحبًا بك في التسجيل
                        </h1>
                        <p className="mt-4 leading-relaxed text-gray-500">
                            أنشئ حسابًا للبدء في استخدام خدماتنا.
                        </p>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                                {successMessage}
                            </div>
                        )}

                        {/* Server Error Message */}
                        {serverError && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                {serverError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(submitForm)} className="mt-8 grid grid-cols-6 gap-6">
                            {/* Form Fields - Remain the same as before */}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                  الاسم كاملاً
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("firstName")}
                                />
                                {errors.firstName && <span className="text-red-600 text-xs">{errors.firstName.message}</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                                    تاريخ الميلاد
                                </label>
                                <input
                                    type="date"
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("birthDate")}
                                />
                                {errors.birthDate && <span className="text-red-600 text-xs">{errors.birthDate.message}</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                    الجنس
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("gender")}
                                >
                                    <option value="">اختر الجنس</option>
                                    <option value="true">ذكر</option>
                                    <option value="false">أنثى</option>
                                </select>
                                {errors.gender && <span className="text-red-600 text-xs">{errors.gender.message}</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    رقم الهاتف
                                </label>
                                <input
                                    type="tel"
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("phoneNumber")}
                                />
                                {errors.phoneNumber && <span className="text-red-600 text-xs">{errors.phoneNumber.message}</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                                    الجنسية
                                </label>
                                <select
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("nationality")}
                                >
                                    <option value="">اختر الجنسية</option>
                                    {nationalities.map((nationality, index) => (
                                        <option key={index} value={nationality}>{nationality}</option>
                                    ))}
                                </select>
                                {errors.nationality && <span className="text-red-600 text-xs">{errors.nationality.message}</span>}
                            </div>

                            <div className="col-span-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    البريد الإلكتروني
                                </label>
                                <input
                                    type="email"
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("email")}
                                />
                                {errors.email && <span className="text-red-600 text-xs">{errors.email.message}</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    كلمة المرور
                                </label>
                                <input
                                    type="password"
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("password")}
                                />
                                {errors.password && <span className="text-red-600 text-xs">{errors.password.message}</span>}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="cnfPassword" className="block text-sm font-medium text-gray-700">
                                    تأكيد كلمة المرور
                                </label>
                                <input
                                    type="password"
                                    className="mt-1 w-full rounded-md border-gray-300 bg-white text-sm shadow-md p-3"
                                    {...register("cnfPassword")}
                                />
                                {errors.cnfPassword && <span className="text-red-600 text-xs">{errors.cnfPassword.message}</span>}
                            </div>

                            <div className="col-span-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="mr-2"
                                        {...register("terms")}
                                    />
                                    <span>أوافق على الشروط والأحكام</span>
                                </label>
                                {errors.terms && <span className="text-red-600 text-xs">{errors.terms.message}</span>}
                            </div>

                            <div className="col-span-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            جاري التسجيل...
                                        </span>
                                    ) : "إنشاء الحساب"}
                                </button>
                            </div>

                            <div className="col-span-6 text-center">
                                <p className="text-sm text-gray-600">
                                    لديك حساب بالفعل؟{' '}
                                    <Link href={LOGIN_ROUTE} className="text-blue-600 hover:underline">
                                        تسجيل الدخول
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default Register;
