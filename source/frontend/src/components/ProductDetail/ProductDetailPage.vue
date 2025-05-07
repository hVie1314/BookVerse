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
            
            <section v-else class="product-section">
                <div class="product-detail-container">
                    <figure class="product-image-detail-column">
                        <img
                            :src="getMainImage(book)"
                            class="product-detail-image"
                            :alt="book.title"
                            @error="handleImageError"
                        />
                        
                        <!-- Thêm gallery hình ảnh nếu có nhiều hình -->
                        <div v-if="bookImages.length > 1" class="product-image-thumbnails">
                            <img 
                                v-for="(image, index) in bookImages.slice(0, 4)" 
                                :key="index"
                                :src="image"
                                @click="selectImage(image)"
                                class="thumbnail-image"
                                :class="{ 'active': selectedImage === image }"
                                @error="handleThumbnailError($event, index)"
                            />
                            <div v-if="bookImages.length > 4" class="more-images">+{{ bookImages.length - 4 }}</div>
                        </div>
                    </figure>
                    <div class="product-info-column">
                        <ProductInfo :book="book" />
                    </div>
                </div>
        
                <RatingSection :ratings="book.ratings || []" />
        
                <ReviewList :reviews="book.reviews || []" :bookId="book._id || book.id"/>
        
                <h2 class="recommended-title">Gợi ý sản phẩm</h2>
                
                <RecommendedProducts :currentBookId="book._id || book.id" />
            </section>
        </main>
        
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
                bookImages: []
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
                        
                        // Process images after setting book data
                        this.processBookImages();
                    } else {
                        this.error = 'Không thể tải thông tin sách';
                    }
                } catch (error) {
                    console.error('Error fetching book details:', error);
                    this.error = 'Đã xảy ra lỗi khi tải thông tin sách';
                } finally {
                    this.loading = false;
                }
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
            }
        },
        created() {
            this.fetchBookDetails();
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
        min-height: 100vh; /* Đảm bảo trang chiếm toàn bộ chiều cao màn hình */
        width: 100%;
        background-color: rgb(244, 235, 225);
    }

    .product-detail-page {
        display: flex;
        width: 100%;
        flex-direction: column;
        flex: 1; /*Đảm bảo phần nội dung mở rộng để footer nằm ở dưới cùng*/
        padding: 10px 0; /* Thêm padding trên dưới */
        margin-bottom: 30px;
        margin-top: 100px;
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