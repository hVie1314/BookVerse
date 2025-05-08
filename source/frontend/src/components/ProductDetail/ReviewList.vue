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
        />
      </template>
    </section>
  </template>
  
  <script>
  import ReviewItem from './ReviewItem.vue';
  import ReviewService from '@/services/ReviewService';
//   import AuthenticationService from '@/services/AuthenticationService';
  
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
      }
    },
    data() {
      return {
        loading: false,
        error: null,
        fetchedReviews: []
      };
    },
    computed: {
      formattedReviews() {
          // Nếu có reviews từ props, sử dụng chúng
          if (this.reviews && this.reviews.length > 0) {
            return this.reviews.map(review => ({
              id: review._id,
              name: review.user?.username || 'Người dùng',
              avatar: review.user?.avatar || 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/9c21ecc8fd12f4309a9c06c3afa851e5571e1b4b?placeholderIfAbsent=true',
              date: this.formatDate(review.createdAt || review.create_at),
              rating: review.rating,
              content: review.comment || review.content || '',
              likes: review.likes || 0,
              dislikes: review.dislikes || 0
            }));
          }
          
          // Sử dụng fetchedReviews nếu không có reviews từ props
          return this.fetchedReviews;
        }
      },
    created() {
      // Nếu không có reviews từ props và có bookId, thì fetch từ API
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
            name: 'Người dùng',
            avatar: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/9c21ecc8fd12f4309a9c06c3afa851e5571e1b4b?placeholderIfAbsent=true',
            date: this.formatDate(review.create_at || review.createdAt),
            rating: review.rating,
            content: review.comment || review.content || '',
            likes: 0,
            dislikes: 0
        }));
        
        console.log('fetchedReviews sau khi format:', this.fetchedReviews);
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