<template>
  <section class="reviews-section">
    <header class="reviews-header">
      <h2 class="reviews-title">Đánh giá</h2>
      <p class="reviews-count">({{ reviewCount }} đánh giá)</p>
    </header>

    <div class="reviews-content">
      <div class="rating-summary">
        <div class="average-rating">
          <p class="rating-number">{{ rating }}/5</p>
          <StarRating :rating="5" :size="40" />
        </div>

        <div class="rating-distribution">
          <RatingBar
            v-for="item in ratingDistribution"
            :key="item.stars"
            :stars="item.stars"
            :count="item.count"
            :maxCount="getMaxCount()"
          />
        </div>
      </div>

      <div class="reviews-list">
        <ReviewItem
          v-for="(review, index) in reviews"
          :key="index"
          :avatar="review.avatar"
          :name="review.name"
          :date="review.date"
          :rating="review.rating"
          :comment="review.comment"
          :likes="review.likes"
          :dislikes="review.dislikes"
        />
      </div>
    </div>
  </section>
</template>

<script>
import StarRating from './StarRating.vue';
import RatingBar from './RatingBar.vue';
import ReviewItem from './ReviewItem.vue';

export default {
  name: 'ProductReviewsSection',
  components: {
    StarRating,
    RatingBar,
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
  methods: {
    getMaxCount() {
      return Math.max(...this.ratingDistribution.map(item => item.count));
    }
  }
}
</script>

<style scoped>
.reviews-section {
  margin-top: 40px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reviews-title {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 30px;
  font-weight: 700;
  margin: 0;
}

.reviews-count {
  color: #000000;
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.reviews-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.rating-summary {
  display: flex;
  gap: 40px;
}

.average-rating {
  display: flex;
  flex-direction: column;
}

.rating-number {
  color: #2e2e2e;
  font-family: Montserrat, sans-serif;
  font-size: 80px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.rating-distribution {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.reviews-list {
  margin-top: 40px;
}
</style>
