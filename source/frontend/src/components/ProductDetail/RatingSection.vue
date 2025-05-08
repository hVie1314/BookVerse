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
          <!-- Cột tóm tắt đánh giá -->
          <div class="rating-summary-column">
            <div class="rating-summary">
              <p class="average-rating">{{ averageRating.toFixed(1) }}/5</p>
              <div class="star-total">
                <i v-for="index in 5" 
                   :key="`total-star-${index}`" 
                   :class="[
                     index <= Math.round(averageRating) ? 'fas fa-star filled-star' : 'far fa-star empty-star'
                   ]"
                ></i>
              </div>
              <p class="total-reviews">{{ totalReviews }} đánh giá</p>
            </div>
          </div>
  
          <!-- Cột chi tiết theo số sao -->
          <div class="rating-details-column">
            <div class="rating-details">
              <div class="rating-row" v-for="star in 5" :key="`star-${star}`">
                <div class="star-label-container">
                  <span class="star-label">{{ star }}</span>
                  <div class="progress-container">
                    <div class="progress-bar" :style="`width: ${getPercentage(star)}%`"></div>
                  </div>
                </div>
                <span class="count-label">{{ getRatingCount(star) }}</span>
              </div>
            </div>
          </div>
  
          <!-- Phần viết đánh giá - giữ nguyên -->
          <div class="rating-action-column">
            <div class="rating-action">
                <!-- Chỉ hiển thị thông báo khi chưa đăng nhập -->
                <p v-if="!isLoggedIn" class="login-message">
                Vui lòng đăng nhập hoặc đăng ký để đánh giá sản phẩm!
                </p>
                
                <!-- Chỉ hiển thị nút khi đã đăng nhập -->
                <div v-else class="write-review-container">
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

      <!-- Form viết đánh giá - giữ nguyên -->
      <div v-if="showReviewForm" class="review-form-overlay">
        <ReviewForm 
          :bookId="bookId" 
          @close="showReviewForm = false"
          @submit-success="handleReviewSubmitted"
        />
      </div>
    </section>
</template>
  
<script>
import BookService from '@/services/BookService';
import AuthenticationService from '@/services/AuthenticationService';
import ReviewForm from './ReviewForm.vue'; 

export default {
    name: 'RatingSection',
    components: {
        ReviewForm
    },
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
            isLoggedIn: false,
            showReviewForm: false, // Biến để điều khiển hiển thị form viết đánh giá
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
                
                if (response && response.data && response.data.success && response.data.data) {
                    const data = response.data.data;
                    this.averageRating = data.averageRating || 0;
                    this.totalReviews = data.totalReviews || 0;
                    this.ratingStats = data.ratingStats || [];
                    this.reviews = data.reviews || [];
                } else {
                    this.error = 'Không thể tải dữ liệu đánh giá';
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
        
        // Phương thức mới tính phần trăm theo tổng số đánh giá
        getPercentage(star) {
            const item = this.ratingStats.find(r => r.rating === star);
            if (!item || this.totalReviews === 0) return 0;
            return (item.count / this.totalReviews) * 100;
        },
        
        // Phương thức cũ tính độ rộng thanh progress
        getProgressWidth(count) {
            if (!this.ratingStats.length) return '0%';
            
            // Tìm giá trị cao nhất trong ratingStats
            const maxCount = Math.max(...this.ratingStats.map(stat => stat.count), 1);
            
            // Tính phần trăm dựa trên giá trị cao nhất
            const percentage = (count / maxCount) * 100;
            return `${percentage}%`;
        },
        
        // Lấy số lượng đánh giá cho mỗi mức sao
        getRatingCount(star) {
            const statItem = this.ratingStats.find(item => item.rating === star);
            return statItem ? statItem.count : 0;
        },
        
        handleWriteReview() {
            // Vì đã kiểm tra isLoggedIn ở template, không cần kiểm tra lại ở đây
            this.showReviewForm = true; // Hiển thị form đánh giá
        },

        handleReviewSubmitted() {
            // Đóng form
            this.showReviewForm = false;
            
            // Cập nhật lại dữ liệu đánh giá
            this.fetchReviewData();
            
            // Thông báo thành công
            this.$emit('review-added');
        }
    }
};
</script>
  
<style scoped>
.rating-section {
    width: 85%;
    margin: 0 auto;
    padding: 20px 0;
    font-family: 'Montserrat', sans-serif;
}

.rating-title {
    color: #4D2900;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
}

.loading-message,
.error-message {
    text-align: center;
    padding: 20px;
    font-family: 'Raleway', sans-serif;
}

.error-message {
    color: #e53935;
}

.rating-container {
    margin-top: 20px;
}

.rating-layout {
    display: flex;
    gap: 20px;
}

@media (max-width: 991px) {
    .rating-layout {
        flex-direction: column;
        gap: 0px;
    }
}

/* Cột hiển thị đánh giá trung bình */
.rating-summary-column {
    width: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (max-width: 991px) {
    .rating-summary-column {
        width: 100%;
    }
}

.rating-summary {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.average-rating {
    color: #2E2E2E;
    font-size: 50px;
    font-weight: 700;
    margin: 0;
}

.star-total {
    display: flex;
    margin-top: 10px;
    gap: 5px;
}

.filled-star {
    color: #FFD700;
    font-size: 26px;
}

.empty-star {
    color: #D3D3D3;
    font-size: 26px;
}

.total-reviews {
    color: #000;
    font-size: 18px;
    font-weight: 600;
    margin-top: 10px;
}

/* Cột hiển thị chi tiết đánh giá */
.rating-details-column {
    width: 35%;
    margin-left: 15px;
}

@media (max-width: 991px) {
    .rating-details-column {
        width: 100%;
        margin-top: 20px;
    }
}

.rating-details {
    width: 100%;
}

.rating-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    gap: 15px;
}

.star-label-container {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.star-label {
    min-width: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    text-align: center;
}

.progress-container {
    flex: 1;
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: #4D2900;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.count-label {
    font-size: 16px;
    font-weight: 600;
    min-width: 30px;
    text-align: right;
}

/* Phần styling cho viết đánh giá - giữ nguyên */
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
    margin-top: 20px;
    flex-direction: column;
    align-items: stretch;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
}

.login-message {
    color: rgba(51, 51, 51, 1);
    font-size: 20px;
}

.write-review-container {
    border-radius: 10px;
    background-color: rgba(255, 250, 245, 1);
    border-color: #4D2900;
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
    color: #4D2900;
    justify-content: center;
}

@media (max-width: 991px) {
    .write-review-container {
        padding: 14px 20px;
    }
}

.write-review-button {
    display: flex;
    width: auto;
    max-width: 100%;
    align-items: center;
    gap: 6px;
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
    width: 20px;
    align-self: center;
    flex-shrink: 0;
}

.write-text {
    flex-grow: 1;
    flex-shrink: 1;
    width: auto;
    text-align: left;
    white-space: nowrap;
}

.review-form-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
</style>