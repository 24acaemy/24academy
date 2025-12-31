import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import CustomLoader from "@/app/components/spinned";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// الأنواع
interface Grade {
  grade_id: string;
  stu_id: string;
  type: string;
  state: "معلق" | "معتمد" | "مرفوض";
  score: number;
  pass_score: number;
  max_score: number;
  created_at: string;
  updated_at: string;
  teacher_notes?: string;
}

interface StudentData {
  stu_id: string;
  stu_name: string;
  email: string;
  co_name: string;
  te_name: string;
  start_time: string;
  start_date: string;
  end_date: string;
  total_grade: number | null;
  ass_id: string;
  created_at: string;
  status: "مسجل" | "منسحب" | "مكتمل";
}

interface CourseDetails {
  course_name: string;
  course_code: string;
  semester: string;
  teacher_name: string;
  total_students: number;
}

interface GradesTabProps {
  ass_id: string;
  teacherId: string;
}

const GradesTab: React.FC<GradesTabProps> = ({ ass_id, teacherId }) => {
  const [studentsData, setStudentsData] = useState<StudentData[]>([]);
  const [gradesMap, setGradesMap] = useState<Record<string, Grade[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [editingGrade, setEditingGrade] = useState<{ studentId: string; gradeId: string } | null>(null);
  const [newGrade, setNewGrade] = useState<Partial<Grade>>({});
  const [isAddingGrade, setIsAddingGrade] = useState<boolean>(false);
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("الجميع");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "grade" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // جلب البيانات بشكل متوازي مع معالجة الأخطاء
  const fetchData = useCallback(async () => {
    if (!ass_id || !teacherId) {
      setError("معرف المهمة أو المعلم غير متوفر");
      setLoading(false);
      return;
    }

    // إلغاء الطلبات السابقة
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // جلب بيانات الطلاب والمعلومات معًا
      const [studentsResponse, gradesResponse, courseResponse] = await Promise.allSettled([
        axios.get<StudentData[]>(`https://24onlinesystem.vercel.app/course_students/ass_id=${ass_id}`, {
          signal: abortControllerRef.current.signal,
          timeout: 10000,
          params: { teacher_id: teacherId }
        }),
        axios.get<Grade[]>(`https://24onlinesystem.vercel.app/grades`, {
          signal: abortControllerRef.current.signal,
          timeout: 10000,
          params: { 
            ass_id,
            teacher_id: teacherId 
          }
        }),
        axios.get<CourseDetails>(`https://24onlinesystem.vercel.app/course_details`, {
          signal: abortControllerRef.current.signal,
          timeout: 10000,
          params: { ass_id }
        })
      ]);

      // معالجة استجابة الطلاب
      if (studentsResponse.status === "fulfilled") {
        const students = studentsResponse.value.data;
        
        // التحقق من أن المدرس لديه صلاحية الوصول لهذه المهمة
        const unauthorizedStudents = students.filter(s => !s.te_name.includes(teacherId));
        if (unauthorizedStudents.length > 0) {
          toast.warning("بعض الطلاب ليسوا تحت إشرافك");
        }
        
        setStudentsData(students);
      } else {
        if (studentsResponse.reason.name !== 'CanceledError') {
          throw new Error("فشل في تحميل بيانات الطلاب");
        }
      }

      // معالجة استجابة الدرجات
      if (gradesResponse.status === "fulfilled") {
        const grades = gradesResponse.value.data;
        const groupedGrades = grades.reduce((acc, grade) => {
          // التحقق من صحة بيانات الدرجة
          if (!grade.stu_id || grade.score === undefined || grade.score < 0) {
            console.warn("بيانات درجة غير صالحة:", grade);
            return acc;
          }
          
          if (!acc[grade.stu_id]) {
            acc[grade.stu_id] = [];
          }
          acc[grade.stu_id].push(grade);
          return acc;
        }, {} as Record<string, Grade[]>);
        
        setGradesMap(groupedGrades);
      }

      // معالجة استجابة معلومات الدورة
      if (courseResponse.status === "fulfilled") {
        setCourseDetails(courseResponse.value.data);
      } else {
        setCourseDetails({
          course_name: `المهمة ${ass_id}`,
          course_code: "غير معروف",
          semester: "غير معروف",
          teacher_name: teacherId,
          total_students: studentsData.length
        });
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      
      if (error.name === 'CanceledError') {
        return;
      }
      
      const errorMessage = error.response?.status === 403 
        ? "ليس لديك صلاحية للوصول إلى هذه المهمة"
        : error.response?.status === 404
        ? "المهمة غير موجودة"
        : error.message?.includes('timeout')
        ? "انتهت المهلة في تحميل البيانات"
        : "حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [ass_id, teacherId, studentsData.length]);

  useEffect(() => {
    fetchData();
    
    // إضافة مستمع لتحديث البيانات عند العودة للنافذة
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // دمج بيانات الطلاب مع درجاتهم
  const mergedData = useMemo(() => {
    return studentsData.map(student => {
      const grades = gradesMap[student.stu_id] || [];
      const totalScore = grades.reduce((sum, grade) => sum + (grade.score || 0), 0);
      const averageGrade = grades.length > 0 ? totalScore / grades.length : null;
      
      return {
        ...student,
        grades,
        averageGrade,
        hasGrades: grades.length > 0,
        lastGradeDate: grades.length > 0 
          ? new Date(Math.max(...grades.map(g => new Date(g.updated_at || g.created_at).getTime()))).toLocaleDateString('ar-SA')
          : null
      };
    });
  }, [studentsData, gradesMap]);

  // فلترة وترتيب البيانات
  const filteredAndSortedData = useMemo(() => {
    let filtered = mergedData;
    
    // التصفية حسب الحالة
    if (filterStatus !== "الجميع") {
      filtered = filtered.filter(student => student.status === filterStatus);
    }
    
    // البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.stu_name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.stu_id?.includes(query)
      );
    }
    
    // الترتيب
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = (a.stu_name || '').localeCompare(b.stu_name || '', 'ar');
          break;
        case "grade":
          const gradeA = a.averageGrade ?? 0;
          const gradeB = b.averageGrade ?? 0;
          comparison = gradeA - gradeB;
          break;
        case "status":
          comparison = (a.status || '').localeCompare(b.status || '', 'ar');
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [mergedData, filterStatus, searchQuery, sortBy, sortOrder]);

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const total = mergedData.length;
    const withGrades = mergedData.filter(s => s.hasGrades).length;
    const completed = mergedData.filter(s => s.status === "مكتمل").length;
    const withdrawn = mergedData.filter(s => s.status === "منسحب").length;
    const gradesWithValue = mergedData.filter(s => s.averageGrade !== null);
    const average = gradesWithValue.length > 0
      ? gradesWithValue.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / gradesWithValue.length
      : 0;
    
    return { total, withGrades, completed, withdrawn, average: Math.round(average * 100) / 100 };
  }, [mergedData]);

  const toggleStudentGrades = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleEditGrade = (studentId: string, grade: Grade) => {
    setEditingGrade({ studentId, gradeId: grade.grade_id });
    setNewGrade({ 
      type: grade.type,
      score: grade.score,
      max_score: grade.max_score,
      pass_score: grade.pass_score,
      state: grade.state,
      teacher_notes: grade.teacher_notes
    });
  };

  const handleSaveGrade = async () => {
    if (!editingGrade || !newGrade.score || newGrade.score < 0 || !newGrade.max_score) {
      toast.error("يرجى إدخال درجة صالحة");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `https://24onlinesystem.vercel.app/grades/${editingGrade.gradeId}`,
        {
          ...newGrade,
          updated_at: new Date().toISOString(),
          teacher_id: teacherId
        },
        {
          timeout: 5000,
          params: { teacher_id: teacherId }
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("تم تحديث الدرجة بنجاح");
        fetchData();
        setEditingGrade(null);
        setNewGrade({});
      } else {
        throw new Error('فشل في تحديث الدرجة');
      }
    } catch (error: any) {
      console.error("Error updating grade:", error);
      toast.error(error.response?.data?.message || "فشل في تحديث الدرجة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddGrade = async (studentId: string) => {
    if (!newGrade.type || newGrade.score === undefined || !newGrade.max_score) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("https://24onlinesystem.vercel.app/grades", {
        stu_id: studentId,
        ass_id,
        type: newGrade.type,
        score: newGrade.score || 0,
        max_score: newGrade.max_score || 100,
        pass_score: newGrade.pass_score || 50,
        state: "معلق",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        teacher_id: teacherId
      }, {
        timeout: 5000
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("تم إضافة الدرجة بنجاح");
        setIsAddingGrade(false);
        setSelectedStudentForGrade(null);
        setNewGrade({});
        fetchData();
      } else {
        throw new Error('فشل في إضافة الدرجة');
      }
    } catch (error: any) {
      console.error("Error adding grade:", error);
      toast.error(error.response?.data?.message || "فشل في إضافة الدرجة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الدرجة؟")) return;

    setIsSubmitting(true);
    try {
      const response = await axios.delete(
        `https://24onlinesystem.vercel.app/grades/${gradeId}`,
        {
          timeout: 5000,
          params: { teacher_id: teacherId }
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("تم حذف الدرجة بنجاح");
        fetchData();
      } else {
        throw new Error('فشل في حذف الدرجة');
      }
    } catch (error: any) {
      console.error("Error deleting grade:", error);
      toast.error(error.response?.data?.message || "فشل في حذف الدرجة");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToExcel = () => {
    try {
      // تحويل البيانات لصيغة CSV
      const headers = ["الاسم", "البريد الإلكتروني", "المعدل", "الحالة", "عدد الاختبارات", "آخر تحديث"];
      const csvData = filteredAndSortedData.map(student => [
        student.stu_name || "",
        student.email || "",
        student.averageGrade?.toFixed(2) || "لا يوجد",
        student.status || "",
        student.grades.length.toString(),
        student.lastGradeDate || "لا يوجد"
      ]);

      const csvContent = [
        '\ufeff' + headers.join(","), // BOM for UTF-8 with Arabic
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `درجات_المهمة_${ass_id}_${new Date().toISOString().split('T')[0]}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("تم تصدير البيانات بنجاح");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("فشل في تصدير البيانات");
    }
  };

  if (loading) return <CustomLoader text="جاري تحميل بيانات الدرجات..." />;

  if (error && studentsData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{error}</h3>
          <button
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer 
        position="top-left" 
        rtl 
        autoClose={3000}
        pauseOnHover
        theme="light"
      />
      
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            درجات المهمة: {courseDetails?.course_name || `رقم ${ass_id}`}
          </h3>
          {courseDetails && (
            <p className="text-gray-600 text-sm md:text-base">
              {courseDetails.course_code} - {courseDetails.teacher_name} - الفصل: {courseDetails.semester}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={exportToExcel}
            disabled={filteredAndSortedData.length === 0}
            className={`${filteredAndSortedData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''} bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base`}
          >
            <span>تصدير</span>
            <span>📊</span>
          </button>
          <button
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base"
          >
            <span>تحديث</span>
            <span>🔄</span>
          </button>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          { label: "إجمالي الطلاب", value: statistics.total, color: "blue" },
          { label: "لديهم درجات", value: statistics.withGrades, color: "green" },
          { label: "مكتملين", value: statistics.completed, color: "purple" },
          { label: "منسحبين", value: statistics.withdrawn, color: "yellow" },
          { label: "المعدل العام", value: statistics.average.toFixed(1), color: "indigo" }
        ].map((stat, index) => (
          <div key={index} className={`bg-${stat.color}-50 p-3 md:p-4 rounded-lg border border-${stat.color}-200`}>
            <div className={`text-${stat.color}-700 text-xl md:text-2xl font-bold`}>{stat.value}</div>
            <div className={`text-${stat.color}-600 text-sm md:text-base`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ابحث عن طالب بالاسم أو البريد أو الرقم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 md:p-3 border rounded-lg text-sm md:text-base"
          >
            <option value="الجميع">الجميع</option>
            <option value="مسجل">مسجل</option>
            <option value="مكتمل">مكتمل</option>
            <option value="منسحب">منسحب</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 md:p-3 border rounded-lg text-sm md:text-base"
          >
            <option value="name">الاسم</option>
            <option value="grade">المعدل</option>
            <option value="status">الحالة</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 md:p-3 border rounded-lg bg-white hover:bg-gray-100 text-sm md:text-base"
          >
            {sortOrder === "asc" ? "تصاعدي ↑" : "تنازلي ↓"}
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-[#051568] text-white">
            <tr>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">#</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">الاسم</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">البريد الإلكتروني</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">المعدل</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">الحالة</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">الاختبارات</th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  لا توجد بيانات للعرض
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((student, index) => (
                <React.Fragment key={student.stu_id || index}>
                  <tr className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50 transition-colors`}>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">{index + 1}</td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center font-medium text-sm md:text-base">
                      {student.stu_name || "غير معروف"}
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center text-sm md:text-base">
                      {student.email || "غير معروف"}
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        student.averageGrade === null 
                          ? 'bg-gray-100 text-gray-700'
                          : student.averageGrade >= 70
                          ? 'bg-green-100 text-green-700'
                          : student.averageGrade >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.averageGrade?.toFixed(1) || "لا يوجد"}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                        student.status === "مكتمل" 
                          ? 'bg-green-100 text-green-700'
                          : student.status === "منسحب"
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {student.status || "غير معروف"}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs md:text-sm">
                        {student.grades.length}
                      </span>
                    </td>
                    <td className="py-3 px-4 md:py-4 md:px-6 text-center">
                      <div className="flex flex-col md:flex-row justify-center gap-1 md:gap-2">
                        <button
                          onClick={() => toggleStudentGrades(student.stu_id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs md:text-sm"
                        >
                          {expandedStudent === student.stu_id ? "إخفاء" : "عرض"}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudentForGrade(student.stu_id);
                            setIsAddingGrade(true);
                            setNewGrade({
                              type: "اختبار نهائي",
                              score: 0,
                              max_score: 100,
                              pass_score: 50
                            });
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs md:text-sm"
                        >
                          إضافة
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* الصف المنسدل للدرجات */}
                  {expandedStudent === student.stu_id && (
                    <tr className="bg-gray-100">
                      <td colSpan={7} className="py-4 px-4 md:py-6 md:px-6">
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <h4 className="text-lg font-semibold">درجات الطالب: {student.stu_name}</h4>
                            <span className="text-sm text-gray-500">
                              آخر تحديث: {student.lastGradeDate || "لا يوجد"}
                            </span>
                          </div>
                          
                          {student.grades.length === 0 ? (
                            <div className="text-center py-6 text-gray-500">
                              لا توجد درجات مسجلة لهذا الطالب
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                              {student.grades.map((grade, idx) => (
                                <div key={grade.grade_id || idx} className="border p-3 md:p-4 rounded-lg bg-white shadow-sm">
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3">
                                    <div>
                                      <div className="font-medium text-sm md:text-base">{grade.type}</div>
                                      <div className={`mt-1 px-2 py-1 rounded-full text-xs inline-block ${
                                        grade.state === "معتمد" 
                                          ? 'bg-green-100 text-green-700'
                                          : grade.state === "مرفوض"
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}>
                                        {grade.state}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleEditGrade(student.stu_id, grade)}
                                        className="text-blue-500 hover:text-blue-700 text-xs md:text-sm"
                                        disabled={isSubmitting}
                                      >
                                        تعديل
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGrade(grade.grade_id)}
                                        className="text-red-500 hover:text-red-700 text-xs md:text-sm"
                                        disabled={isSubmitting}
                                      >
                                        حذف
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>الدرجة:</span>
                                      <span className={`font-bold ${grade.score >= (grade.pass_score || 50) ? 'text-green-600' : 'text-red-600'}`}>
                                        {grade.score} / {grade.max_score}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>الدرجة المطلوبة:</span>
                                      <span>{grade.pass_score || 50}</span>
                                    </div>
                                    {grade.teacher_notes && (
                                      <div className="mt-2 pt-2 border-t">
                                        <span className="font-medium">ملاحظات:</span>
                                        <p className="text-gray-600 text-xs">{grade.teacher_notes}</p>
                                      </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-2">
                                      {grade.updated_at ? new Date(grade.updated_at).toLocaleDateString('ar-SA') : 
                                       grade.created_at ? new Date(grade.created_at).toLocaleDateString('ar-SA') : 
                                       "تاريخ غير معروف"}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* نافذة إضافة/تعديل درجة */}
      {(isAddingGrade || editingGrade) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              {isAddingGrade ? "إضافة درجة جديدة" : "تعديل الدرجة"}
            </h3>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block mb-1 md:mb-2 text-sm md:text-base">نوع الاختبار</label>
                <select
                  value={newGrade.type || ""}
                  onChange={(e) => setNewGrade({...newGrade, type: e.target.value})}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  <option value="">اختر النوع</option>
                  <option value="اختبار نهائي">اختبار نهائي</option>
                  <option value="اختبار نصفي">اختبار نصفي</option>
                  <option value="واجب">واجب</option>
                  <option value="مشروع">مشروع</option>
                  <option value="مشاركة">مشاركة</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 md:mb-2 text-sm md:text-base">الدرجة</label>
                <input
                  type="number"
                  min="0"
                  max={newGrade.max_score || 100}
                  step="0.1"
                  value={newGrade.score ?? ""}
                  onChange={(e) => setNewGrade({...newGrade, score: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block mb-1 md:mb-2 text-sm md:text-base">الدرجة القصوى</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newGrade.max_score || 100}
                  onChange={(e) => setNewGrade({...newGrade, max_score: parseFloat(e.target.value) || 100})}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block mb-1 md:mb-2 text-sm md:text-base">الدرجة المطلوبة للنجاح</label>
                <input
                  type="number"
                  min="0"
                  max={newGrade.max_score || 100}
                  step="1"
                  value={newGrade.pass_score || 50}
                  onChange={(e) => setNewGrade({...newGrade, pass_score: parseFloat(e.target.value) || 50})}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block mb-1 md:mb-2 text-sm md:text-base">الحالة</label>
                <select
                  value={newGrade.state || "معلق"}
                  onChange={(e) => setNewGrade({...newGrade, state: e.target.value as any})}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  disabled={isSubmitting}
                >
                  <option value="معلق">معلق</option>
                  <option value="معتمد">معتمد</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 md:mb-2 text-sm md:text-base">ملاحظات (اختياري)</label>
                <textarea
                  value={newGrade.teacher_notes || ""}
                  onChange={(e) => setNewGrade({...newGrade, teacher_notes: e.target.value})}
                  className="w-full p-2 border rounded text-sm md:text-base"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex gap-2 md:gap-3 mt-4 md:mt-6">
                <button
                  onClick={isAddingGrade ? () => handleAddGrade(selectedStudentForGrade!) : handleSaveGrade}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button
                  onClick={() => {
                    setIsAddingGrade(false);
                    setEditingGrade(null);
                    setNewGrade({});
                  }}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* عدد النتائج */}
      <div className="mt-4 text-center text-gray-600 text-sm">
        عرض {filteredAndSortedData.length} من أصل {studentsData.length} طالب
      </div>
    </div>
  );
};

export default GradesTab;
