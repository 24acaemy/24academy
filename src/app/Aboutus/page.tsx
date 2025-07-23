"use client"; // Ensures the component runs on the client-side

import Link from "next/link"; // Import Link from Next.js for client-side navigation
import Image from "next/image"; // Import Image for optimized images
import { FaLaptop, FaBriefcase, FaCogs, FaUserMd, FaLanguage, FaPalette, FaQuoteLeft } from 'react-icons/fa'; // Icons for majors and testimonials
import { motion } from 'framer-motion'; // For animations
import Head from 'next/head'; // For SEO and meta tags

const AboutUs = () => {
    return (
        <>
            {/* SEO and Meta Tags */}
            <Head>
                <title>من نحن - معهدنا</title>
                <meta name="description" content="تعرف على معهدنا في إب، اليمن، وتخصصاتنا، وإنجازاتنا، وآراء طلابنا. انضم إلينا اليوم لتلقي تعليم عالي الجودة." />
                <meta name="keywords" content="معهد, إب, اليمن, تعليم, تخصصات, إنجازات, طلاب" />
                <meta name="author" content="معهدنا" />
                <meta property="og:title" content="من نحن - معهدنا" />
                <meta property="og:description" content="تعرف على معهدنا في إب، اليمن، وتخصصاتنا، وإنجازاتنا، وآراء طلابنا." />
                <meta property="og:image" content="/institute-image.jpg" />
                <meta property="og:url" content="https://www.your-institute.com/about-us" />
                <link rel="canonical" href="https://www.your-institute.com/about-us" />
            </Head>

            {/* About Us Section */}
            <section className="about-us-section py-16 bg-gradient-to-t from-gray-100 to-blue-50" dir="rtl">
                <div className="container mx-auto px-6 md:px-12">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl font-bold text-[#010029]"
                        >
                            من نحن
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-gray-700 mt-4"
                        >
                            معهدنا في قلب إب، اليمن، ملتزم بتقديم تعليم عالي الجودة.
                        </motion.p>
                    </div>

                    {/* Mission and Vision Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-2xl font-semibold text-[#051568] mb-4">رسالتنا</h2>
                                <p className="text-lg text-gray-700">
                                    مهمتنا هي توفير تعليم متميز يلبي احتياجات سوق العمل ويسهم في تنمية المجتمع. نهدف إلى إعداد طلابنا ليصبحوا قادة مبدعين وقادرين على مواجهة التحديات المستقبلية.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-2xl font-semibold text-[#051568] mb-4">رؤيتنا</h2>
                                <p className="text-lg text-gray-700">
                                    نطمح إلى أن نكون المعهد الرائد في اليمن في تقديم التعليم التطبيقي والبحث العلمي، وأن نكون بيت خبرة يسهم في بناء مجتمع معرفي متقدم.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* History Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-[#010029] mb-8">تاريخنا</h2>
                        <p className="text-lg text-gray-700">
                            تأسس معهدنا في عام 2018 في مدينة إب، اليمن، بهدف سد الفجوة بين التعليم الأكاديمي ومتطلبات سوق العمل. على مر السنين، قمنا بتخريج آلاف الطلاب الذين ساهموا في تنمية المجتمع اليمني.
                        </p>
                        <div className="mt-8">
                            <Image
                                src="/institute-image.jpg" // Replace with your image path
                                alt="صورة المعهد"
                                width={1200}
                                height={800}
                                className="rounded-lg shadow-lg"
                                priority // Ensures the image is loaded first
                            />
                        </div>
                    </motion.div>

                    {/* Majors Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.6 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-[#010029] mb-8">التخصصات التي نقدمها</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaLanguage className="text-[#051568] text-3xl mb-4" />
                                <h3 className="text-xl font-semibold text-[#051568] mb-4">اللغات</h3>
                                <p className="text-lg text-gray-700">
                                    نقدم دورات في اللغة الإنجليزية، الفرنسية، والإسبانية لتعزيز المهارات اللغوية.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaLaptop className="text-[#051568] text-3xl mb-4" />
                                <h3 className="text-xl font-semibold text-[#051568] mb-4">الحاسوب</h3>
                                <p className="text-lg text-gray-700">
                                    نقدم برامج متخصصة في الجرافكس، البرامج التطبيقية للمونتاج، والرخصة الدولية لقيادة الحاسوب.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaBriefcase className="text-[#051568] text-3xl mb-4" />
                                <h3 className="text-xl font-semibold text-[#051568] mb-4">المحاسبة</h3>
                                <p className="text-lg text-gray-700">
                                    برامجنا في قسم المحاسبة تغطي دورات المحاسبة المالية (أ - ب - الدورة المستندية)، والأنظمة المحاسبية.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaCogs className="text-[#051568] text-3xl mb-4" />
                                <h3 className="text-xl font-semibold text-[#051568] mb-4">البرمجة والصيانة</h3>
                                <p className="text-lg text-gray-700">
                                    نقدم تخصصات في برمجة وصيانة الحاسوب وبرمجة وصيانة الموبايل.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaUserMd className="text-[#051568] text-3xl mb-4" />
                                <h3 className="text-xl font-semibold text-[#051568] mb-4">برامج التقوية</h3>
                                <p className="text-lg text-gray-700">
                                    برامجنا في المنهج الدراسي، المنهج الجامعي، المصطلحات الطبية، والبرامج الهندسية.
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaPalette className="text-[#051568] text-3xl mb-4" />
                                <h3 className="text-xl font-semibold text-[#051568] mb-4">الدورات النوعية</h3>
                                <p className="text-lg text-gray-700">
                                    دورات في الشبكات، الذكاء الاصطناعي، لغات البرمجة، التصوير الفوتوغرافي، والعبقرة الذهنية.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Achievements Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.8 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-[#010029] mb-8">إنجازاتنا</h2>
                        <ul className="list-disc list-inside text-lg text-gray-700">
                            <li>تخريج أكثر من 5000 طالب وطالبة منذ تأسيس المعهد.</li>
                            <li>تعاون مع أكثر من 50 شركة ومؤسسة محلية ودولية.</li>
                            <li>حصول المعهد على اعتماد من وزارة التعليم العالي اليمنية.</li>
                            <li>تنظيم أكثر من 100 ورشة عمل ومؤتمر علمي.</li>
                        </ul>
                    </motion.div>

                    {/* Testimonials Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 1 }}
                        className="mt-16"
                    >
                        <h2 className="text-3xl font-bold text-[#010029] mb-8">آراء طلابنا</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaQuoteLeft className="text-[#051568] text-3xl mb-4" />
                                <p className="text-lg text-gray-700">
                                    &quot;المعهد وفر لي فرصة تعلم مهارات جديدة وساعدني في الحصول على وظيفة أحلامي.&quot;
                                </p>
                                <p className="text-sm text-gray-600 mt-4">- أحمد، خريج علوم الحاسوب</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaQuoteLeft className="text-[#051568] text-3xl mb-4" />
                                <p className="text-lg text-gray-700">
                                    &quot;تجربة رائعة مع معهدنا، الأساتذة محترفون والمناهج متطورة.&quot;
                                </p>
                                <p className="text-sm text-gray-600 mt-4">- فاطمة، طالبة إدارة أعمال</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <FaQuoteLeft className="text-[#051568] text-3xl mb-4" />
                                <p className="text-lg text-gray-700">
                                    &quot;أفضل قرار اتخذته هو الالتحاق بهذا المعهد، تعلمت الكثير واستفدت من الخبرات العملية.&quot;
                                </p>
                                <p className="text-sm text-gray-600 mt-4">- محمد، خريج هندسة</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Call to Action Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="mt-16 text-center"
                    >
                        <h2 className="text-3xl font-bold text-[#010029] mb-8">انضم إلينا اليوم</h2>
                        <p className="text-lg text-gray-700 mb-8">
                            إذا كنت تبحث عن تعليم عالي الجودة يفتح لك أبواب المستقبل، فأنت في المكان الصحيح. سجل الآن وكن جزءًا من مجتمعنا التعليمي المتميز.
                        </p>
                        <Link
                            href="/signup" // Replace with your registration page URL
                            className="inline-block py-3 px-8 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
                        >
                            سجل الآن
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default AboutUs;
