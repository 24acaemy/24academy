import Link from "next/link";
export const TopicCard = ({ title, description, price, duration, link, imageUrl }) => (
  <div className="custom-block bg-gray-300 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl transform hover:bg-gray-400">
    <Link href={link} className="d-block">
      <div className="relative w-full h-60">
        {/* Card Image */}
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full rounded-t-lg transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h5 className="text-2xl font-semibold text-[#010029] mb-3 text-right">{title}</h5>
        <p className="text-gray-700 text-base mb-4 text-right">{description}</p>
        <div className="flex justify-between items-center text-base text-right mb-4">
          <span className="text-[#010029]">مدة الدورة: {duration}</span>
          <span className="text-gray-700 font-semibold">$ {price}</span>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <button className="btn bg-[#010029] text-gray-300 px-4 py-2 rounded-full hover:bg-gray-300 transition-all duration-300 hover:text-[#010029]">
            تعلم المزيد
          </button>
        </div>
      </div>
    </Link>
  </div>
);
