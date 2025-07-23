"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/app/components/ui/button";
import { Menu, X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
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
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header
      className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title with Home Link */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <Image
              src="/logo.png"
              alt="أكاديمية 24"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-lg font-bold text-primary arabic-text">أكاديمية 24</h1>
              <p className="text-xs text-muted-foreground arabic-text">للغات والتدريب</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
             <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors arabic-text"
            >
             الرئيسية
            </Link>

            <Link
              href="/Courses"
              className="text-foreground hover:text-primary transition-colors arabic-text"
            >
              الدورات
            </Link>

            {user && userRole === "admin" && (
              <>
                <Link
                  href="/admin-dashboard"
                  className="text-foreground hover:text-primary transition-colors arabic-text"
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/admin-reports"
                  className="text-foreground hover:text-primary transition-colors arabic-text"
                >
                  التقارير
                </Link>
              </>
            )}
            {user && userRole === "teacher" && (
              <Link
                href="/teacher-dashboard"
                className="text-foreground hover:text-primary transition-colors arabic-text"
              >
                لوحة التحكم
              </Link>
            )}
            {user && userRole !== "admin" && userRole !== "teacher" && (
              <Link
                href="/student-dashboard/my-courses"
                className="text-foreground hover:text-primary transition-colors arabic-text"
              >
                دوراتي
              </Link>
            )}

           
            <a
              href="#contact"
              className="text-foreground hover:text-primary transition-colors arabic-text"
            >
              تواصل معنا
            </a>

            <Link
              href="/Aboutus"
              className="text-foreground hover:text-primary transition-colors arabic-text"
            >
              من نحن
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {!user ? (
              <>
                <Button variant="outline" className="arabic-text">
                  <Link href="/login">تسجيل الدخول</Link>
                </Button>
                <Button className="academy-button-primary arabic-text">
                  <Link href="/signup">إنشاء حساب</Link>
                </Button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-100 p-2.5 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <FaUserCircle className="text-[#051568] text-xl" />
                  <span className="text-gray-600 text-sm font-medium">
                    {user.email}
                  </span>
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

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-background border-b border-border animate-fade-in">
            <div className="px-4 py-4 space-y-4">
               <a
                href="/"
                className="block text-foreground hover:text-primary transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </a>
              <Link
                href="/Courses"
                className="block text-foreground hover:text-primary transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                الدورات
              </Link>
              {user && userRole === "admin" && (
                <>
                  <Link
                    href="/admin-dashboard"
                    className="block text-foreground hover:text-primary transition-colors arabic-text"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    لوحة التحكم
                  </Link>
                  <Link
                    href="/admin-reports"
                    className="block text-foreground hover:text-primary transition-colors arabic-text"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    التقارير
                  </Link>
                </>
              )}
              {user && userRole === "teacher" && (
                <Link
                  href="/teacher-dashboard"
                  className="block text-foreground hover:text-primary transition-colors arabic-text"
                  onClick={() => setIsMenuOpen(false)}
                >
                  لوحة التحكم
                </Link>
              )}
              {user && userRole !== "admin" && userRole !== "teacher" && (
                <Link
                  href="/student-dashboard/my-courses"
                  className="block text-foreground hover:text-primary transition-colors arabic-text"
                  onClick={() => setIsMenuOpen(false)}
                >
                  دوراتي
                </Link>
              )}

             

              <a
                href="#contact"
                className="block text-foreground hover:text-primary transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                تواصل معنا
              </a>

              <Link
                href="/Aboutus"
                className="block text-foreground hover:text-primary transition-colors arabic-text"
                onClick={() => setIsMenuOpen(false)}
              >
                من نحن
              </Link>

              <div className="pt-4 space-y-2">
                {!user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full arabic-text"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/login");
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                    <Button
                      className="w-full academy-button-primary arabic-text"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push("/signup");
                      }}
                    >
                      إنشاء حساب
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full arabic-text"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
