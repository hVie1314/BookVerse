<!-- filepath: d:\Workspace\Software-engineering\project\BookVerse\source\frontend\src\components\staffpage\productedit\ProductReviewsSection.vue -->
<template>
  <section class="rating-section">
    <h2 class="rating-title">Đánh giá</h2>

    <div class="rating-container">
      <div class="rating-layout">
        <!-- Cột tóm tắt đánh giá -->
        <div class="rating-summary-column">
          <div class="rating-summary">
            <p class="average-rating">{{ rating.toFixed(1) }}/5</p>
            <div class="star-total">
              <i v-for="index in 5" 
                 :key="`total-star-${index}`" 
                 :class="[
                   index <= Math.floor(rating) ? 'fas fa-star filled-star' : 'far fa-star empty-star'
                 ]"
              ></i>
            </div>
            <p class="total-reviews">{{ reviewCount }} đánh giá</p>
          </div>
        </div>

        <!-- Cột chi tiết theo số sao -->
        <div class="rating-details-column">
          <div class="rating-details">
            <div class="rating-row" v-for="star in 5" :key="`star-${star}`">
              <div class="star-label-container">
                <span class="star-label">{{ star }}</span>
                <div class="progress-container">
                  <div 
                    class="progress-bar" 
                    :style="`width: ${getPercentage(star)}%`">
                  </div>
                </div>
              </div>
              <span class="count-label">{{ getStarCount(star) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách đánh giá -->
      <div class="reviews-list">
        <!-- Thêm điều kiện kiểm tra khi không có đánh giá -->
        <div v-if="!hasValidReviews" class="no-reviews-message">
          <p>Chưa có đánh giá nào cho sản phẩm này</p>
        </div>
        
        <!-- Chỉ hiển thị ReviewItem khi có đánh giá hợp lệ -->
        <template v-else>
          <ReviewItem
            v-for="(review, index) in validReviews"
            :key="index"
            :avatar="review.avatar || 'https://ui-avatars.com/api/?name=User&background=4d2900&color=fff'"
            :name="review.name || 'Người dùng'"
            :date="review.date || 'Không xác định'"
            :rating="review.rating || 5"
            :comment="review.comment || ''"
            :likes="review.likes || 0"
            :dislikes="review.dislikes || 0"
          />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
// import StarRating from './StarRating.vue';
import ReviewItem from './ReviewItem.vue';

export default {
  name: 'ProductReviewsSection',
  components: {
    ReviewItem
  },
  props: {
    rating: {
      type: Number,
      required: true
    },
    reviewCount: {
      type: Number,
      required: true
    },
    ratingDistribution: {
      type: Array,
      required: true
    },
    reviews: {
      type: Array,
      required: true
    }
  },
  computed: {
  hasValidReviews() {
    return this.reviews && this.reviews.length > 0;
  },
  formattedReviews() {
    if (!this.reviews) return [];
    return this.reviews.map(review => ({
      avatar: review.user?.avatar || 'https://ui-avatars.com/api/?name=User&background=4d2900&color=fff',
      name: review.user?.username || 'Người dùng',
      date: this.formatDate(review.createdAt),
      rating: review.rating,
      comment: review.comment || '',
      likes: review.likes || 0,
      dislikes: review.dislikes || 0
    }));
  }
},
  methods: {
    getMaxCount() {
      if (!this.ratingDistribution || this.ratingDistribution.length === 0) return 1;
      return Math.max(...this.ratingDistribution.map(item => item.count || 0), 1);
    },
    getStarCount(star) {
      const item = this.ratingDistribution.find(r => r.stars === star);
      return item ? item.count : 0;
    },
    getPercentage(star) {
      const item = this.ratingDistribution.find(r => r.stars === star);
      if (!item || this.reviewCount === 0) return 0;
      
      // Tính phần trăm dựa trên tổng số đánh giá
      return (item.count / this.reviewCount) * 100;
    }
  }
}
</script>

<style scoped>
.rating-section {
  width: 100%;
  margin: 40px 0;
  padding: 20px 0;
  font-family: 'Montserrat', sans-serif;
}

.rating-title {
  color: #4D2900;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.rating-container {
  margin-top: 20px;
}

.rating-layout {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

/* Cột hiển thị đánh giá trung bình */
.rating-summary-column {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  line-height: 1;
}

.star-total {
  display: flex;
  margin-top: 10px;
  gap: 5px;
}

.filled-star {
  color: #FFD700;
  font-size: 24px;
}

.empty-star {
  color: #D3D3D3;
  font-size: 24px;
}

.total-reviews {
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin-top: 10px;
}

/* Cột hiển thị chi tiết đánh giá */
.rating-details-column {
  width: 40%;
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
  background-color: #FFD700;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.count-label {
  font-size: 16px;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

/* Phần danh sách đánh giá */
.reviews-list {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

/* Responsive */
@media (max-width: 991px) {
  .rating-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .rating-summary-column,
  .rating-details-column {
    width: 100%;
  }
}

.no-reviews-message {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
}

.no-reviews-message p {
  color: #666;
  font-style: italic;
  margin: 0;
}
</style>