"use client";  // Ensures the component runs on the client-side

import { useState, useEffect } from "react";
import axios from "axios";
import { TopicCard } from "@/app/components/cards/card";
import CustomLoader from "../components/spinned";

// Define types for courses and API response
interface Course {
  id: string;
  name: string;
  description: string;
  price: string;
  price_s: string;
  duration: string;
  specialization: string;
  imageUrl?: string;
}

interface ApiCourse {
  co_id: string;
  co_name: string;
  description: string;
  price: string;
  price_s: string;
  duration: string;
  specialization: string;
  imageUrl?: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const itemsPerPage = 6;

  const defaultCourse: Course = {
    id: "default",
    name: "دورة افتراضية",
    description: "هذه دورة افتراضية لعرضها في حالة عدم توفر بيانات حقيقية.",
    price: "0",
    price_s: "0",
    duration: "0 أيام",
    specialization: "عام",
    imageUrl: "course.jpg",
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get<ApiCourse[]>('https://24onlinesystem.vercel.app/courses');
        const data = response.data;

        if (data.length === 0) {
          setError("لا توجد بيانات متاحة حاليًا. يرجى المحاولة مرة أخرى لاحقًا.");
          setCourses([defaultCourse]);
        } else {
          const coursesData = data.map((course: ApiCourse) => ({
            id: course.co_id,
            name: course.co_name,
            description: course.description,
            price: course.price,
            price_s: course.price_s,
            duration: course.duration,
            specialization: course.specialization,
            imageUrl: course.imageUrl || "course.jpg",
          }));

          setCourses(coursesData);

          const uniqueSpecializations = [...new Set(data.map((course: ApiCourse) => course.specialization))];
          setSpecializations(uniqueSpecializations);
        }
      } catch (error) {
        setError("حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا.");
        setCourses([defaultCourse]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory ? course.specialization === selectedCategory : true;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedCourses = filteredCourses.slice(0, page * itemsPerPage);

  const handleLoadMore = () => setPage(prevPage => prevPage + 1);

  const isLoadMoreDisabled = displayedCourses.length >= filteredCourses.length;

  if (isLoading) {
    return (
      <section
        className="courses-section py-16"
        id="section_2"
        dir="rtl"
        style={{
          backgroundImage: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
        }}
      >
        <div className="container mx-auto px-4 flex justify-center items-center" style={{ height: '80vh' }}>
          <CustomLoader />
        </div>
      </section>
    );
  }

  return (
    <section
      className="courses-section py-16"
      id="section_2"
      dir="rtl"
      style={{
        backgroundImage: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
      }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row relative">
        {/* Hamburger Menu for Mobile and Desktop */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-3 bg-transparent text-white rounded-md absolute top-4 right-4 z-10 hover:text-[#051568] transition-colors duration-300"
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
        >
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>

        {/* Sidebar Drawer */}
        <div
          className={`fixed inset-0 bg-[#051568] bg-opacity-50 z-20 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <div
          className={`fixed right-0 top-0 w-64 h-full bg-gradient-to-b from-[#e2ebf0] to-[#cfd9df] shadow-md p-6 z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 left-4 p-2 bg-gray-600 text-white rounded-full"
          >
            X
          </button>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">التخصصات</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`w-full text-left py-2 px-4 rounded-md text-lg ${!selectedCategory ? 'bg-[#051568] text-white' : 'bg-gray-100 text-gray-800'
                } hover:bg-blue-600 hover:text-white transition-all duration-200`}
            >
              الكل
            </button>
            {specializations.length > 0 ? (
              specializations.map((specialization, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(specialization)}
                  className={`w-full text-left py-2 px-4 rounded-md text-lg ${selectedCategory === specialization
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                    } hover:bg-blue-600 hover:text-white transition-all duration-200`}
                >
                  {specialization}
                </button>
              ))
            ) : (
              <p>لا توجد تخصصات</p>
            )}
          </div>
        </div>

        {/* Courses Display Section */}
        <div className="flex-grow md:w-full lg:w-3/4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#010029]">جميع الدورات</h2>
            <p className="text-lg text-gray-700 mt-2">استعرض جميع الدورات المتاحة لدينا.</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="ابحث عن دورة..."
              className="w-full p-3 border rounded-md text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Message and WhatsApp Button */}
          <div className="mb-8 text-center text-gray-700">
            <p className="mb-3 text-lg font-medium">
              غير متأكد من مستواك؟
            </p>
            <a
              href="https://wa.me/967780248024?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AA%D8%AD%D8%AF%D9%8A%D8%AF%20%D9%85%D8%B3%D8%AA%D9%88%D8%A7%D9%8A%D9%8A%20%D9%82%D9%85%20%D8%A8%D8%AA%D8%AD%D8%AF%D9%8A%D8%AF%20%D9%85%D9%88%D8%B9%D8%AF%20%D8%B1%D8%AC%D8%A7%D8%A1%D9%8B"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-academy-navy text-white py-3 px-6 rounded-lg shadow-lg hover:brightness-110 transition duration-300 font-semibold text-lg"
            >
              اضغط هنا لتحديد موعد تقييم مستواك
            </a>
          </div>

          {/* Display Courses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedCourses.length === 0 ? (
              <p>لا توجد دورات متاحة.</p>
            ) : (
              displayedCourses.map((course) => (
                <div key={course.id} className="mb-6 w-full">
                  <TopicCard
                    title={course.name}
                    description={course.description}
                    price={course.price}
                    duration={course.duration}
                    link={`Courses/${encodeURIComponent(course.name)}`}
                    imageUrl={course.imageUrl || "course.jpg"}
                  />
                </div>
              ))
            )}
          </div>

          {/* Display Error Message if No Data */}
          {error && (
            <div className="text-center text-red-500 mt-4">
              <p>{error}</p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              className={`py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoadMoreDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoadMoreDisabled}
            >
              تحميل المزيد
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
