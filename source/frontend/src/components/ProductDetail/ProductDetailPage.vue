<template>
    <div class="page-wrapper">
        <Nav />
        
        <main class="product-detail-page">
            <section v-if="loading" class="loading-container">
                <i class="fa-solid fa-spinner fa-spin"></i> Đang tải...
            </section>
            
            <section v-else-if="error" class="error-message">
                {{ error }}
            </section>
            
            <section v-else-if="book && book.title" class="product-section">
                <div class="product-detail-container">
                    <figure class="product-image-detail-column">
                        <div class="image-container">
                            <img
                            :src="getMainImage(book)"
                            class="product-detail-image"
                            :alt="book.title"
                            @error="handleImageError"
                            @click="showGalleryWithImage(selectedImage || bookImages[0])"
                            />
                        </div>
                        
                        <div class="thumbnails-grid">
                            <img 
                            v-for="(image, index) in bookImages.slice(0, Math.min(4, bookImages.length))" 
                            :key="index"
                            :src="image"
                            @click="selectImage(image)"
                            class="thumbnail"
                            :class="{ 'active-thumbnail': selectedImage === image }"
                            @error="handleThumbnailError($event, index)"
                            />
                            
                            <!-- Hiển thị "+" nếu có nhiều hơn 4 hình ảnh -->
                            <div v-if="bookImages.length > 4" class="more-images-overlay" @click="showAllImages">
                            <span>+{{ bookImages.length - 4 }}</span>
                            </div>
                        </div>
                    </figure>
                    <div class="product-info-column">
                        <ProductInfo :book="book" />
                    </div>
                </div>
        
                <RatingSection 
                    v-if="bookId" 
                    :bookId="bookId" 
                    :initialReviewCount="book.reviews ? book.reviews.length : 0"
                    @review-added="handleReviewAdded" 
                />
        
                <ReviewList v-if="bookId" :bookId="bookId" :reviews="reviews" />
        
                <h2 class="recommended-title">Gợi ý sản phẩm</h2>
                
                <RecommendedProducts :currentBookId="book._id || book.id" />
            </section>
            <section v-else class="error-message">
                Không tìm thấy thông tin sách
            </section>
        </main>
        
        <Footer />
    </div>

    <!-- Thêm vào cuối template, trước </div> cuối cùng -->
    <div v-if="showGalleryModal" class="gallery-modal" @click.self="showGalleryModal = false">
        <div class="gallery-content">
            <button class="close-button" @click="showGalleryModal = false">×</button>
    
            <div class="main-gallery-image-container">
                <img 
                    :src="currentGalleryImage" 
                    class="main-gallery-image" 
                    alt="Book image"
                    :style="{ transform: `scale(${zoomLevel})` }"
                />
      
                <div class="zoom-controls">
                    <button class="zoom-btn" @click="zoomIn" title="Phóng to">+</button>
                    <button class="zoom-btn" @click="zoomOut" title="Thu nhỏ">-</button>
                    <button class="zoom-btn" @click="resetZoom" title="Khôi phục">↺</button>
                </div>
            </div>
    
            <div class="gallery-thumbnails">
                <img 
                    v-for="(image, index) in bookImages" 
                    :key="index"
                    :src="image"
                    :class="['gallery-thumbnail', { active: currentGalleryImage === image }]"
                    @click="currentGalleryImage = image; resetZoom()"
                    @error="handleThumbnailError($event, index)"
                />
            </div>
        </div>
    </div>
</template>
    
  
<script>
    import ProductInfo from './ProductInfo.vue';
    import RatingSection from './RatingSection.vue';
    import ReviewList from './ReviewList.vue';
    import RecommendedProducts from './RecommendedProducts.vue';
    import Nav from '../navbar/Nav.vue'; // Import Nav component
    import Footer from '../footer/footer.vue'; // Import Footer component (chú ý 'f' viết thường)
    import BookService from '@/services/BookService';

    export default {
        name: 'ProductDetailPage',
        components: {
            ProductInfo,
            RatingSection,
            ReviewList,
            RecommendedProducts,
            Nav,
            Footer // Đảm bảo Footer được import đúng cách
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                book: {},
                loading: true,
                error: null,
                selectedImage: null,
                bookImages: [],
                bookId: null,
                reviews: [],
                showReviewForm: false,
                showGalleryModal: false,
                currentGalleryImage: null,
                zoomLevel: 1 // Thêm biến để quản lý mức độ phóng to
            }
        },
        methods: {
            async fetchBookDetails() {
                this.loading = true;
                this.error = null;
                
                try {
                    const response = await BookService.getBookById(this.id);
                    console.log('Book details response:', response);
                    
                    if (response.data) {
                        // Check different response structures
                        if (response.data.book) {
                            this.book = response.data.book;
                        } else if (response.data.data && response.data.data.book) {
                            this.book = response.data.data.book;
                        } else if (response.data.success && response.data.data) {
                            this.book = response.data.data;
                        } else {
                            this.error = 'Không tìm thấy thông tin sách';
                        }
                        console.log('Dữ liệu sách nhận được:', this.book);
                        console.log('Tiêu đề:', this.book.title);
                        console.log('Tác giả:', this.book.author);
                        // Process images after setting book data
                        this.processBookImages();
                    } else {
                        this.error = 'Không thể tải thông tin sách';
                    }

                    const reviewResponse = await BookService.getBookReviews(this.bookId);
                    if (reviewResponse && reviewResponse.data && reviewResponse.data.reviews) {
                        this.reviews = reviewResponse.data.reviews;
                    }
                } catch (error) {
                    console.error('Error fetching book details:', error);
                    this.error = 'Đã xảy ra lỗi khi tải thông tin sách';
                } finally {
                    this.loading = false;
                }
            },
            openReviewForm() {
                this.showReviewForm = true;
            },
            processBookImages() {
                try {
                    if (this.book.image) {
                        // Check if image is a string array representation
                        if (typeof this.book.image === 'string' && 
                            this.book.image.startsWith('[') && 
                            this.book.image.endsWith(']')) {
                            // Parse the image string to array
                            const imageArray = JSON.parse(this.book.image.replace(/'/g, '"'));
                            this.bookImages = imageArray;
                            // Set selected image to first image
                            this.selectedImage = imageArray[0];
                        } else {
                            // Single image
                            this.bookImages = [this.book.image];
                            this.selectedImage = this.book.image;
                        }
                    } else {
                        // Fallback image
                        const fallbackImage = `https://picsum.photos/seed/${this.book._id || 'default'}/300/400`;
                        this.bookImages = [fallbackImage];
                        this.selectedImage = fallbackImage;
                    }
                } catch (error) {
                    console.error('Error processing book images:', error);
                    const fallbackImage = `https://picsum.photos/seed/${this.book._id || 'default'}/300/400`;
                    this.bookImages = [fallbackImage];
                    this.selectedImage = fallbackImage;
                }
            },
            
            getMainImage(book) {
                return this.selectedImage || 
                       (book.mainImage) || 
                       (this.bookImages && this.bookImages.length > 0 ? this.bookImages[0] : 
                       `https://picsum.photos/seed/${book._id || 'default'}/300/400`);
            },
            
            selectImage(image) {
                this.selectedImage = image;
            },
            
            handleImageError(e) {
                e.target.src = `https://picsum.photos/seed/${this.book._id || 'default'}/300/400`;
            },
            
            handleThumbnailError(e, index) {
                e.target.src = `https://picsum.photos/seed/${this.book._id || 'default'}-${index}/100/150`;
            },

            handleReviewAdded() {
                // Cập nhật lại dữ liệu sách (để cập nhật rating)
                this.fetchBookDetails();
                
                // Thông báo đánh giá thành công
                this.$store.dispatch('showAlert', {
                show: true,
                type: 'success',
                title: 'Đánh giá thành công',
                message: 'Cảm ơn bạn đã đánh giá sản phẩm!',
                autoClose: true
                });
            },

            zoomIn() {
        if (this.zoomLevel < 3) {
            this.zoomLevel += 0.5;
        }
    },
    
    zoomOut() {
        if (this.zoomLevel > 1) {
            this.zoomLevel -= 0.5;
        }
    },
    
    resetZoom() {
        this.zoomLevel = 1;
    },
    
    showGalleryWithImage(image) {
        this.showGalleryModal = true;
        this.currentGalleryImage = image;
        this.zoomLevel = 1; // Đảm bảo reset zoom
    },
    
    showAllImages() {
        this.showGalleryModal = true;
        this.currentGalleryImage = this.selectedImage || this.bookImages[0];
        this.zoomLevel = 1; // Đảm bảo reset zoom
    }
        },
        created() {
            // Lấy bookId từ route params
            this.bookId = this.$route.params.id;
            
            // Tải dữ liệu sách và reviews
            if (this.bookId) {
            this.fetchBookDetails();
            }
        },
        watch: {
            id(newId) {
                if (newId) {
                    this.fetchBookDetails();
                }
            }
        }
    };
</script>
  
<style scoped>
    .product-image-thumbnails {
        display: flex;
        justify-content: center;
        margin-top: 15px;
        gap: 10px;
    }
    
    .thumbnail-image {
        width: 60px;
        height: 80px;
        object-fit: cover;
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .thumbnail-image.active {
        border-color: #4d2900;
    }
    
    .thumbnail-image:hover {
        transform: scale(1.05);
    }
    
    .more-images {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 80px;
        background-color: rgba(0,0,0,0.1);
        color: #4d2900;
        font-weight: bold;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .loading-container, .error-message {
        width: 100%;
        padding: 50px 0;
        text-align: center;
        font-family: "Montserrat", sans-serif;
        font-size: 18px;
        color: #4d2900;
    }
    
    .error-message {
        color: #ff3333;
    }
    /* Thêm wrapper bao bọc toàn bộ trang */
    .page-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between; /* Thêm dòng này */
        min-height: 100vh;
        width: 100%;
        background-color: rgb(244, 235, 225);
    }

    .product-detail-image {
        width: 100%;
        height: 550px; /* Tăng từ 400px lên 550px */
        object-fit: contain;
        border-radius: 8px;
        background-color: #f9f9f9;
        transition: transform 0.3s ease;
        cursor: zoom-in;
        padding: 10px; /* Thêm padding để tránh ảnh chạm sát viền */
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

    /* Thêm style mới cho figure.product-image-detail-column */
    .product-image-detail-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 35%;
        margin: 0;
        position: relative;
    }

    /* Cải thiện hiển thị ảnh chính */
    .product-detail-image {
        width: 100%;
        height: 400px; /* Kích thước cố định */
        object-fit: contain; /* Giữ nguyên tỷ lệ ảnh và hiển thị toàn bộ */
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #f9f9f9;
        transition: transform 0.3s ease;
        cursor: zoom-in;
    }

    /* Style cho lưới hình thu nhỏ */
    .thumbnails-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        width: 100%;
        position: relative;
    }

    /* Điều chỉnh hiển thị thumbnail */
    .thumbnail {
        aspect-ratio: 1/1; /* Giữ tỷ lệ vuông */
        width: 100%;
        border-radius: 4px;
        object-fit: cover; /* Mặc định hiển thị thumbnail kiểu cover */
        cursor: pointer;
        opacity: 0.8;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .thumbnail:hover {
        opacity: 1;
        transform: scale(1.05);
    }

    .active-thumbnail {
        border-color: #4d2900;
        opacity: 1;
    }

    /* Style cho overlay "xem thêm hình ảnh" */
    .more-images-overlay {
        position: absolute;
        right: 0%; /* Điều chỉnh để nằm ở góc phải ảnh thứ 3 */
        bottom: 0;
        width: 25%; /* Giữ nguyên kích thước bằng 1/4 lưới */
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        border-radius: 4px;
        cursor: pointer;
        z-index: 5; /* Đảm bảo hiển thị trên cùng */
    }

    /* Responsive styles */
    @media (max-width: 991px) {
        .product-image-detail-column {
            width: 100%;
        }
        
        .image-container, .product-detail-image {
            height: 450px; /* Giảm chiều cao trên thiết bị nhỏ hơn nhưng vẫn cao hơn trước */
        }
        
        /* Điều chỉnh vị trí overlay khi responsive */
        .more-images-overlay {
            right: 25%;
        }
    }

    @media (max-width: 576px) {
        .image-container, .product-detail-image {
            height: 350px; /* Giảm tiếp chiều cao trên thiết bị rất nhỏ */
        }
    }

    /* Modal gallery styles */
    .gallery-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .gallery-content {
        width: 90%;
        max-width: 1000px;
        max-height: 90vh;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 30px;
        background: none;
        border: none;
        color: #333;
        cursor: pointer;
        z-index: 1001;
    }

    .main-gallery-image-container {
        width: 100%;
        height: 600px; /* Tăng từ 500px lên 600px */
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-color: #f8f8f8;
        position: relative;
    }

    /* Cải thiện hiển thị ảnh trong modal */
    .main-gallery-image {
        max-width: 95%;
        max-height: 95%;
        object-fit: contain;
        transition: transform 0.3s ease;
    }

    .gallery-thumbnails {
        display: flex;
        overflow-x: auto;
        padding: 15px;
        gap: 10px;
        background-color: #f0f0f0;
    }

    .gallery-thumbnail {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s;
    }

    .gallery-thumbnail.active {
        border-color: #4d2900;
    }

    .gallery-thumbnail:hover {
        transform: scale(1.05);
    }

    .image-container {
        width: 100%;
        height: 550px; /* Tăng từ 400px lên 550px */
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        border-radius: 8px;
        background-color: #f9f9f9;
        margin-bottom: 20px;
    }

    /* Thêm các nút zoom */
    .zoom-controls {
        position: absolute;
        bottom: 15px;
        right: 15px;
        display: flex;
        gap: 10px;
        z-index: 1002;
    }

    .zoom-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        color: #333;
        transition: all 0.2s;
    }

    .zoom-btn:hover {
        background-color: white;
        transform: scale(1.1);
    }
</style>