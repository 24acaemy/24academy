
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Academy Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <Image 
                src="/logo.png" 
                alt="أكاديمية 24" 
                width={48} 
                height={48}
                className="brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold arabic-text">أكاديمية 24</h3>
                <p className="text-sm text-primary-foreground/80 arabic-text">
                  للغات والتدريب
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-4 leading-relaxed arabic-text">
              منصة تعليمية رائدة في اليمن، نقدم دورات تدريبية متخصصة لتطوير المهارات وبناء القدرات للشباب العربي.
            </p>
            <p className="text-sm text-primary-foreground/60 arabic-text">
              الدائري الغربي، إب، اليمن
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 arabic-text">روابط سريعة</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="#home" className="hover:text-accent transition-colors arabic-text">
                  الرئيسية
                </a>
              </li>
              <li>
                <Link href="/Courses" className="hover:text-accent transition-colors arabic-text">
                  الدورات
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-accent transition-colors arabic-text">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors arabic-text">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 arabic-text">خدماتنا</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li className="arabic-text">دورات تدريبية متخصصة</li>
              <li className="arabic-text">شهادات معتمدة</li>
              <li className="arabic-text">استشارات مهنية</li>
              <li className="arabic-text">ورش عمل تطبيقية</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center text-center md:text-start gap-2">
    <p className="text-primary-foreground/60 text-sm font-medium arabic-text">
      أكاديمية 24 للغات والتدريب
    </p>
    <p className="text-primary-foreground/60 text-sm arabic-text">
      © {new Date().getFullYear()} جميع الحقوق محفوظة.
    </p>
    
  </div>
</div>

      </div>
    </footer>
  );
};

export default Footer;
