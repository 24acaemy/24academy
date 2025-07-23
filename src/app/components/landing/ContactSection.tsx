import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 arabic-text">
            تواصل معنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto arabic-text">
            نحن هنا لمساعدتك في رحلتك التعليمية. تواصل معنا لأي استفسارات أو للحصول على مزيد من المعلومات
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="animate-fade-in">
            <Card className="academy-card mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-primary arabic-text">معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground arabic-text">العنوان</h4>
                    <p className="text-muted-foreground arabic-text">الدائري الغربي، إب، اليمن</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                  <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                  <h4 className="font-semibold text-foreground arabic-text">الهاتف</h4>
                  <a
                    href="tel:+967780248024"
                    className="text-muted-foreground underline hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    +967 78 024 8024
                  </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground arabic-text">البريد الإلكتروني</h4>
                    <a
                      href="mailto:24academy.24online@gmail.com"
                      className="text-muted-foreground underline hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      <p className="text-muted-foreground" dir="ltr">24academy.24online@gmail.com</p>
                    </a>
                  
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="academy-card">
              <CardHeader>
                <CardTitle className="text-xl text-primary arabic-text">تابعنا على</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 space-x-reverse">
                  <Button size="sm" variant="outline" className="flex items-center" asChild>
                     <a
                        href="https://www.facebook.com/24academy/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                    <Facebook size={20} className="ml-2 mr-0 mr-2 ml-0" />
                    <span className="arabic-text">فيس بوك</span>
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center">
                    <Instagram size={20} className="ml-2 mr-0 mr-2 ml-0" />
                    <span className="arabic-text">إنستجرام</span>
                  </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center"
                      asChild
                    >
                      <a
                        href="https://www.tiktok.com/@24_academy_online"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* TikTok icon as SVG */}
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" className="ml-2 mr-0 mr-2 ml-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.5 3a1 1 0 0 0-1 1v10.5a2.5 2.5 0 1 1-2.5-2.5 1 1 0 1 0 0-2A4.5 4.5 0 1 0 17 17.5V9.94a6.97 6.97 0 0 0 3 0V8.06a5 5 0 0 1-3-4.56A1 1 0 0 0 16.5 3z" fill="currentColor"/>
                        </svg>
                        <span className="arabic-text">TikTok</span>
                      </a>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps */}
          <div className="animate-scale-in">
            <Card className="academy-card h-full">
              <CardHeader>
                <CardTitle className="text-xl text-primary arabic-text">موقعنا على الخريطة</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden h-96">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3871.852528172996!2d44.161298699999996!3d13.967382199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x161ceb01b1e7554b%3A0xb4fbee1c75aaaed!2z2KPZg9in2K_ZitmF2YrYqSAyNCDZhNmE2LrYp9iqINmI2KfZhNmD2YXYqNmK2YjYqtix!5e0!3m2!1sar!2s!4v1752260993916!5m2!1sar!2s"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع أكاديمية 24 - إب، اليمن"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;