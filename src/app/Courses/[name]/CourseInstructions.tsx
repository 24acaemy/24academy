// components/CourseInstructions.tsx
const CourseInstructions = () => (
  <div className="container mx-auto px-6 md:px-12 mt-12 bg-white p-8 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold text-[#010029] mb-6">تعليمات التسجيل في الدورة</h3>
    <div className="space-y-6 text-lg text-gray-700">
      <div className="flex items-start">
        <span className="text-blue-600 font-bold ml-2">1.</span>
        <p>قم باختيار الدورة التدريبية المناسبة بعد مراجعة التفاصيل بعناية.</p>
      </div>
      <div className="flex items-start">
        <span className="text-blue-600 font-bold ml-2">2.</span>
        <p>اضغط على زر "اشترك الآن" لفتح نموذج الدفع.</p>
      </div>
      <div className="flex items-start">
        <span className="text-blue-600 font-bold ml-2">3.</span>
        <p>اختر طريقة الدفع المناسبة من القائمة المنسدلة.</p>
      </div>
      <div className="flex items-start">
        <span className="text-blue-600 font-bold ml-2">4.</span>
        <p>أدخل المعلومات المطلوبة بدقة:</p>
      </div>

      <ul className="list-disc pr-6 space-y-2">
        <li>رقم الحساب الذي تم الدفع منه</li>
        <li>رقم العملية البنكية</li>
        <li>المبلغ المدفوع</li>
        <li>الوقت المفضل للحضور</li>
      </ul>

      <div className="flex items-start">
        <span className="text-blue-600 font-bold ml-2">5.</span>
        <p>اضغط على زر "تقديم" لإكمال العملية.</p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
        <p className="font-bold text-yellow-700">ملاحظات مهمة:</p>
        <ul className="list-disc pr-6 mt-2 space-y-1">
          <li>سيتم إرسال تأكيد الدفع إلى بريدك الإلكتروني</li>
          <li>يمكنك تتبع حالة طلبك من قسم "دوراتي"</li>
          <li>في حالة رفض الدفع، سيتم إعلامك بالسبب عبر البريد الإلكتروني</li>
          <li>بعد القبول، سيتم إضافتك إلى مجموعة الدورة التدريبية</li>
        </ul>
      </div>
    </div>
  </div>
);

export default CourseInstructions;
