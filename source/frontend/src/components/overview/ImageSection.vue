<template>
  <div id="bookCarousel" class="carousel slide" data-bs-ride="carousel">
    <!-- Indicators -->
    <div class="carousel-indicators">
      <button 
        v-for="(image, index) in images" 
        :key="`indicator-${index}`" 
        type="button" 
        data-bs-target="#bookCarousel" 
        :data-bs-slide-to="index" 
        :class="{ active: index === currentSlide }"
        :aria-current="index === currentSlide"
        :aria-label="`Slide ${index + 1}`"
        @click="goToSlide(index)"
      ></button>
    </div>
    
    <!-- Slides -->
    <div class="carousel-inner rounded-4 shadow">
      <div 
        v-for="(image, index) in images" 
        :key="`slide-${index}`" 
        class="carousel-item" 
        :class="{ active: index === currentSlide }"
        :data-bs-interval="5000"
      >
        <img :src="image.url" class="d-block w-100 book-image" :alt="image.alt">
        <div class="carousel-caption">
          <h3>{{ image.caption }}</h3>
          <p>{{ image.description }}</p>
        </div>
      </div>
    </div>
    
    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#bookCarousel" @click="prevSlide">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#bookCarousel" @click="nextSlide">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>
  
<script>
export default {
  name: "ImageSection",
  data() {
    return {
      currentSlide: 0,
      images: [
        {
          url: "/images/new-books.jpg",
          alt: "Sách mới ra mắt",
          caption: "Khám phá sách mới",
          description: "Những tựa sách mới nhất của tháng này"
        },
        {
          url: "/images/best-seller.jpg",
          alt: "Sách bán chạy",
          caption: "Sách bán chạy",
          description: "Những cuốn sách được yêu thích nhất"
        },
        {
          url: "/images/best-decrease.jpg",
          alt: "Sách giảm giá",
          caption: "Ưu đãi đặc biệt",
          description: "Giảm giá đến 50% cho các tựa sách hot"
        },
        {
          url: "/images/top-week.jpeg",
          alt: "Sách nổi bật",
          caption: "Nổi bật trong tuần",
          description: "Những cuốn sách gây chú ý trong tuần này"
        }
      ],
      autoPlayInterval: null
    };
  },
  mounted() {
    this.initBootstrapCarousel();
    
    // Sự kiện khi carousel đã trượt
    document.getElementById('bookCarousel').addEventListener('slid.bs.carousel', (event) => {
      this.currentSlide = event.to;
    });
  },
  beforeUnmount() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  },
  methods: {
    initBootstrapCarousel() {
      // Khởi tạo Bootstrap carousel khi component được tạo
      if (typeof window.bootstrap !== 'undefined') {
          const carouselElement = document.getElementById('bookCarousel');
          // Sử dụng window.bootstrap thay vì bootstrap
          const carousel = new window.bootstrap.Carousel(carouselElement, {
              interval: 5000,
              wrap: true,
              touch: true
          });
          if(carousel) {
              this.autoPlayInterval = setInterval(() => {
                  carousel.next();
              }, 5000); // Tự động chuyển slide mỗi 5 giây
          }
      } else {
        console.warn('Bootstrap không được tìm thấy. Hãy chắc chắn bạn đã import Bootstrap JS.');
      }
    },
    nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.images.length;
      this.goToSlide(nextIndex);
    },
    prevSlide() {
      const prevIndex = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
      this.goToSlide(prevIndex);
    },
    goToSlide(index) {
      this.currentSlide = index;
      if (typeof window.bootstrap !== 'undefined') {
        const carousel = window.bootstrap.Carousel.getInstance(document.getElementById('bookCarousel'));
        if (carousel) {
          carousel.to(index);
        }
      }
    }
  }
};
</script>
  
<style scoped>
/* Custom styling cho Bootstrap carousel */
.carousel {
  width: 100%;
  height: 500px;
  border-radius: 16px;
  overflow: visible;
  background-color: transparent;
}

.carousel-inner {
  height: 100%;
  background-color: transparent; 
  overflow: hidden;
}

.carousel-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.book-image {
  height: auto;
  width: 100%;
  max-height: 100%;
  object-fit: cover;
  margin: 0 auto;
}

/* Style cho caption */
.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0));
  padding: 25px;
  text-align: left;
}
  
.carousel-caption h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
}

.carousel-caption p {
  margin: 0;
  font-size: 16px;
}

/* Style cho controls - cập nhật để nửa trong nửa ngoài */
.carousel-control-prev,
.carousel-control-next {
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.8;
  transition: all 0.3s ease;
  position: absolute;
  z-index: 10;
}

.carousel-control-prev {
  left: 0;
  transform: translateX(-50%) translateY(-50%);
}

.carousel-control-next {
  right: 0;
  transform: translateX(50%) translateY(-50%);
}

.carousel-control-prev:hover,
.carousel-control-next:hover {
  background-color: rgba(255, 255, 255, 0.95);
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.carousel-control-prev:hover {
  transform: translateX(-50%) translateY(-50%) scale(1.15);
}

.carousel-control-next:hover {
  transform: translateX(50%) translateY(-50%) scale(1.15);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(25%) sepia(20%) saturate(1000%) hue-rotate(300deg) brightness(90%) contrast(90%);
}

/* Style cho indicators */
.carousel-indicators {
  margin-bottom: 1rem;
}

.carousel-indicators [data-bs-target] {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.95);
  margin: 0 5px;
}

.carousel-indicators .active {
  background-color: white;
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 991px) {
  .carousel {
    height: 350px;
  }
  
  .carousel-caption h3 {
    font-size: 20px;
  }
  
  .carousel-caption p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .carousel {
    height: 250px;
  }
  
  .carousel-control-prev,
  .carousel-control-next {
    width: 30px;
    height: 30px;
  }
}
.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
}

.carousel-item.active {
  display: flex;
  position: relative;
}

/* Thêm vào phần <style> trong ImageSection.vue */
.carousel-item:not(.active) {
  display: none !important; /* Lệnh !important để ghi đè bất kỳ CSS nào khác */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #000;
    width: 18px; /* Giảm từ kích thước mặc định 20px */
    height: 18px; /* Giảm từ kích thước mặc định 20px */
    filter: invert(1); /* Làm cho icon màu đen thay vì màu trắng mặc định */
    opacity: 0.7;
}

.carousel-control-prev,
.carousel-control-next {
    width: 35px; /* Giảm từ 40px */
    height: 35px; /* Giảm từ 40px */
}
</style>