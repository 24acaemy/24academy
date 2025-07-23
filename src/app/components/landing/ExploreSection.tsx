"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Clock,
  DollarSign,
  ExternalLink,
  BookOpen,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Course {
  co_id: string;
  co_name: string;
  description: string;
  duration: string;
  price: string;
  curriculum: string;
  specialization: string;
}

const CourseCard = ({ course }: { course: Course }) => {
  const formatPrice = (price: string) => `${price}`;

  return (
    <Card className="h-full rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:border-primary">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="arabic-text text-sm px-2 py-1 bg-primary/10 text-primary">
            {course.specialization || "التخصص غير متوفر"}
          </Badge>
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock size={16} className="ml-1" />
            <span className="arabic-text">{course.duration}</span>
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-primary arabic-text mb-1">
          {course.co_name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground arabic-text leading-relaxed">
          {course.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-primary font-bold text-md">
            <DollarSign size={18} className="ml-1" />
            <span className="arabic-text">{formatPrice(course.price)}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <BookOpen size={16} className="ml-1" />
            <span className="arabic-text">منهج متكامل</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 mt-4">
        <Link href={`/Courses/${encodeURIComponent(course.co_name)}`} passHref legacyBehavior>
          <Button className="flex-1 arabic-text academy-button-primary">
            التسجيل في الدورة
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="arabic-text"
          onClick={() => window.open(course.curriculum, "_blank")}
        >
          <ExternalLink size={16} className="ml-1" />
          المنهج
        </Button>
      </CardFooter>
    </Card>
  );
};

const CoursesSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const isHovered = useRef(false);
  const isTouched = useRef(false);
  const scrollSpeedRef = useRef(1.5);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://24onlinesystem.vercel.app/courses');
        const data = await response.json();
        setCourses(data);

        // Extract unique specializations
        const uniqueSpecs = ["all", ...Array.from(new Set(data.map((course: Course) => course.specialization).filter(Boolean)))] as string[];
        setSpecializations(uniqueSpecs);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = selectedSpecialization === "all" 
    ? courses 
    : courses.filter(course => course.specialization === selectedSpecialization);

  const animateScroll = useCallback(() => {
    if (carouselRef.current && !isHovered.current && !isTouched.current && filteredCourses.length > 1) {
      const el = carouselRef.current;
      el.scrollLeft += scrollSpeedRef.current;
      
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      } else if (el.scrollLeft <= 0) {
        el.scrollLeft = el.scrollWidth - el.clientWidth;
      }
    }
    animationRef.current = requestAnimationFrame(animateScroll);
  }, [filteredCourses.length]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateScroll);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animateScroll]);

  const handleTouchStart = () => {
    isTouched.current = true;
  };

  const handleTouchEnd = () => {
    isTouched.current = false;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50" dir="rtl">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={48} />
          <p className="text-lg text-muted-foreground arabic-text">جاري تحميل الدورات...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <BookOpen className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 arabic-text">
            الدورات التدريبية
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto arabic-text">
            اختر من مجموعة متنوعة من الدورات المتخصصة المصممة لتطوير مهاراتك وتحقيق أهدافك المهنية
          </p>
        </div>

        {/* Specialization Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {specializations.map((spec) => (
            <Button
              key={spec}
              variant={selectedSpecialization === spec ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(spec)}
              className="arabic-text"
            >
              {spec === "all" ? "جميع التخصصات" : spec}
            </Button>
          ))}
        </div>

        {/* Courses Carousel */}
        <div className="relative">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto no-scrollbar scroll-smooth pb-6"
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex space-x-6 px-4">
              {filteredCourses.map((course) => (
                <div key={course.co_id} className="w-80 flex-shrink-0">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* No courses message */}
        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground arabic-text">
              لا توجد دورات متاحة في هذا التخصص حالياً
            </p>
          </div>
        )}

        {/* View All Courses Button */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" className="academy-button-primary arabic-text">
              عرض جميع الدورات
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;
