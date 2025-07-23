import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { GraduationCap, Users, Award, Target, Heart, Lightbulb } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Target,
      title: "رؤيتنا",
      description: "أن نكون الخيار الأول للتعليم والتدريب المتقدم في اليمن ومنطقة الشرق الأوسط"
    },
    {
      icon: Heart,
      title: "رسالتنا", 
      description: "تقديم تعليم عالي الجودة ودورات تدريبية متخصصة لبناء جيل قادر على مواجهة تحديات المستقبل"
    },
    {
      icon: Lightbulb,
      title: "قيمنا",
      description: "الجودة، الإبداع، التميز، والالتزام بتطوير المهارات وبناء القدرات البشرية"
    }
  ];

  const stats = [
    { number: "2018", label: "سنة التأسيس" },
    { number: "500+", label: "طالب تخرج" },
    { number: "25+", label: "دورة متخصصة" },
    { number: "15+", label: "مدرب خبير" }
  ];

  return (
    <section id="about" className="py-20 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <GraduationCap className="text-primary" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 arabic-text">
            من نحن
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed arabic-text">
            أكاديمية 24 للتدريب والتأهيل هي منصة تعليمية رائدة تأسست في مدينة إب، اليمن، لتقديم دورات تدريبية متخصصة وعالية الجودة للشباب اليمني والعربي
          </p>
        </div>

        {/* Vision, Mission, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="academy-card text-center animate-scale-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                  <feature.icon className="text-primary" size={28} />
                </div>
                <CardTitle className="text-xl text-primary arabic-text">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground arabic-text leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-academy-gradient rounded-2xl p-8 md:p-12 text-center animate-slide-up">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 arabic-text">
            إنجازاتنا بالأرقام
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</h4>
                <p className="text-white/80 arabic-text">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-primary mb-12 arabic-text">
            لماذا تختار أكاديمية 24؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: "شهادات معتمدة",
                description: "نقدم شهادات معتمدة ومعترف بها محلياً وإقليمياً"
              },
              {
                icon: Users,
                title: "مدربون خبراء",
                description: "فريق من المدربين المتخصصين ذوي الخبرة العملية الواسعة"
              },
              {
                icon: GraduationCap,
                title: "تعليم تفاعلي",
                description: "أساليب تدريس حديثة وتفاعلية تضمن أفضل النتائج"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4 space-x-reverse animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                  <item.icon className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 arabic-text">{item.title}</h4>
                  <p className="text-muted-foreground arabic-text">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
