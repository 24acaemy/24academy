"use client";

import React from "react";
import CoursesSection from "./ExploreSection"; // Correct import
import TimelineSection from "./Timeline";
import FAQSection from "./FAQSection";
import ContactSection from "./ContactSection";

import { Button } from "@/app/components/ui/button";
import { GraduationCap, BookOpen, Users, Award, Link as LinkIcon } from "lucide-react";
import AboutSection from "../aboutus";
import Footer from "./footer";
import Link from "next/link"; // Import the Link component from Next.js

const HeroSection = () => {
  return (
    <>
      <section
        className="academy-hero-bg min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-[#0a2342] via-[#143968] to-gray-400"
        dir="rtl"
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Hero Content */}
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 academy-text-glow arabic-text">
                أكاديمية 24 للغات والتدريب
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed arabic-text">
                منصة تعليمية متقدمة تقدم دورات تدريبية متخصصة لتطوير مهاراتك 
              </p>
              <p className="text-lg text-white/80 mb-12 arabic-text">
                من إب، اليمن - نحو مستقبل أكثر إشراقاً
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-scale-in">
              <Link href="/Courses">
                <Button className="academy-button-primary text-lg px-8 py-4 arabic-text">
                  <GraduationCap className="ml-2" size={24} />
                  استكشف الدورات
                </Button>
              </Link>
              <Link href="/Aboutus">
                <Button className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20 arabic-text">
                  <BookOpen className="ml-2" size={24} />
                  تعرف علينا
                </Button>
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up">
              {[{ icon: Users, number: "500+", text: "طالب مسجل" },
                { icon: BookOpen, number: "25+", text: "دورة تدريبية" },
                { icon: Award, number: "95%", text: "معدل النجاح" },
                { icon: GraduationCap, number: "300+", text: "شهادة مُمنحة" }].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 animate-float"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <Icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{stat.number}</h3>
                      <p className="text-white/80 arabic-text">{stat.text}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/5 rounded-full animate-float"></div>
          <div
            className="absolute top-3/4 right-20 w-32 h-32 bg-accent/10 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-white/5 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>
      {/* Other Sections */}
      <div className="content">
        <CoursesSection />
       
      
        <FAQSection />
        <ContactSection />
        <Footer/>
      </div>
    </>
  );
};

export default HeroSection;
