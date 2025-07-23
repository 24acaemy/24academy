"use client";
import { useState } from "react";

const TimelineSection = () => {
  return (
    <section dir="rtl" className="timeline-section py-16 bg-gray-50" id="section_3">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[#051568] text-4xl font-semibold mb-6">كيف يعمل؟</h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="timeline-container space-y-8">
          {[
            {
              icon: "bi bi-search",
              title: "ابحث عن الموضوع المفضل لديك",
              description: "قم بالبحث عن الموضوع الذي ترغب في تعلمه.",
            },
            {
              icon: "bi bi-bookmark",
              title: "تصفح المنهج",
              description: "يمكنك تصفح المنهج للدورات التي تهمك لاخذ فكره عما تريد.",
            },
            {
              icon: "bi bi-book",
              title: "تعلم واستمتع",
              description: "استمتع بتعلم مواضيع جديدة ومفيدة.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="timeline-item bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* استخدم flex مع flex-row-reverse فقط عند الحاجة */}
              <div className="flex items-center mb-4">
                <div className="icon-holder text-[#051568] text-3xl ml-4">
                  <i className={item.icon}></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-700 text-right">{item.title}</h4>
              </div>
              <p className="text-gray-600 text-lg text-right">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
