"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Head from "next/head";
import { auth } from "@/services/firebase";
import { User } from "firebase/auth";
import CustomLoader from "@/app/components/spinned";
import CoursePaymentModal from "./CoursePaymentModal";
import CourseInstructions from "./CourseInstructions";

const CourseDetails = ({ user }: { user: User | null }) => {
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // حقول الدفع
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [wantedTime, setWantedTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { name } = useParams();
  const router = useRouter();

  // جلب المستخدم
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  // جلب تفاصيل الدورة
  useEffect(() => {
    if (!name) return;
    setIsLoading(true);
    axios
      .get(`https://24onlinesystem.vercel.app/courses/co_name=${name}`)
      .then((res) => {
        const data = res.data[0];
        if (!data) setError("الدورة غير موجودة");
        else
          setCourse({
            id: data.co_id,
            name: data.co_name,
            description: data.description,
            price: data.price,
            price_s: data.price_s,
            co_order: data.co_order,
            duration: data.duration,
            imageUrl: data.imageUrl || "/course.jpg",
            curriculum: data.curriculum,
          });
      })
      .catch((e) => {
        console.error(e);
        setError("حدث خطأ في جلب بيانات الدورة");
      })
      .finally(() => setIsLoading(false));
  }, [name]);

  // جلب طرق الدفع
  useEffect(() => {
    setPaymentMethodsLoading(true);
    axios
      .get("https://24onlinesystem.vercel.app/payment_methods")
      .then((res) => setPaymentMethods(res.data))
      .catch((e) => {
        console.error(e);
        setErrorMessage("حدث خطأ في جلب طرق الدفع. يرجى المحاولة لاحقًا");
      })
      .finally(() => setPaymentMethodsLoading(false));
  }, []);

  // اختيار العملة
  const [currency, setCurrency] = useState<"SAR" | "USD">("SAR");
  const priceUSD = Number(course?.price ?? 0);
  const priceSAR = Number(course?.price_s ?? 0);
  const requiredPrice = currency === "SAR" ? priceSAR : priceUSD;
  const currencyLabel = currency === "SAR" ? "ريال سعودي" : "دولار أمريكي";

  const isAmountValid = Number(amountPaid) === requiredPrice;
  const isSubmitDisabled =
    !selectedPaymentMethod ||
    !accountNumber ||
    !transactionNumber ||
    !amountPaid ||
    !wantedTime ||
    !isAmountValid ||
    isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) {
      setErrorMessage(
        !isAmountValid
          ? `المبلغ المدفوع غير صحيح، يجب أن يكون ${requiredPrice} ${currencyLabel}`
          : "يرجى ملء جميع الحقول المطلوبة."
      );
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const payload = {
        pay_method: selectedPaymentMethod,
        account_no: accountNumber,
        trans_no: transactionNumber,
        amount: requiredPrice,
        email: currentUser?.email || "",
        co_id: course.id,
        wanted_time: wantedTime,
      };
      const res = await axios.post("https://24onlinesystem.vercel.app/payments", payload);
      if (res.status === 201) {
        alert("تم إرسال بيانات الدفع بنجاح!");
        setShowModal(false);
        router.push("/student-dashboard/my-courses");
      }
    } catch (err: any) {
      console.error(err);
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || err.response?.data?.error || "حدث خطأ أثناء معالجة طلبك"
        : "حدث خطأ غير متوقع";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="container mx-auto flex justify-center items-center h-80">
      <CustomLoader />
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 py-8">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
        حاول مرة أخرى
      </button>
    </div>
  );

  return (
    <>
      <Head>
        <title>{course.name} - دورة تدريبية</title>
      </Head>

      <section className="py-16 bg-gradient-to-t from-gray-200 to-blue-50" dir="rtl">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-bold text-center mb-8">{course.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <img src={course.imageUrl} alt={course.name} className="w-full rounded-lg shadow-lg" />

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <p><strong>🏅 ترتيب:</strong> {course.co_order || "غير محدد"}</p>
                <div className="flex gap-4 mt-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="currency"
                      value="USD"
                      checked={currency === "USD"}
                      onChange={() => setCurrency("USD")}
                    />
                    {priceUSD}$
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="currency"
                      value="SAR"
                      checked={currency === "SAR"}
                      onChange={() => setCurrency("SAR")}
                    />
                    {priceSAR} ر.س
                  </label>
                </div>
                <p className="mt-4"><strong>⏳ المدة:</strong> {course.duration}</p>
                <p className="mt-4"><strong>الوصف:</strong> {course.description}</p>
                {course.curriculum && (
                  <p className="mt-2">
                    <a href={course.curriculum} target="_blank" className="text-blue-700 underline">
                      عرض المناهج
                    </a>
                  </p>
                )}
              </div>

              {currentUser ? (
                <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-blue-500 text-white rounded-full">
                  🚀 اشترك الآن
                </button>
              ) : (
                <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                  يرجى تسجيل الدخول للاشتراك
                </div>
              )}
            </div>
          </div>

          <CourseInstructions className="mt-12" />
        </div>
      </section>

      <CoursePaymentModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        paymentMethods={paymentMethods}
        paymentMethodsLoading={paymentMethodsLoading}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        transactionNumber={transactionNumber}
        setTransactionNumber={setTransactionNumber}
        amountPaid={amountPaid}
        setAmountPaid={setAmountPaid}
        wantedTime={wantedTime}
        setWantedTime={setWantedTime}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        isSubmitDisabled={isSubmitDisabled}
        requiredPrice={requiredPrice}
        currencyLabel={currencyLabel}
      />
    </>
  );
};

export default CourseDetails;