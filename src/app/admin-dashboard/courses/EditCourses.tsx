"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import CustomLoader from "@/app/components/spinned";

interface Course {
  co_id: number; // الرقم يجب أن يكون رقم وليس string
  co_name: string;
  description: string;
  duration: string;
  price: string;
  price_s: string;      // جديد
  co_order: number;     // جديد
  curriculum: string;
  created_at: string;
  specialization: string;
}

const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("https://24onlinesystem.vercel.app/courses");
        if (response.data) {
          setCourses(response.data);
        }
      } catch {
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId: number) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المقرر؟")) return;

    setLoading(true);
    try {
      alert("معذرة لا يمكنك الحذف");
    } catch (err) {
      console.error("Error deleting course:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setLoading(true);

    try {
      // إرسال البيانات حسب التنسيق المطلوب
      const response = await axios.put(
        `https://24onlinesystem.vercel.app/courses`,
        {
          co_id: selectedCourse.co_id,
          co_name: selectedCourse.co_name,
          description: selectedCourse.description,
          duration: selectedCourse.duration,
          price: selectedCourse.price,
          price_s: selectedCourse.price_s,
          co_order: selectedCourse.co_order,
          curriculum: selectedCourse.curriculum,
          specialization: selectedCourse.specialization,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert("تم تحديث المقرر بنجاح");
        setCourses(
          courses.map((course) =>
            course.co_id === selectedCourse.co_id ? selectedCourse : course
          )
        );
        setIsModalOpen(false);
      } else {
        alert("فشل في تحديث المقرر");
      }
    } catch (error) {
      console.error("Error while updating course:", error);
      alert("حدث خطأ أثناء تحديث المقرر");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setSelectedCourse((prev) => {
      if (!prev) return prev;

      // تأكد من تحويل co_order إلى رقم عند التغيير
      if (name === "co_order") {
        return { ...prev, [name]: Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  if (loading) return <CustomLoader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-[#051568] mb-6 text-center">إدارة المقررات</h3>
      {courses.length === 0 ? (
        <p className="text-center">لا توجد مقررات لعرضها.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.co_id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              <h4 className="text-xl font-semibold text-[#051568] mb-2">{course.co_name}</h4>
              <p className="text-gray-600 mb-2">
                <strong>التخصص:</strong> {course.specialization}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>السعر:</strong> {course.price} دولار
              </p>
              <p className="text-gray-600 mb-2">
                <strong>السعر الخاص:</strong> {course.price_s} ريال سعودي
              </p>
              <p className="text-gray-600 mb-2">
                <strong>المدة:</strong> {course.duration}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>الترتيب:</strong> {course.co_order}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>الوصف:</strong> {course.description}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>المناهج:</strong>{" "}
                <a
                  href={course.curriculum}
                  target="_blank"
                  className="text-blue-600"
                  rel="noreferrer"
                >
                  المناهج الدراسية
                </a>
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleEdit(course)}
                  className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(course.co_id)}
                  className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <h4 className="text-xl font-semibold text-[#051568] mb-4">تعديل المقرر</h4>
            <form onSubmit={handleSubmit}>
              {[
                "co_name",
                "description",
                "duration",
                "price",
                "price_s",
                "co_order",
                "curriculum",
                "specialization",
              ].map((field) => (
                <div className="mb-4" key={field}>
                  <label
                    className="block text-[#051568] font-semibold capitalize"
                    htmlFor={field}
                  >
                    {field.replace("_", " ")}
                  </label>

                  {field === "co_order" ? (
                    <input
                      type="number"
                      id={field}
                      name={field}
                      value={
                        selectedCourse[field as keyof Course] !== undefined
                          ? selectedCourse[field as keyof Course]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md mt-2"
                    />
                  ) : field === "curriculum" ? (
                    <input
                      type="url"
                      id={field}
                      name={field}
                      value={
                        selectedCourse[field as keyof Course] !== undefined
                          ? selectedCourse[field as keyof Course]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md mt-2"
                    />
                  ) : field === "specialization" ? (
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={
                        selectedCourse[field as keyof Course] !== undefined
                          ? selectedCourse[field as keyof Course]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md mt-2"
                    />
                  ) : (
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={
                        selectedCourse[field as keyof Course] !== undefined
                          ? selectedCourse[field as keyof Course]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md mt-2"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded-md"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "جاري التحديث..." : "تحديث المقرر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
