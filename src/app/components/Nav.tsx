"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth, db } from '@/services/firebase';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserRole(userData.role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="bg-white shadow-md backdrop-blur-lg bg-opacity-50 sticky top-0 z-50" dir="rtl">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="sr-only">الصفحة الرئيسية</span>
          <Image
            src="/logo.png"
            alt="الشعار"
            width={70}
            height={15}
            className="object-contain max-w-full h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link className="text-gray-600 hover:text-[#051568] transition duration-200" href="/Courses">
                الدورات
              </Link>
            </li>
            {user && userRole === "admin" && (
              <>
                <li>
                  <Link className="text-gray-600 hover:text-[#051568] transition duration-200" href="/admin-dashboard">
                    لوحة التحكم
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-[#051568] transition duration-200" href="/admin-reports">
                    التقارير
                  </Link>
                </li>
              </>
            )}
            {user && userRole === "teacher" && (
              <>
                <li>
                  <Link className="text-gray-600 hover:text-[#051568] transition duration-200" href="/teacher-dashboard">
                  لوحة التخكم
                  </Link>
                </li>
                
              </>
            )}
            {user && userRole !== "admin" && userRole !== "teacher" && (
              <li>
                <Link className="text-gray-600 hover:text-[#051568] transition duration-200" href="/student-dashboard/my-courses">
                  دوراتي
                </Link>
              </li>
            )}
         
            <li>
              <Link className="text-gray-600 hover:text-[#051568] transition duration-200" href="/Aboutus">
                من نحن
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex gap-4">
              <Link
                className="rounded-md bg-[#051568] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#03457d] transition duration-200"
                href="/login"
              >
                تسجيل الدخول
              </Link>
              <Link
                className="hidden rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-[#051568] hover:bg-gray-200 transition duration-200 sm:block"
                href="/signup"
              >
                التسجيل
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <FaUserCircle className="text-[#051568] text-xl" />
                <span className="text-gray-600 text-sm font-medium">{user.email}</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md w-48 z-10">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="block rounded bg-gray-100 p-2.5 text-gray-600 hover:text-gray-800 transition duration-200 md:hidden"
        >
          <span className="sr-only">فتح القائمة</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-md p-4 transition-all ease-in-out duration-300`}
      >
        <nav aria-label="Global" className="flex flex-col gap-4">
          <ul>
            <li className="border-b border-gray-200 py-2">
              <Link
                className="block text-gray-600 hover:text-[#051568] transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100"
                href="/Courses"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الدورات
              </Link>
            </li>
            {user && userRole === "admin" && (
              <>
                <li className="border-b border-gray-200 py-2">
                  <Link
                    className="block text-gray-600 hover:text-[#051568] transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100"
                    href="/admin-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                </li>
                <li className="border-b border-gray-200 py-2">
                  <Link
                    className="block text-gray-600 hover:text-[#051568] transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100"
                    href="/admin-reports"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    التقارير
                  </Link>
                </li>
              </>
            )}
            {user && userRole === "teacher" && (
              <>
                <li className="border-b border-gray-200 py-2">
                  <Link
                    className="block text-gray-600 hover:text-[#051568] transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100"
                    href="/teacher-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                   لوحة التحكم
                  </Link>
                </li>
               
              </>
            )}
            {user && userRole !== "admin" && userRole !== "teacher" && (
              <li className="border-b border-gray-200 py-2">
                <Link
                  className="block text-gray-600 hover:text-[#051568] transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100"
                  href="/student-dashboard/my-courses"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  دوراتي
                </Link>
              </li>
            )}
       
            <li className="py-2">
              <Link
                className="block text-gray-600 hover:text-[#051568] transition duration-200 px-4 py-2 rounded-md hover:bg-gray-100"
                href="/Aboutus"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                من نحن
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
