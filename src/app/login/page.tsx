"use client";
import SubmitButton from "@/app/components/button";
import InputField from "@/app/components/inputfield";
import { HOME_ROUTE, REGISTER_ROUTE } from "@/constants/routes";
import Link from "next/link";
import { auth, db } from '@/services/firebase';
import { useLoginValidation } from '@/validationSchema/auth';  // Correct import for the hook
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import useAuthentication from "@/hooks/useAuthentication";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";  // Import Firestore methods
import { User } from "firebase/auth";

interface FormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    // Use the correct hook here
    const { handleSubmit, register, formState: { errors } } = useLoginValidation();
    const router = useRouter();
    useAuthentication();

    // Function to handle form submission
    const submitForm = async (values: FormValues) => {
        try {
            // Sign in the user with email and password
            await signInWithEmailAndPassword(auth, values.email, values.password);

            // Get the current user's UID (from Firebase Authentication)
            const uid = auth.currentUser?.uid;
            if (!uid) {
                throw new Error("User UID not found");
            }

            // Fetch the user data from Firestore
            const userDocRef = doc(db, "users", uid);  // Reference to the user document
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userRole = userData.role as string;  // Access the role field

                // Redirect based on the user's role
                if (userRole === "admin") {
                    router.push("/admin-dashboard");  // Admin dashboard route
                } else if (userRole === "teacher") {
                    router.push("/teacher-dashboard");  // Teacher dashboard route
                } else {
                    // Default to student dashboard or home
                    router.push(HOME_ROUTE);
                }
            } else {
                router.push(HOME_ROUTE); // Default route if no user data exists
            }
        } catch (e) {
            console.error("Login Error ", e.message);
            alert("يرجى المحاولة مرة أخرى");
        }
    };

    return (
        <section className="bg-white" dir="ltr">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end lg:col-span-7 lg:h-full xl:col-span-6">
                    <Image
                        alt="الشعار"
                        src="/logo.png"
                        layout="fill"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                </section>

                <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-5 lg:px-16 lg:py-12 xl:col-span-6">
                    <div className="max-w-xl lg:max-w-3xl w-full space-y-8">
                        <div className="text-center lg:hidden">
                            <h1 className="text-3xl font-bold text-[#051568]">
                                مرحبًا بك مجددًا لتسجيل الدخول
                            </h1>
                            <p className="mt-4 text-gray-500">
                                من فضلك أدخل بياناتك لمتابعة الدخول.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <InputField
                                    type="email"
                                    name="email"
                                    label="البريد الإلكتروني"
                                    placeholder="أدخل بريدك الإلكتروني"
                                    register={register}
                                    error={errors.email}
                                    className="w-full border-[#051568] border-2 rounded-md focus:ring-[#051568] focus:border-[#03457d] p-3"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <InputField
                                    type="password"
                                    name="password"
                                    label="كلمة المرور"
                                    placeholder="أدخل كلمة المرور"
                                    register={register}
                                    error={errors.password}
                                    className="w-full border-[#051568] border-2 rounded-md focus:ring-[#051568] focus:border-[#03457d] p-3"
                                />
                            </div>

                            {/* Submit Button and Sign Up Link */}
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-[#051568] text-white hover:bg-[#03457d] focus:outline-none focus:ring-2 focus:ring-[#03457d] rounded-md px-5 py-2.5 text-sm font-medium transition duration-300"
                                >
                                    تسجيل الدخول
                                </button>
                                <p className="text-sm text-gray-500">
                                    ليس لديك حساب؟{" "}
                                    <Link href={REGISTER_ROUTE} className="text-[#051568] underline">
                                        سجل هنا
                                    </Link>.
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
};

export default Login;
