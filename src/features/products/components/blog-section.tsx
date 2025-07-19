'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const BlogSection = () => {
  const [currentImageIndex1, setCurrentImageIndex1] = useState(0);
  const [currentImageIndex2, setCurrentImageIndex2] = useState(0);
  
  const images = [
    '/images/sanpham/sanpham1.png',
    '/images/sanpham/sanpham2.png', 
    '/images/sanpham/sanpham3.png',
    '/images/sanpham/sanpham4.png'
  ];

  useEffect(() => {
    const interval1 = setInterval(() => {
      setCurrentImageIndex1((prev) => (prev + 1) % images.length);
    }, 3000);

    const interval2 = setInterval(() => {
      setCurrentImageIndex2((prev) => (prev + 1) % images.length);
    }, 3200); // Slightly different timing

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, [images.length]);

  return (
    <section className="py-16 bg-gradient-to-br from-rose-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khám Phá No.07 Floral
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-purple-400 mx-auto"></div>
        </div>

        {/* First Section: Text Left, Image Right */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="px-4 py-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                No.07 Floral – Mỗi bó hoa là một tâm hồn nhỏ
              </h1>
              
              <div className="text-gray-600 leading-loose space-y-8 text-justify">
                <p className="text-lg italic text-center text-rose-600 font-medium mb-8">
                  "Mỗi người đều xứng đáng được yêu thương bằng những điều đẹp đẽ – như một bó hoa."
                </p>
                
                <p>
                  Giữa lòng thành phố nhộn nhịp, có một nơi dịu dàng nép mình trong con hẻm nhỏ – nơi mà hoa không chỉ là vật trang trí, mà là ngôn ngữ của cảm xúc. No.07 Floral không đơn thuần là một tiệm hoa, mà là một không gian lặng lẽ nơi những xúc cảm được gói ghém trong từng cánh hoa, từng gam màu nhẹ nhàng và từng cách sắp đặt tinh tế. Tiệm mang phong cách boutique hiện đại, tối giản nhưng đầy chất nghệ thuật – là nơi lui tới quen thuộc của những tâm hồn yêu cái đẹp và thích tìm sự bình yên qua những điều giản dị.
                </p>
                
                <p>
                  Câu chuyện đằng sau No.07 cũng đặc biệt như chính những bó hoa ở đây. Tiệm được sáng lập bởi một cô gái trẻ – từng là nhà thiết kế – người xem hoa như chất liệu để thể hiện cảm xúc và thẩm mỹ. Tên gọi "No.07" không chỉ là con số của ngôi nhà đầu tiên nơi tiệm ra đời, mà còn là biểu tượng cho sự trọn vẹn, may mắn và sự chỉn chu đến từng chi tiết. Những ngày đầu, No.07 chỉ nhận gói hoa nhỏ cho bạn bè thân quen – nhưng từ sự chân thành và tình yêu dành cho hoa, tiệm đã dần lớn lên, trở thành một chốn thân thuộc của những người muốn gửi đi lời thương bằng hương sắc.
                </p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="relative mt-20">
            <div className="relative h-[650px] w-full rounded-xl overflow-hidden shadow-2xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex1 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Sản phẩm hoa ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
              
              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex1(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex1
                        ? 'bg-white scale-110'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating decorations */}
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🌸</div>
            <div className="absolute -bottom-4 -left-4 text-3xl animate-pulse">🌺</div>
          </div>
        </div>

        {/* Second Section: Image Left, Text Right */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="relative order-2 lg:order-1 -mt-16">
            <div className="relative h-[750px] w-full rounded-xl overflow-hidden shadow-2xl">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex2 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Sản phẩm hoa ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
              
              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex2(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex2
                        ? 'bg-white scale-110'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating decorations */}
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🌻</div>
            <div className="absolute -bottom-4 -right-4 text-3xl animate-pulse">🌷</div>
            
            {/* Text below image */}
            <div className="mt-8 px-4">
              <p className="text-gray-600 leading-loose text-justify">
                Điều khiến No.07 đặc biệt hơn cả chính là cách nó hiện diện trong đời sống thường nhật: một cô gái tự tặng mình bó hoa sau kỳ thi căng thẳng, một chàng trai chọn hoa gửi mẹ dịp lễ, một đôi tình nhân cùng nhau chọn hoa cho ngày kỷ niệm, hay chỉ đơn giản là một người lạ mua nhành lavender cho căn phòng ngủ thơm hơn – những khoảnh khắc tưởng như nhỏ bé, nhưng lại khiến người ta mỉm cười và thấy đời dịu dàng hơn.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="px-4 py-8">
              <div className="text-gray-600 leading-loose space-y-2 text-justify">
                <p>
                  No.07 Floral không lớn, nhưng mỗi mét vuông nơi đây đều được chăm chút bằng tình yêu dành cho cái đẹp. Không gian tiệm ấm cúng với tường gỗ mộc, ánh đèn vàng dịu nhẹ, thoảng hương thơm của những bó hoa vừa được gói xong, tạo nên cảm giác an yên, nơi người ta có thể tạm quên đi sự ồn ào của thành phố. Đây không chỉ là nơi để mua hoa, mà còn là một điểm dừng cho những ai cần một khoảng lặng – nơi bạn có thể ngồi nhâm nhi ly trà, nghe một bản nhạc nhẹ, ngắm những cánh hoa tỏa hương trong bình gốm giản dị và để tâm trí được nghỉ ngơi.
                </p>
                
                <p>
                  Về dịch vụ, No.07 nổi bật với các gói hoa cá nhân hoá – chỉ cần bạn kể vài dòng về người nhận, tiệm sẽ gửi gắm cảm xúc ấy vào từng cánh hoa, tạo nên bó hoa như viết riêng cho câu chuyện đó. Hoa cưới tại đây mang phong cách châu Âu nhẹ nhàng, không gò bó nhưng đầy tinh tế, còn những set hoa theo mùa lại thể hiện sự biến chuyển tinh tế của thời tiết qua màu sắc và chất liệu. Không chỉ gói hoa, No.07 còn nhận thiết kế hoa cho các sự kiện nhỏ như workshop, tiệc cưới ấm cúng hay buổi lễ thân mật, luôn giữ đúng tinh thần "ít nhưng chất".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;