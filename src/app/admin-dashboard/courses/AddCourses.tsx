"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface Specialization {
  spec_name: string;
}

// Define the expected structure of the error response
interface ErrorResponse {
  message: string;
}

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    co_name: "",
    description: "",
    duration: "",
    price: "",
    price_s: "",
    curriculum: "",
    specialization: "",
    co_order: "", // جديد
  });

  const [errors, setErrors] = useState({
    co_name: "",
    description: "",
    duration: "",
    price: "",
    price_s: "",
    curriculum: "",
    specialization: "",
    co_order: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get<Specialization[]>(
          "https://24onlinesystem.vercel.app/specializations"
        );
        setSpecializations(response.data);
      } catch (error) {
        alert("حدث خطأ في تحميل التخصصات");
      }
    };

    fetchSpecializations();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // URL validation regex
  const isValidUrl = (url: string) => {
    const regex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return regex.test(url);
  };

  const validateForm = () => {
    const newErrors = {
      co_name: courseData.co_name ? "" : "اسم الكورس مطلوب",
      description: courseData.description ? "" : "وصف الكورس مطلوب",
      duration: courseData.duration ? "" : "مدة الكورس مطلوبة",
      price: courseData.price ? "" : "السعر مطلوب",
      price_s: courseData.price_s ? "" : "السعر بالريال السعودي مطلوب",
      curriculum: isValidUrl(courseData.curriculum)
        ? ""
        : "رابط المنهج غير صالح",
      specialization: courseData.specialization ? "" : "التخصص مطلوب",
      co_order: courseData.co_order && !isNaN(Number(courseData.co_order)) ? "" : "الترتيب مطلوب ورقمي",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const formattedCurriculum = courseData.curriculum.replace(/\\/g, "/");

    const dataToSubmit = {
      co_name: courseData.co_name,
      description: courseData.description,
      duration: courseData.duration,
      price: courseData.price,
      price_s: courseData.price_s,
      curriculum: formattedCurriculum,
      specialization: courseData.specialization,
      co_order: Number(courseData.co_order),
    };

    try {
      const response = await axios.post(
        "https://24onlinesystem.vercel.app/courses",
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("تم إضافة الكورس بنجاح");
        setCourseData({
          co_name: "",
          description: "",
          duration: "",
          price: "",
          price_s: "",
          curriculum: "",
          specialization: "",
          co_order: "",
        });
      } else {
        alert(response.data.message || "حدث خطأ أثناء إضافة الكورس");
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        alert(
          `حدث خطأ في الخادم: ${axiosError.response.data.message || "يرجى المحاولة لاحقًا"}`
        );
      } else if (axiosError.request) {
        alert("حدث خطأ في الاتصال بالخادم");
      } else {
        alert("حدث خطأ أثناء إرسال البيانات");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-100 bg-opacity-50 h-screen">
      <div className="mx-auto container max-w-2xl md:w-3/4 shadow-lg rounded-xl overflow-hidden">
        <div className="bg-[#051568] p-6 border-t-2 bg-opacity-90 border-indigo-400 rounded-t-xl text-white">
          <h1 className="text-white text-lg font-semibold text-center">إضافة كورس جديد</h1>
        </div>

        <div className="bg-white p-8 shadow-sm rounded-b-xl space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* اسم الكورس */}
              <div>
                <label className="block text-sm text-gray-600">اسم الكورس</label>
                <input
                  type="text"
                  name="co_name"
                  value={courseData.co_name}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                  placeholder="أدخل اسم الكورس"
                />
                {errors.co_name && <p className="text-red-500 text-xs mt-1">{errors.co_name}</p>}
              </div>

              {/* وصف الكورس ومدة الكورس */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">وصف الكورس</label>
                  <input
                    type="text"
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    placeholder="أدخل وصف الكورس"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">مدة الكورس</label>
                  <input
                    type="text"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    placeholder="أدخل مدة الكورس"
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
                  )}
                </div>
              </div>

              {/* السعر والسعر بالريال السعودي */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">السعر</label>
                  <input
                    type="text"
                    name="price"
                    value={courseData.price}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    placeholder="أدخل سعر الكورس"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">السعر بالريال السعودي</label>
                  <input
                    type="text"
                    name="price_s"
                    value={courseData.price_s}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    placeholder="أدخل السعر بالريال السعودي"
                  />
                  {errors.price_s && <p className="text-red-500 text-xs mt-1">{errors.price_s}</p>}
                </div>
              </div>

              {/* رابط المنهج وترتيب الكورس */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">رابط المنهج</label>
                  <input
                    type="text"
                    name="curriculum"
                    value={courseData.curriculum}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    placeholder="أدخل رابط المنهج"
                  />
                  {errors.curriculum && (
                    <p className="text-red-500 text-xs mt-1">{errors.curriculum}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600">ترتيب الكورس</label>
                  <input
                    type="number"
                    name="co_order"
                    value={courseData.co_order}
                    onChange={handleInputChange}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                    placeholder="أدخل ترتيب الكورس"
                  />
                  {errors.co_order && <p className="text-red-500 text-xs mt-1">{errors.co_order}</p>}
                </div>
              </div>

              {/* التخصص */}
              <div>
                <label className="block text-sm text-gray-600">التخصص</label>
                <select
                  name="specialization"
                  value={courseData.specialization}
                  onChange={handleInputChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051568]"
                >
                  <option value="">اختر التخصص</option>
                  {specializations.map((specialization, index) => (
                    <option key={index} value={specialization.spec_name}>
                      {specialization.spec_name}
                    </option>
                  ))}
                </select>
                {errors.specialization && (
                  <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>
                )}
              </div>

              {/* زر الإرسال */}
              <div className="w-full text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#051568] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#051568] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "إضافة كورس"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddCourse;
