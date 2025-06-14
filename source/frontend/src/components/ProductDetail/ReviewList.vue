<template>
  <section class="reviews-list">
    <div v-if="loading" class="loading-message">
      <p>Đang tải đánh giá...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="formattedReviews.length === 0" class="no-reviews-message">
      <p>Chưa có đánh giá nào cho sản phẩm này</p>
    </div>

    <template v-else>
      <ReviewItem
        v-for="(review, index) in formattedReviews"
        :key="`review-${index}`"
        :review="review"
        @review-updated="updateReview"
        @visibility-changed="updateReviewVisibility"
        @review-deleted="fetchReviews"
      />
    </template>
  </section>
</template>

<script>
import ReviewItem from './ReviewItem.vue';
import ReviewService from '@/services/ReviewService';

export default {
  name: 'ReviewList',

  components: {
    ReviewItem,
  },

  props: {
    reviews: {
      type: Array,
      default: () => [],
    },
    bookId: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      loading: false,
      error: null,
      fetchedReviews: [],
    };
  },

  computed: {
    formattedReviews() {
      // Ưu tiên dùng reviews từ props
      if (this.reviews && this.reviews.length > 0) {
        return this.reviews.map((review) => ({
          id: review._id,
          name: review.user?.username || 'Người dùng',
          avatar:
            review.user?.avatar ||
            'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/9c21ecc8fd12f4309a9c06c3afa851e5571e1b4b?placeholderIfAbsent=true',
          date: this.formatDate(review.createdAt || review.create_at),
          rating: review.rating,
          content: review.comment || review.content || '',
          likes: review.likes || 0,
          dislikes: review.dislikes || 0,
          userId: review.user?._id || 'null',
        }));
      }

      // Nếu không có reviews từ props, dùng fetchedReviews
      return this.fetchedReviews;
    },
  },

  created() {
    if (this.bookId) {
      console.log('Luôn gọi fetchReviews khi có bookId:', this.bookId);
      console.log('Reviews từ props:', this.reviews);
      this.fetchReviews();
    }

    if ((!this.reviews || this.reviews.length === 0) && this.bookId) {
      this.fetchReviews();
    }
  },

  methods: {
    async fetchReviews() {
      this.loading = true;
      this.error = null;

      try {
        const response = await ReviewService.getAllReviews(this.bookId);
        console.log('API response:', response.data);

        // Xử lý dữ liệu từ API
        let reviews = [];
        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.reviews
        ) {
          reviews = response.data.data.reviews;
        } else if (
          response.data &&
          response.data.success &&
          Array.isArray(response.data.data)
        ) {
          reviews = response.data.data;
        }

        console.log('Đánh giá đã lấy:', reviews);

        // Format lại dữ liệu để dùng cho ReviewItem
        this.fetchedReviews = reviews.map((review) => ({
          id: review._id,
          name:
            review.user?.username ||
            review.username ||
            review.userId?.username ||
            'Người dùng ẩn danh',
          avatar:
            review.user?.avatar ||
            review.avatar ||
            review.userId?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              review.user?.username || 'User'
            )}&background=4d2900&color=fff`,
          date: this.formatDate(review.create_at || review.createdAt),
          rating: review.rating,
          content: review.comment || review.content || '',
          likes: review.likes || 0,
          dislikes: review.dislikes || 0,
          userId: review.userId || 'null',
        }));
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
        this.error = 'Không thể tải đánh giá. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Không rõ thời gian';

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600)
          return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400)
          return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 2592000)
          return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      } catch (e) {
        return dateString;
      }
    },

    updateReview(updatedReview) {
      const index = this.formattedReviews.findIndex(
        (review) => review.id === updatedReview.id
      );
      if (index !== -1) {
        this.formattedReviews[index] = {
          ...this.formattedReviews[index],
          ...updatedReview,
        };
      }
    },

    updateReviewVisibility(data) {
      const index = this.formattedReviews.findIndex(
        (review) => review.id === data.id
      );
      if (index !== -1) {
        this.formattedReviews[index] = {
          ...this.formattedReviews[index],
          hidden: data.hidden,
        };
      }
    },
  },
};
</script>

<style scoped>
.reviews-list {
  display: flex;
  flex-direction: column;
  width: 85%;
}

.loading-message,
.error-message,
.no-reviews-message {
  padding: 20px;
  text-align: center;
  font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
}

.error-message {
  color: #e53935;
}

.no-reviews-message {
  color: #757575;
  font-style: italic;
}
</style>