<template>
    <article class="product-info">
      <div class="info-container">
        <div class="book-info">
          <h1 class="book-title">{{ book.title || 'Không có tiêu đề' }}</h1>

            <div class="rating-container">
                <div class="star-rating">
                    <i v-for="index in 5" :key="index" 
                        :class="[
                            index <= Math.floor(averageRating) ? 'fas fa-star filled-star' : 
                            index - averageRating < 1 && index - averageRating > 0 ? 'fas fa-star-half-alt filled-star' : 'far fa-star empty-star'
                        ]"
                    ></i>
                </div>
                <span class="rating-value">{{ averageRating.toFixed(1) }}/5</span>
                <span class="review-count">({{ book.reviews ? book.reviews.length : 0 }} đánh giá)</span>
            </div>
          <p class="book-author">{{ book.author || 'Không có tác giả' }}</p>
          <p class="book-price">{{ formatPrice(book.price) }}</p>
  
          <div class="sold-info">
            <p class="sold-detail-text">
              <span class="sold-label">Đã bán</span>
              <span class="sold-count">{{ book.sold || 0 }}</span>
            </p>
            <div class="progress-info-container">
              <div class="progress-bar" :style="`width: ${calculateProgressWidth()}%`"></div>
            </div>
          </div>
  
          <section class="description-section">
                <h2 class="description-title">Mô tả</h2>
                <p class="description-text" :class="{ 'collapsed': !isExpanded }">
                    {{ book.description || 'Không có mô tả' }}
                </p>
                <button 
                    class="read-more" 
                    v-if="book.description && book.description.length > 100"
                    @click="toggleDescription">
                    {{ isExpanded ? 'Thu gọn' : 'Đọc thêm' }}
                </button>
            </section>
  
          <div class="quantity-section">
            <p class="quantity-label">Số lượng</p>
            <div class="quantity-selector">
              <div class="decrement-button" @click="decrementQuantity"></div>
              <span class="quantity-value">{{ quantity }}</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2b3e53de73fd963852263eb44cecf25179597046?placeholderIfAbsent=true"
                class="increment-button"
                alt="Increment quantity"
                @click="incrementQuantity"
              />
            </div>
          </div>
        </div>
  
        <ProductActions :book="book" :quantity="quantity" />
      </div>
    </article>
</template>
  
<script>
    import ProductActions from './ProductActions.vue';
    import BookService from '@/services/BookService';
    export default {
        name: 'ProductInfo',
        components: {
            ProductActions
        },
        props: {
            book: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
            isExpanded: false,
            quantity: 1,
            averageRating: 0,
            loading: false
            };
        },
        mounted() {
            this.fetchBookRating();
            
        },
        
        methods: {
            toggleDescription() {
            this.isExpanded = !this.isExpanded;
            },
            formatPrice(price) {
                if (!price) return '0 đ';
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(price).replace('₫', 'đ');
            },
            calculateProgressWidth() {
                // Giả sử tính toán dựa trên số lượng bán
                const soldCount = this.book.sold || 0;
                // Giả sử một sách bán chạy là khoảng 100 cuốn
                const percentage = Math.min(soldCount / 100 * 100, 100);
                return percentage;
            },
            incrementQuantity() {
                this.quantity++;
            },
            decrementQuantity() {
                if (this.quantity > 1) {
                    this.quantity--;
                }
            },
            async fetchBookRating() {
                try {
                    this.loading = true;
                    const bookId = this.book._id || this.book.id;
                    const response = await BookService.getBookReviews(bookId);
                    if (response.data && response.data.success && response.data.data) {
                        // Chuyển đổi từ chuỗi sang số
                        this.averageRating = parseFloat(response.data.data.rating) || 0;
                    } else {
                        this.averageRating = this.book.rating || 0;
                    }
                    console.log('Đánh giá trung bình:', this.averageRating);
                } catch (error) {
                    console.error('Lỗi khi lấy đánh giá trung bình:', error);
                    this.averageRating = this.book.rating || 0;
                } finally {
                    this.loading = false;
                }
            },
        }
    };
</script>
  
<style scoped>
    .filled-star {
        color: #FFD700; /* Màu vàng */
    }

    .empty-star {
        color: #D3D3D3; /* Màu xám nhạt */
    }
    .rating-container {
        display: flex;
        align-items: center;
        margin: 8px 0 16px 0;
    }

    .star-rating {
        display: inline-flex;
        margin-right: 8px;
    }

    .star-rating i {
        margin-right: 2px;
    }

    .rating-value {
        font-weight: 600;
        color: #4c2900;
        margin-right: 8px;
    }

    .review-count {
        color: #666;
        font-size: 0.9em;
    }
    .product-info {
        margin-top: 10px; /* Giảm từ 14px */
        width: 100%;
    }

    @media (max-width: 991px) {
        .product-info {
            margin-top: 25px; /* Giảm từ 40px */
        }
    }

    
    .info-container {
        width: 100%;
    }
    
    @media (max-width: 991px) {
        .info-container {
        max-width: 100%;
        margin-right: 2px;
        }
    }
    
    .book-title {
        color: rgba(76, 41, 0, 1);
        font-size: 22px; /* Giảm từ 28px */
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        line-height: 1.3; /* Giảm từ 1.4 */
    }
    
    @media (max-width: 991px) {
        .book-title {
        max-width: 100%;
        }
    }
    
    .book-author {
        color: #828282;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: 0.2px;
        text-transform: uppercase;
        font-size: 14px; /* Giảm từ 16px */
        margin-top: 8px; /* Giảm từ 10px */
    }
    
    @media (max-width: 991px) {
        .book-author {
        max-width: 100%;
        }
    }
    
    .book-price {
        color: rgba(76, 41, 0, 1);
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px; /* Giảm từ 0.72px */
        font-size: 20px; /* Giảm từ 24px */
        margin-top: 8px; /* Giảm từ 10px */
    }
    
    .book-title, 
    .book-author, 
    .book-price {
        width: 100%;
    }
    @media (max-width: 991px) {
        .book-price {
        max-width: 100%;
        }
    }
    
    .sold-info {
        display: flex;
        margin-top: 15px; /* Giảm từ 22px */
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }
    
    .sold-detail-text {
        color: #333333;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 16px; /* Giảm từ 20px */
        font-weight: 700;
        line-height: 1.4;
        letter-spacing: 0.2px;
        align-self: flex-start;
    }
    
    .sold-label {
        color: rgba(130, 130, 130, 1);
        margin-right: 15px;
    }
    
    .sold-count {
        color: rgba(76, 41, 0, 1);
        font-weight: 700;
    }
    
    .progress-info-container {
        width: 100%;
        border-radius: 5px;
        display: flex;
        margin-top: 10px;
        flex-direction: column;
        align-items: flex-start;
        background-color: #f2f2f2;
    }
    
    @media (max-width: 991px) {
        .progress-container {
        max-width: 100%;
        padding-right: 20px;
        }
    }
    
    .progress-bar {
        border-radius: 5px;
        background-color: rgba(76, 41, 0, 1);
        display: flex;
        flex-shrink: 0;
        height: 6px;
    }
    
    .description-section {
        display: flex;
        margin-top: 15px;
        width: 100%;
        padding-bottom: 8px;
        flex-direction: column;
        align-items: flex-start;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        color: rgba(76, 41, 0, 1);
    }
    
    .description-title {
        font-size: 16px; /* Giảm từ 22px */
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.22px;
    }
    
    .description-text {
        width: 100%;
        color: rgba(51, 51, 51, 1);
        font-weight: 400;
        letter-spacing: 0.2px;
        align-self: stretch;
        font-size: 14px;
        line-height: 1.4;
        margin-top: 8px;
        transition: max-height 0.3s ease;
    }
    
    /* Thêm class để giới hạn văn bản */
    .description-text.collapsed {
        display: -webkit-box;
        -webkit-line-clamp: 5; /* Giới hạn 5 dòng */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis; /* Hiển thị dấu "..." */
    }
    @media (max-width: 991px) {
        .description-text {
        max-width: 100%;
        }
    }
    
    .read-more {
        font-size: 15px;
        font-weight: 500;
        line-height: 2;
        letter-spacing: 0.18px;
        margin-top: 8px;
        background: none;
        border: none;
        color: #4c2900;
        cursor: pointer;
        padding: 0;
        text-align: left;
        /* text-decoration: underline; Thêm gạch chân để rõ là có thể nhấn */
    }
    
    .quantity-section {
        display: flex;
        margin-top: 15px;
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        color: #333;
        font-weight: 700;
    }

    .read-more:hover {
        opacity: 0.8;
        text-decoration: underline;
    }
    
    @media (max-width: 991px) {
        .quantity-section {
        max-width: 100%;
        }
    }
    
    .quantity-label {
        color: #333;
        font-size: 16px;
        line-height: 1.4;
        letter-spacing: 0.2px;
        align-self: flex-start;
    }
    
    .quantity-selector {
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--Gray-3, #828282);
        display: flex;
        margin-top: 12px;
        padding: 5px 15px;
        align-items: center;
        gap: 15px;
        font-size: 16px;
        white-space: nowrap;
        text-align: center;
        letter-spacing: 0.18px;
        line-height: 2;
        flex-wrap: wrap;
        justify-content: space-between;
        background-color: #fff;
    }
    
    @media (max-width: 991px) {
        .quantity-selector {
        max-width: 100%;
        padding-left: 20px;
        white-space: initial;
        }
    }
    
    .decrement-button {
        background-color: rgba(77, 41, 0, 1);
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        width: 5px;
        flex-shrink: 0;
        height: 2px;
        cursor: pointer;
    }
    
    .quantity-value {
        color: #333;
        align-self: flex-start;
    }
    
    .increment-button {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 27px;
        flex-shrink: 0;
        cursor: pointer;
    }
</style>