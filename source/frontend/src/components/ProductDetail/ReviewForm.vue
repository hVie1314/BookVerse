<template>
    <div class="review-form-container">
      <div class="review-form">
        <h2 class="review-form-title">Viết đánh giá</h2>
        
        <div class="rating-input">
          <p class="rating-label">Đánh giá của bạn:</p>
          <div class="star-input">
            <i v-for="star in 5" :key="star" 
               :class="['fas fa-star', { 'selected': star <= rating }]"
               @click="setRating(star)"
               @mouseover="hoverRating = star"
               @mouseleave="hoverRating = 0"
               :style="{ color: star <= (hoverRating || rating) ? '#FFD700' : '#D3D3D3' }"
            ></i>
          </div>
        </div>
        
        <div class="comment-input">
          <p class="comment-label">Nhận xét của bạn:</p>
          <textarea 
            v-model="comment" 
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            rows="5"
          ></textarea>
          <p v-if="error" class="error-message">{{ error }}</p>
        </div>
        
        <div class="form-actions">
          <button class="cancel-button" @click="close">Hủy</button>
          <button 
            class="submit-button" 
            :disabled="loading || !isValidForm" 
            @click="submitReview"
          >
            {{ loading ? 'Đang gửi...' : 'Gửi đánh giá' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ReviewService from '@/services/ReviewService';
  import {useToast} from 'vue-toastification';
  
  export default {
    name: 'ReviewForm',
    props: {
      bookId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        rating: 0,
        hoverRating: 0,
        comment: '',
        loading: false,
        error: null
      };
    },
    setup() {
      const toast = useToast();
      return { toast };
    },
    computed: {
      isValidForm() {
        return this.rating > 0; // Ít nhất phải có rating
      }
    },
    methods: {
      setRating(value) {
        this.rating = value;
      },
      close() {
        this.$emit('close');
      },
      async submitReview() {
        if (!this.isValidForm) return;
        
        this.loading = true;
        this.error = null;
        
        try {
          const reviewData = {
            rating: this.rating,
            comment: this.comment
          };
          
          await ReviewService.addReview(this.bookId, reviewData);
          this.toast.success("Đã gửi đánh giá thành công!", {
            timeout: 1500,
            closeOnClick: true
          });

          this.$emit('submit-success');
          
        } catch (error) {
          console.error('Lỗi khi gửi đánh giá:', error);
          
          // Xử lý lỗi và hiển thị dưới form
          if (error.response) {
            if (error.response.status === 403) {
              // Nếu không thể kiểm tra thông qua message, chúng ta giả định rằng 
              // lỗi 403 khi đánh giá thường liên quan đến việc không mua sách
              this.error = 'Bạn phải mua sách thì mới có thể đánh giá được';
              // Các điều kiện khác giữ nguyên nếu cần
            } else {
              this.error = error.response.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau.';
            }
          } else {
            this.error = 'Lỗi kết nối. Vui lòng thử lại sau.';
          }
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .review-form-container {
    max-width: 600px;
    width: 90%;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  
  .review-form-title {
    color: #4D2900;
    font-size: 24px;
    font-family: Montserrat, sans-serif;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .rating-input, .comment-input {
    margin-bottom: 20px;
  }
  
  .rating-label, .comment-label {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .star-input {
    display: flex;
    gap: 5px;
  }
  
  .star-input i {
    font-size: 30px;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .cancel-button, .submit-button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
  }
  
  .cancel-button {
    background-color: #f1f1f1;
    color: #333;
  }
  
  .submit-button {
    background-color: #4D2900;
    color: white;
  }
  
  .submit-button:disabled {
    background-color: #a98e77;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #e53935;
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
    background-color: rgba(229, 57, 53, 0.1);
    padding: 8px 12px;
    border-radius: 4px;
    border-left: 3px solid #e53935;
  }
  </style>