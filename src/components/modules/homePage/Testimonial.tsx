"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

const testimonials: TestimonialData[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Literature Student",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "This library system has completely transformed how I study. The premium access to rare collections and seamless borrowing process is unmatched.",
    rating: 5,
  },
  {
    id: 2,
    name: "David Chen",
    role: "Research Scholar",
    image: "https://i.pravatar.cc/150?u=david",
    content: "As a researcher, having unlimited digital database access and private study rooms has been invaluable to my thesis work. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Avid Reader",
    image: "https://i.pravatar.cc/150?u=emily",
    content: "I love the community events and the incredible selection of contemporary fiction. The 30-day extended loan period for bookworms is perfect.",
    rating: 4,
  },
  {
    id: 4,
    name: "Michael Chang",
    role: "History Professor",
    image: "https://i.pravatar.cc/150?u=michael",
    content: "The inter-library loan service is flawlessly executed. I've been able to access obscure texts that I couldn't find anywhere else.",
    rating: 5,
  },
  {
    id: 5,
    name: "Jessica Taylor",
    role: "Freelance Writer",
    image: "https://i.pravatar.cc/150?u=jessica",
    content: "A beautifully maintained space both physically and digitally. The UI of their digital catalog is just as welcoming as their reading rooms.",
    rating: 5,
  }
];

const Testimonial = () => {
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -left-48 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-2 block">Community Voices</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What Our Readers Say</h2>
          <p className="text-lg text-zinc-400">
            Join thousands of satisfied members who have made our library their second home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full"
        >
          <Swiper
            loop={true}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 15,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
           
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="w-full py-10"
          >
            {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
              <SwiperSlide key={`${testimonial.id}-${index}`} className="max-w-md w-full sm:w-[400px]">
                <div className="bg-zinc-800/80 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-8 shadow-2xl relative h-full flex flex-col mx-4">
                  <div className="absolute top-6 right-8 text-blue-500/20">
                    <Quote size={60} className="transform rotate-180" />
                  </div>
                  
                  <div className="flex mb-6 relative z-10 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-zinc-600"} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-zinc-300 text-lg italic mb-8 relative z-10 flex-1 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 relative z-10 mt-auto pt-4 border-t border-zinc-700/50">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50"
                    />
                    <div>
                      <h4 className="text-white font-bold">{testimonial.name}</h4>
                      <p className="text-blue-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
{/* Custom styles to override default swiper pagination dots */}
<style dangerouslySetInnerHTML={{__html: `
  .swiper-pagination-bullet {
    background: #52525b;
    opacity: 1;
  }
  .swiper-pagination-bullet-active {
    background: #3b82f6;
  }
`}} />
    </section>
  );
};

export default Testimonial;