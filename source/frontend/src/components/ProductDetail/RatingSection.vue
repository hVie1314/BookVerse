<template>
    <section class="rating-section">
      <h2 class="rating-title">Đánh giá</h2>
  
      <div v-if="loading" class="loading-message">
        <p>Đang tải dữ liệu đánh giá...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="rating-container">
        <div class="rating-layout">
          <div class="rating-summary-column">
            <div class="rating-summary">
              <p class="average-rating">{{ averageRating.toFixed(1) }}/5</p>
              <div class="star-total">
                <!-- Hiển thị sao đầy dựa trên xếp hạng trung bình -->
                <i v-for="index in 5" :key="`total-star-${index}`" 
                   :class="[
                     index <= Math.round(averageRating) ? 'fas fa-star filled-star' : 'far fa-star empty-star'
                   ]"
                ></i>
              </div>
              <p class="total-reviews">{{ totalReviews }} đánh giá</p>
            </div>
          </div>
  
          <div class="rating-details-column">
            <div class="rating-details">
              <div class="rating-row" v-for="star in 5" :key="`star-${star}`">
                <div class="star-label-container">
                  <span class="star-label">{{ star }}</span>
                  <div class="progress-container">
                    <div class="progress-bar" :style="`width: ${getProgressWidth(getRatingCount(star))}`"></div>
                  </div>
                </div>
                <span class="count-label">{{ getRatingCount(star) }}</span>
              </div>
            </div>
          </div>
  
          <div class="rating-action-column">
            <div class="rating-action">
              <p v-if="!isLoggedIn" class="login-message">
                Vui lòng đăng nhập hoặc đăng ký để đánh giá sản phẩm!
              </p>
              <div class="write-review-container">
                <button class="write-review-button" @click="handleWriteReview">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/cb33a1d71faef1ae7e405602e6c9ca474fd29e55?placeholderIfAbsent=true"
                    class="write-icon"
                    alt="Write icon"
                  />
                  <span class="write-text">Viết đánh giá</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>
  
<script>
import BookService from '@/services/BookService';
import AuthenticationService from '@/services/AuthenticationService';

export default {
    name: 'RatingSection',
    props: {
        bookId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: true,
            error: null,
            averageRating: 0,
            totalReviews: 0,
            ratingStats: [],
            reviews: [],
            isLoggedIn: false
        };
    },
    created() {
        this.isLoggedIn = AuthenticationService.isLoggedIn();
        this.fetchReviewData();
    },
    methods: {
        async fetchReviewData() {
        this.loading = true;
        this.error = null;
        
        try {
            const response = await BookService.getBookReviews(this.bookId);
            
            // Kiểm tra xem component có còn mounted không
            if (this._isDestroyed || this._isBeingDestroyed) {
                return; // Thoát nếu component đã bị hủy
            }
            
            if (response && response.data) {
                this.averageRating = response.data.averageRating || 0;
                // ...
            }
        } catch (error) {
            // Cũng kiểm tra ở đây
            if (this._isDestroyed || this._isBeingDestroyed) return;
            
            console.error('Lỗi khi tải dữ liệu đánh giá:', error);
            this.error = 'Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.';
        } finally {
            if (!this._isDestroyed && !this._isBeingDestroyed) {
                this.loading = false;
            }
        }
    },
        
        getProgressWidth(count) {
            if (!this.ratingStats.length) return '0%';
            
            // Tìm giá trị cao nhất trong ratingStats
            const maxCount = Math.max(...this.ratingStats.map(stat => stat.count), 1);
            
            // Tính phần trăm dựa trên giá trị cao nhất
            const percentage = (count / maxCount) * 100;
            return `${percentage}%`;
        },
        
        getRatingCount(star) {
            const statItem = this.ratingStats.find(item => item.rating === star);
            return statItem ? statItem.count : 0;
        },
        
        handleWriteReview() {
            if (!this.isLoggedIn) {
                // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
                this.$router.push({
                    path: '/login',
                    query: { redirect: this.$route.fullPath }
                });
                return;
            }
            
            // Nếu đã đăng nhập, mở form viết đánh giá
            this.$emit('open-review-form');
        }
    }
};
</script>
  
<style scoped>
    .rating-section {
        width: 85%;
    }
    
    .filled-star {
        color: #FFD700; /* Màu vàng */
        font-size: 26px;
        margin-right: 3px;
    }

    .empty-star {
        color: #D3D3D3; /* Màu xám nhạt */
        font-size: 26px;
        margin-right: 3px;
    }
    
    .loading-message,
    .error-message {
        text-align: center;
        padding: 20px;
        font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
    }
    
    .error-message {
        color: #e53935;
    }
    
    /* Các style khác giữ nguyên */
    .rating-title {
        color: rgba(77, 41, 0, 1);
        font-size: 28px; /* Giảm từ 40px */
        margin-top: 40px; /* Giảm từ 95px */
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        align-self: flex-start;
    }
    
    @media (max-width: 991px) {
        .rating-title {
        margin-left: 6px;
        margin-top: 40px;
        }
    }
    
    .rating-container {
        margin-top: 50px;
    }
    
    @media (max-width: 991px) {
        .rating-container {
        max-width: 100%;
        margin-top: 40px;
        }
    }
    
    .rating-layout {
        gap: 20px;
        display: flex;
    }
    
    @media (max-width: 991px) {
        .rating-layout {
        flex-direction: column;
        align-items: stretch;
        gap: 0px;
        }
    }
    
    .rating-summary-column {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        line-height: normal;
        width: 18%;
        margin-left: 0px;
    }
    
    @media (max-width: 991px) {
        .rating-summary-column {
        width: 100%;
        }
    }
    
    .rating-summary {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }
    
    @media (max-width: 991px) {
        .rating-summary {
        margin-top: 40px;
        }
    }
    
    .average-rating {
        color: rgba(46, 46, 46, 1);
        font-size: 50px; /* Giảm từ 80px */
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        margin-right: 10px;
    }
    
    @media (max-width: 991px) {
        .average-rating {
        margin-left: 7px;
        font-size: 40px;
        }
    }
    
    .star-total {
        display: flex;
        margin-top: 24px;
        align-items: center;
        gap: 7px;
        justify-content: flex-start;
    }
    
    .star-icon {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 30px; /* Giảm từ 40px */
        align-self: stretch;
        margin: auto 0;
        flex-shrink: 0;
    }
    
    .total-reviews {
        color: rgba(0, 0, 0, 1);
        font-size: 20px;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        align-self: center;
        margin-top: 24px;
    }
    
    .rating-details-column {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        line-height: normal;
        width: 35%;
        margin-left: 15px; /* Giảm từ 20px */
    }
    
    @media (max-width: 991px) {
        .rating-details-column {
        width: 100%;
        }
    }
    
    .rating-details {
        width: 100%;
    }
    
    @media (max-width: 991px) {
        .rating-details {
        max-width: 100%;
        margin-top: 40px;
        }
    }
    
    .rating-row {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 27px;
        justify-content: flex-start;
        margin-bottom: 23px;
    }
    
    .rating-row:first-child {
        margin-bottom: 23px;
    }
    
    @media (max-width: 991px) {
        .rating-row {
        max-width: 100%;
        }
    }
    
    .star-label-container {
        align-self: stretch;
        display: flex;
        min-width: 240px;
        margin: auto 0;
        align-items: center;
        gap: 14px;
        justify-content: flex-start;
    }
    
    .star-label {
        color: rgba(217, 217, 217, 1);
        font-size: 20px;
        font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 600;
        align-self: stretch;
        margin: auto 0;
    }
    
    .progress-container {
        border-radius: 5px;
        background-color: rgba(242, 240, 234, 1);
        align-self: stretch;
        display: flex;
        min-width: 240px;
        margin: auto 0;
        min-height: 18px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 369px;
    }
    
    .progress-bar {
        border-radius: 5px;
        background-color: rgba(255, 199, 39, 1);
        display: flex;
        min-height: 18px;
        max-width: 100%;
    }
    
    .count-label {
        color: rgba(46, 46, 46, 1);
        font-size: 20px;
        font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        align-self: stretch;
        margin: auto 0;
    }
    
    .rating-action-column {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        line-height: normal;
        width: 47%;
        margin-left: 20px;
    }
    
    @media (max-width: 991px) {
        .rating-action-column {
        width: 100%;
        }
    }
    
    .rating-action {
        display: flex;
        margin-top: 80px;
        flex-direction: column;
        align-items: stretch;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
    }
    
    @media (max-width: 991px) {
        .rating-action {
        max-width: 100%;
        margin-top: 40px;
        }
    }
    
    .login-message {
        color: rgba(51, 51, 51, 1);
        font-size: 20px;
    }
    
    @media (max-width: 991px) {
        .login-message {
        max-width: 100%;
        }
    }
    
    .write-review-container {
        border-radius: 10px;
        background-color: rgba(255, 250, 245, 1);
        border-color: rgba(77, 41, 0, 1);
        border-style: solid;
        border-width: 2px;
        align-self: center;
        display: flex;
        margin-top: 24px;
        width: 477px;
        max-width: 100%;
        padding: 14px 70px;
        flex-direction: column;
        align-items: center;
        font-size: 18px;
        color: rgba(77, 41, 0, 1);
        justify-content: center;
    }
    
    @media (max-width: 991px) {
        .write-review-container {
        padding: 14px 20px;
        }
    }
    
    .write-review-button {
        display: flex;
        width: auto; /* Thay đổi từ 160px */
        max-width: 100%;
        align-items: center; /* Thay đổi từ stretch để căn giữa */
        gap: 6px; /* Giảm từ 9px */
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        color: inherit;
        font: inherit;
    }
    
    .write-icon {
        aspect-ratio: 1.13;
        object-fit: contain;
        object-position: center;
        width: 20px; /* Giảm từ 26px */
        align-self: center; /* Thay đổi từ flex-start để căn giữa theo chiều dọc */
        flex-shrink: 0;
    }
    
    .write-text {
        flex-grow: 1;
        flex-shrink: 1;
        width: auto; /* Thay đổi từ 120px */
        text-align: left;
        white-space: nowrap; /* Ngăn text xuống dòng */
    }
</style>