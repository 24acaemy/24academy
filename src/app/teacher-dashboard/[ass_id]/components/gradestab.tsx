import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CustomLoader from "@/app/components/spinned";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// الأنواع
interface Grade {
  grade_id: string;
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
  const [editingGrade, setEditingGrade] = useState<{ studentId: string; gradeIndex: number } | null>(null);
  const [newGrade, setNewGrade] = useState<Partial<Grade>>({});
  const [isAddingGrade, setIsAddingGrade] = useState<boolean>(false);
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("الجميع");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "grade" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  // جلب البيانات بشكل متوازي مع معالجة الأخطاء
  const fetchData = useCallback(async () => {
    if (!ass_id || !teacherId) {
      setError("معرف المهمة أو المعلم غير متوفر");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // جلب بيانات الطلاب والمعلومات معًا
      const [studentsResponse, gradesResponse, courseResponse] = await Promise.allSettled([
        axios.get<StudentData[]>(`https://24onlinesystem.vercel.app/course_students/ass_id=${ass_id}&teacher_id=${teacherId}`),
        axios.get<Grade[]>(`https://24onlinesystem.vercel.app/grades?ass_id=${ass_id}&teacher_id=${teacherId}`),
        axios.get<CourseDetails>(`https://24onlinesystem.vercel.app/course_details?ass_id=${ass_id}`)
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
        throw new Error("فشل في تحميل بيانات الطلاب");
      }

      // معالجة استجابة الدرجات
      if (gradesResponse.status === "fulfilled") {
        const grades = gradesResponse.value.data;
        const groupedGrades = grades.reduce((acc, grade) => {
          // التحقق من صحة بيانات الدرجة
          if (!grade.stu_id || !grade.score || grade.score < 0) {
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
      }

    } catch (error: any) {
      console.error("Error fetching data:", error);
      const errorMessage = error.response?.status === 403 
        ? "ليس لديك صلاحية للوصول إلى هذه المهمة"
        : error.response?.status === 404
        ? "المهمة غير موجودة"
        : "حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى";
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [ass_id, teacherId]);

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
          ? new Date(Math.max(...grades.map(g => new Date(g.updated_at).getTime()))).toLocaleDateString('ar-SA')
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
        student.stu_name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.stu_id.includes(query)
      );
    }
    
    // الترتيب
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.stu_name.localeCompare(b.stu_name, 'ar');
          break;
        case "grade":
          const gradeA = a.averageGrade || 0;
          const gradeB = b.averageGrade || 0;
          comparison = gradeA - gradeB;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status, 'ar');
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  }, [mergedData, filterStatus, searchQuery, sortBy, sortOrder]);

  // حساب الإحصائيات
  const statistics = useMemo(() => {
    const total = mergedData.length;
    const withGrades = mergedData.filter(s => s.hasGrades).length;
    const completed = mergedData.filter(s => s.status === "مكتمل").length;
    const withdrawn = mergedData.filter(s => s.status === "منسحب").length;
    const average = mergedData.filter(s => s.averageGrade !== null).length > 0
      ? mergedData.reduce((sum, s) => sum + (s.averageGrade || 0), 0) / 
        mergedData.filter(s => s.averageGrade !== null).length
      : 0;
    
    return { total, withGrades, completed, withdrawn, average };
  }, [mergedData]);

  const toggleStudentGrades = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleEditGrade = (studentId: string, gradeIndex: number, grade: Grade) => {
    setEditingGrade({ studentId, gradeIndex });
    setNewGrade({ ...grade });
  };

  const handleSaveGrade = async () => {
    if (!editingGrade || !newGrade.score || newGrade.score < 0) {
      toast.error("يرجى إدخال درجة صالحة");
      return;
    }

    try {
      const response = await axios.put(
        `https://24onlinesystem.vercel.app/grades/${editingGrade.studentId}`,
        {
          ...newGrade,
          updated_at: new Date().toISOString(),
          teacher_id: teacherId
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث الدرجة بنجاح");
        fetchData();
        setEditingGrade(null);
        setNewGrade({});
      }
    } catch (error) {
      toast.error("فشل في تحديث الدرجة");
    }
  };

  const handleAddGrade = async (studentId: string) => {
    if (!newGrade.type || !newGrade.score) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const response = await axios.post("https://24onlinesystem.vercel.app/grades", {
        stu_id: studentId,
        ass_id,
        ...newGrade,
        state: "معلق",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        teacher_id: teacherId
      });

      if (response.status === 201) {
        toast.success("تم إضافة الدرجة بنجاح");
        setIsAddingGrade(false);
        setSelectedStudentForGrade(null);
        setNewGrade({});
        fetchData();
      }
    } catch (error) {
      toast.error("فشل في إضافة الدرجة");
    }
  };

  const handleDeleteGrade = async (gradeId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الدرجة؟")) return;

    try {
      const response = await axios.delete(
        `https://24onlinesystem.vercel.app/grades/${gradeId}?teacher_id=${teacherId}`
      );

      if (response.status === 200) {
        toast.success("تم حذف الدرجة بنجاح");
        fetchData();
      }
    } catch (error) {
      toast.error("فشل في حذف الدرجة");
    }
  };

  const exportToExcel = () => {
    // تحويل البيانات لصيغة CSV
    const headers = ["الاسم", "البريد الإلكتروني", "المعدل", "الحالة", "عدد الاختبارات", "آخر تحديث"];
    const csvData = filteredAndSortedData.map(student => [
      student.stu_name,
      student.email,
      student.averageGrade?.toFixed(2) || "لا يوجد",
      student.status,
      student.grades.length,
      student.lastGradeDate || "لا يوجد"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `درجات_المهمة_${ass_id}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <CustomLoader />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-12">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{error}</h3>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ToastContainer position="top-left" rtl autoClose={3000} />
      
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-3xl font-semibold text-gray-800 mb-2">
            درجات المهمة: {courseDetails?.course_name || `رقم ${ass_id}`}
          </h3>
          {courseDetails && (
            <p className="text-gray-600">
              {courseDetails.course_code} - {courseDetails.teacher_name} - الفصل: {courseDetails.semester}
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>تصدير لـ Excel</span>
            <span>📊</span>
          </button>
          <button
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <span>تحديث البيانات</span>
            <span>🔄</span>
          </button>
        </div>
      </div>

      {/* إحصائيات */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-blue-700 text-2xl font-bold">{statistics.total}</div>
          <div className="text-blue-600">إجمالي الطلاب</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-green-700 text-2xl font-bold">{statistics.withGrades}</div>
          <div className="text-green-600">لديهم درجات</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-purple-700 text-2xl font-bold">{statistics.completed}</div>
          <div className="text-purple-600">مكتملين</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-yellow-700 text-2xl font-bold">{statistics.withdrawn}</div>
          <div className="text-yellow-600">منسحبين</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="text-indigo-700 text-2xl font-bold">
            {statistics.average.toFixed(2)}
          </div>
          <div className="text-indigo-600">المعدل العام</div>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ابحث عن طالب بالاسم أو البريد أو الرقم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
        </div>
        
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="الجميع">الجميع</option>
            <option value="مسجل">مسجل</option>
            <option value="مكتمل">مكتمل</option>
            <option value="منسحب">منسحب</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-3 border rounded-lg"
          >
            <option value="name">الاسم</option>
            <option value="grade">المعدل</option>
            <option value="status">الحالة</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-3 border rounded-lg bg-white hover:bg-gray-100"
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
              <th className="py-4 px-6 text-center">#</th>
              <th className="py-4 px-6 text-center">الاسم</th>
              <th className="py-4 px-6 text-center">البريد الإلكتروني</th>
              <th className="py-4 px-6 text-center">المعدل</th>
              <th className="py-4 px-6 text-center">الحالة</th>
              <th className="py-4 px-6 text-center">عدد الاختبارات</th>
              <th className="py-4 px-6 text-center">الإجراءات</th>
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
                <React.Fragment key={student.stu_id}>
                  <tr className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50`}>
                    <td className="py-4 px-6 text-center">{index + 1}</td>
                    <td className="py-4 px-6 text-center font-medium">{student.stu_name}</td>
                    <td className="py-4 px-6 text-center">{student.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full ${
                        student.averageGrade === null 
                          ? 'bg-gray-100 text-gray-700'
                          : student.averageGrade >= 70
                          ? 'bg-green-100 text-green-700'
                          : student.averageGrade >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.averageGrade?.toFixed(2) || "لا يوجد"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full ${
                        student.status === "مكتمل" 
                          ? 'bg-green-100 text-green-700'
                          : student.status === "منسحب"
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">
                        {student.grades.length}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => toggleStudentGrades(student.stu_id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          {expandedStudent === student.stu_id ? "إخفاء" : "عرض الدرجات"}
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
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          إضافة درجة
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* الصف المنسدل للدرجات */}
                  {expandedStudent === student.stu_id && (
                    <tr className="bg-gray-100">
                      <td colSpan={7} className="py-6 px-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">درجات الطالب</h4>
                            <span className="text-sm text-gray-500">
                              آخر تحديث: {student.lastGradeDate || "لا يوجد"}
                            </span>
                          </div>
                          
                          {student.grades.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              لا توجد درجات مسجلة لهذا الطالب
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {student.grades.map((grade, idx) => (
                                <div key={grade.grade_id} className="border p-4 rounded-lg bg-white">
                                  <div className="flex justify-between items-start mb-3">
                                    <div>
                                      <div><strong>نوع الاختبار:</strong> {grade.type}</div>
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
                                        onClick={() => handleEditGrade(student.stu_id, idx, grade)}
                                        className="text-blue-500 hover:text-blue-700 text-sm"
                                      >
                                        تعديل
                                      </button>
                                      <button
                                        onClick={() => handleDeleteGrade(grade.grade_id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                      >
                                        حذف
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>الدرجة:</span>
                                      <span className={`font-bold ${
                                        grade.score >= grade.pass_score 
                                          ? 'text-green-600' 
                                          : 'text-red-600'
                                      }`}>
                                        {grade.score} / {grade.max_score}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>الدرجة المطلوبة:</span>
                                      <span>{grade.pass_score}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">
                                      {new Date(grade.updated_at).toLocaleDateString('ar-SA')}
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {isAddingGrade ? "إضافة درجة جديدة" : "تعديل الدرجة"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">نوع الاختبار</label>
                <select
                  value={newGrade.type || ""}
                  onChange={(e) => setNewGrade({...newGrade, type: e.target.value})}
                  className="w-full p-2 border rounded"
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
                <label className="block mb-2">الدرجة</label>
                <input
                  type="number"
                  min="0"
                  max={newGrade.max_score || 100}
                  value={newGrade.score || ""}
                  onChange={(e) => setNewGrade({...newGrade, score: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-2">الدرجة القصوى</label>
                <input
                  type="number"
                  min="1"
                  value={newGrade.max_score || 100}
                  onChange={(e) => setNewGrade({...newGrade, max_score: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block mb-2">الدرجة المطلوبة للنجاح</label>
                <input
                  type="number"
                  min="0"
                  max={newGrade.max_score || 100}
                  value={newGrade.pass_score || 50}
                  onChange={(e) => setNewGrade({...newGrade, pass_score: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={isAddingGrade ? () => handleAddGrade(selectedStudentForGrade!) : handleSaveGrade}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                >
                  حفظ
                </button>
                <button
                  onClick={() => {
                    setIsAddingGrade(false);
                    setEditingGrade(null);
                    setNewGrade({});
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* معلومات التحميل */}
      {loading && (
        <div className="text-center py-4 text-gray-500">
          جاري تحديث البيانات...
        </div>
      )}
    </div>
  );
};

export default GradesTab;
