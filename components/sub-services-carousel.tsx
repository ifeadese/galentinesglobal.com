import React from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import { Business } from "types";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { getSubServices } from "helpers";
import Card from "./card";

interface Props {
  business: Business;
}

const SubServicesCarousel = ({ business }: Props) => {
  const subServices = getSubServices(business)
  const router = useRouter();
  return (
    <section style={{ background: "#0c0c0c", padding: '1.7rem 0', borderTop: '1px solid rgb(76, 76, 76)' }}>
      <Swiper
        speed={500}
        breakpoints={{
          320: { slidesPerView: 1.3 },
          520: { slidesPerView: 1.3 },
          768: { slidesPerView: 2.3 },
          968: { slidesPerView: 2.3 },
          1120: { slidesPerView: 3.3 },
          1400: { slidesPerView: 4.3 },
        }}
        modules={[FreeMode, Pagination]}
        spaceBetween={25}
        freeMode={true}
        className="carousel"
      >
        {subServices.map((subService, idx) => (
          <SwiperSlide
            key={idx}
            onClick={() => router.push(subService.pagePath)}
          >
            <Card service={subService} height='20rem' />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default SubServicesCarousel;
