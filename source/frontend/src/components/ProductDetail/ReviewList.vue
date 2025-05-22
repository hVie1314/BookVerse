<template>
  <section class="reviews-list">
    <div v-if="loading" class="loading-message">
      <p>Đang tải đánh giá...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- Sửa đổi này: Kiểm tra filteredReviews thay vì formattedReviews -->
    <div v-else-if="filteredReviews.length === 0" class="no-reviews-message">
      <p>Chưa có đánh giá nào cho sản phẩm này</p>
    </div>
    
    <template v-else>
      <ReviewItem
        v-for="(review, index) in filteredReviews"
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
  import AuthenticationService from '@/services/AuthenticationService';
  
  export default {
    name: 'ReviewList',
    components: {
      ReviewItem
    },
    props: {
      reviews: {
        type: Array,
        default: () => []
      },
      bookId: {
        type: String,
        default: ''
      },
      hideHiddenReviews: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        loading: false,
        error: null,
        fetchedReviews: [],
        currentUser: null // Thêm biến này để lưu thông tin người dùng hiện tại
      };
    },
    computed: {
      formattedReviews() {
        // Phần code hiện tại giữ nguyên
        const currentUser = this.currentUser || {};
        const isStaff = currentUser.role === 'staff' || currentUser.role === 'admin';
        
        if (this.reviews && this.reviews.length > 0) {
          const filteredReviews = isStaff 
            ? this.reviews 
            : this.reviews.filter(review => !review.hidden);
          
          return filteredReviews.map(review => ({
            ...review,
            hidden: review.hidden || false,
            isHidden: review.hidden || false
          }));
        }
        
        const filteredReviews = isStaff 
          ? this.fetchedReviews 
          : this.fetchedReviews.filter(review => !review.hidden);
        
        return filteredReviews;
      },

      filteredReviews() {
      // Nếu prop hideHiddenReviews = true, không hiển thị đánh giá đã ẩn
        if (this.hideHiddenReviews) {
          return this.formattedReviews.filter(review => !review.hidden);
        }
        
        // Nếu không có yêu cầu đặc biệt, trả về formattedReviews như trước
        return this.formattedReviews;
      }
    },

    created() {
      // Nếu không có reviews từ props và có bookId, thì fetch từ API
      if (AuthenticationService.isLoggedIn()) {
        this.currentUser = AuthenticationService.getCurrentUser();
      }
      if (this.bookId) {
        console.log("Luôn gọi fetchReviews khi có bookId:", this.bookId);
        // In ra reviews từ props để kiểm tra
        console.log("Reviews từ props:", this.reviews);
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
        
        // Truy cập đúng vào dữ liệu reviews
        let reviews = [];
        if (response.data && response.data.success && response.data.data && response.data.data.reviews) {
            reviews = response.data.data.reviews;
        } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
            reviews = response.data.data;
        }
        
        console.log('Đánh giá đã lấy:', reviews);
        
        // Format reviews thành định dạng mà ReviewItem component cần
        this.fetchedReviews = reviews.map(review => ({
            id: review._id,
            // Lấy tên người dùng từ dữ liệu review
            name: review.user?.username || review.username || review.userId?.username || 'Người dùng ẩn danh',
            // Lấy avatar từ dữ liệu review
            avatar: review.user?.avatar || review.avatar || review.userId?.avatar || 
                   `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.username || 'User')}&background=4d2900&color=fff`,
            date: this.formatDate(review.create_at || review.createdAt),
            rating: review.rating,
            content: review.comment || review.content || '',
            likes: review.likes || 0,
            dislikes: review.dislikes || 0,
            userId: review.userId || "null",
            hidden: review.hidden || false,
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
        
        // Nếu là chuỗi ngày hợp lệ, định dạng nó
        try {
          const date = new Date(dateString);
          
          // Kiểm tra xem có phải Date hợp lệ không
          if (isNaN(date.getTime())) {
            return dateString; // Trả về nguyên gốc nếu không phải date hợp lệ
          }
          
          // Tính thời gian đã trôi qua
          const now = new Date();
          const diffInSeconds = Math.floor((now - date) / 1000);
          
          if (diffInSeconds < 60) {
            return 'Vừa xong';
          } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
          } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
          } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
          } else {
            // Định dạng dd/mm/yyyy
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          }
        } catch (e) {
          return dateString; // Trả về nguyên gốc nếu có lỗi
        }
      },
      updateReview(updatedReview) {
        const index = this.formattedReviews.findIndex(review => review.id === updatedReview.id);
        if (index !== -1) {
          this.formattedReviews[index] = {
            ...this.formattedReviews[index],
            ...updatedReview
          };
        }
      },
      updateReviewVisibility(data) {
        const index = this.formattedReviews.findIndex(review => review.id === data.id);
        if (index !== -1) {
          this.formattedReviews[index] = {
            ...this.formattedReviews[index],
            hidden: data.hidden
          };
        }
      }
    }
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