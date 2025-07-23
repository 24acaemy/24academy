"use client";
import { useState } from "react";

// Define a type for the FAQ item
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQSection = () => {
  // State type is set to number or null (for activeAccordion)
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  // FAQ data with type safety
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "ما هو موضوع الدورات التعليمية؟",
      answer: "موضوع الدورات التعليمية يشمل جميع الدورات التي تركز على تقديم المهارات والمعرفة المطلوبة.",
    },
    {
      id: 2,
      question: "كيف أجد دورة تعليمية؟",
      answer: "يمكنك البحث عن الدورات التعليمية من خلال محرك البحث في المنصة.",
    },
    {
      id: 3,
      question: "هل يمكنني الوصول إلى المحتوى بعد التسجيل؟",
      answer: "نعم، بعد التسجيل في الدورة، عليك الانتظار إلى موعد إبلاغك ببدء الدورة إذا كانت حضورية، ومن ثم يمكنك الوصول إلى جميع محتويات الدورة التعليمية.",
    },
  ];

  return (
    <section className="faq-section py-16 bg-gray-50" id="section_4" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 w-full flex justify-center">
            <img
              src="/images/faq_graphic.jpg"
              className="img-fluid rounded-lg shadow-lg"
              alt="أسئلة شائعة"
            />
          </div>
          <div className="lg:w-1/2 w-full">
            <h2 className="text-3xl font-bold mb-4 text-[#051568] text-right">الأسئلة الشائعة</h2>
            <div className="accordion space-y-4">
              {faqData.map((item) => (
                <div
                  key={item.id}
                  className="accordion-item border rounded-lg shadow-sm transition-all duration-300"
                >
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button text-xl font-semibold text-right p-4 w-full rounded-lg flex justify-between items-center ${activeAccordion === item.id
                        ? "bg-[#051568] text-white"
                        : "bg-white text-gray-700"
                        }`}
                      onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                    >
                      <span>{item.question}</span>
                      <i
                        className={`bi bi-chevron-down transition-transform ${activeAccordion === item.id ? "rotate-180" : ""
                          }`}
                      ></i>
                    </button>
                  </h2>
                  {activeAccordion === item.id && (
                    <div className="accordion-body text-gray-700 p-4 bg-gray-100 rounded-b-lg">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
