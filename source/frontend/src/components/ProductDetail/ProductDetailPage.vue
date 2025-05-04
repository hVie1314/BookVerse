<template>
    <div class="page-wrapper">
      <!-- Thêm thanh điều hướng -->
        <Nav />
        
        <main class="product-detail-page">
            <section class="product-section">
                <div class="product-detail-container">
                    <figure class="product-image-detail-column">
                        <img
                        src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/583d666a999a910a205b5f8084eecbefb04496ba?placeholderIfAbsent=true"
                        class="product-detail-image"
                        alt="Book cover"
                        />
                    </figure>
                    <div class="product-info-column">
                        <ProductInfo />
                    </div>
                </div>
        
                <RatingSection />
        
                <ReviewList />
        
                <h2 class="recommended-title">Gợi ý sản phẩm</h2>
            </section>
    
            <RecommendedProducts />
        </main>
        
        <!-- Thêm footer -->
        <Footer />
    </div>
</template>
    
  
<script>
    import ProductInfo from './ProductInfo.vue';
    import RatingSection from './RatingSection.vue';
    import ReviewList from './ReviewList.vue';
    import RecommendedProducts from './RecommendedProducts.vue';
    import Nav from '../navbar/Nav.vue'; // Import Nav component
    import Footer from '../footer/footer.vue'; // Import Footer component (chú ý 'f' viết thường)
    export default {
        name: 'ProductDetailPage',
        components: {
        ProductInfo,
        RatingSection,
        ReviewList,
        RecommendedProducts,
        Nav,
        Footer // Đảm bảo Footer được import đúng cách
        }
    };
</script>
  
<style scoped>
    /* Thêm wrapper bao bọc toàn bộ trang */
    .page-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh; /* Đảm bảo trang chiếm toàn bộ chiều cao màn hình */
        width: 100%;
        background-color: antiquewhite;
    }

    .product-detail-page {
        display: flex;
        width: 100%;
        flex-direction: column;
        flex: 1; /*Đảm bảo phần nội dung mở rộng để footer nằm ở dưới cùng*/
        padding: 10px 0; /* Thêm padding trên dưới */
        margin-bottom: 30px;
    }
  
    
    .product-section {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
        margin: 0 auto; /* Căn giữa section */
    }
    
    @media (max-width: 991px) {
        .product-section {
        max-width: 100%;
        }
    }
    
    /* Giảm margin-top */
    .product-detail-container {
        width: 85%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 20px; /* Giảm từ 30px */
    }
    
    
    @media (max-width: 991px) {
        .product-container {
            max-width: 100%;
        }
    }
    
    @media (max-width: 991px) {
        .product-layout {
        flex-direction: column;
        align-items: stretch;
        gap: 0px;
        }
    }
    
    .product-image-detail-column {
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Thay đổi từ stretch thành flex-start */
        line-height: normal;
        width: 35%;
        margin: 0;
        /* max-height: 450px; */
        padding-top: 0; /* Đảm bảo không có padding trên cùng */
    }
    
    @media (max-width: 991px) {
        .product-image-column {
        width: 100%;
        }
    }
    
    .product-detail-image {
        aspect-ratio: 0.8;
        object-fit: contain; /* Thay đổi từ contain thành cover */
        object-position: top; /* Định vị phần trên của hình ảnh */
        width: 100%;
        flex-grow: 1;
        margin-top: 0; /* Đảm bảo không có margin trên cùng */
        min-height: 180px; /* Thêm chiều cao tối thiểu */
    }
    
    @media (max-width: 991px) {
        .product-image {
        max-width: 100%;
        margin-top: 40px;
        }
    }
    
    .product-info-column {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        line-height: normal;
        width: 50%; /* Tăng từ 50% */
        margin-left: 0px; /* Giảm từ 20px */
    }
    
    @media (max-width: 991px) {
        .product-info-column {
        width: 100%;
        margin-left: 0; /* Xóa margin cho màn hình nhỏ */
        margin-top: 20px; /* Thêm margin-top */
        }
    }
    
    .recommended-title {
        color: rgba(77, 41, 0, 1);
        font-size: 24px; /* Giảm từ 40px */
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        margin-top: 40px; /* Giảm từ 60px */
        width: 85%;
        margin-left: 0;
    }
    
    @media (max-width: 991px) {
        .recommended-title {
            margin-top: 30px; /* Giảm từ 40px */
            font-size: 22px; /* Giảm từ 32px */
        }
        
        .product-image {
            margin-top: 25px; /* Giảm từ 40px */
        }
        
        .product-info-column {
            margin-top: 15px; /* Giảm từ 20px */
        }
    }
</style>