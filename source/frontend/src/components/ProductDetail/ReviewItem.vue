<template>
    <article class="review-item">
      <!-- Header chứa avatar và thông tin người dùng -->
      <div class="review-header">
        <!-- Avatar -->
        <div class="avatar-container">
          <img
            :src="review.avatar"
            class="reviewer-avatar"
            alt="Reviewer avatar"
            @error="handleAvatarError"
          />
        </div>
        
        <!-- Thông tin người dùng -->
        <div class="reviewer-info-container">
          <!-- Hàng 1: Tên và thời gian -->
          <div class="reviewer-info-row">
            <h3 class="reviewer-name">{{ review.name }}</h3>
            <span class="review-date">{{ review.date }}</span>
          </div>
          
          <!-- Hàng 2: Đánh giá sao -->
          <div class="star-rating">
            <i v-for="index in 5" :key="index" 
              :class="[index <= review.rating ? 'fas fa-star filled-star' : 'far fa-star empty-star']">
            </i>
          </div>
        </div>
      </div>
  
      <!-- Nội dung đánh giá -->
      <div class="review-content">
        <p class="review-text">{{ displayContent }}</p>
        
        <button class="read-more-button" v-if="isLongContent" @click="toggleExpandContent">
          {{ expanded ? 'Thu gọn' : 'Đọc thêm' }}
        </button>
      </div>
  
      <!-- Các nút tương tác -->
      <div class="review-actions">
        <button class="reply-button">Reply</button>
  
        <div class="like-container">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/46c6c4363e26327da7eca6cb690eed8fb44c85b5?placeholderIfAbsent=true"
            class="like-icon"
            alt="Like icon"
          />
          <span class="like-count">{{ review.likes }}</span>
        </div>
  
        <div class="dislike-container">
          <div class="dislike-icon"></div>
          <span class="dislike-count">{{ review.dislikes }}</span>
        </div>
      </div>
  
      <img
        src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/32244c8306a6f69c324168528b78d17c211378d7?placeholderIfAbsent=true"
        class="divider"
        alt="Divider"
      />
    </article>
</template>
  
<script>
    export default {
        name: 'ReviewItem',
        props: {
            review: {
            type: Object,
            required: true
            }
        },
        data() {
            return {
            expanded: false
            };
        },
        computed: {
            isLongContent() {
                // Kiểm tra cả content và comment
                const reviewText = this.review.content || this.review.comment || '';
                return reviewText.length > 200;
            },
            displayContent() {
                const reviewText = this.review.content || this.review.comment || '';
                if (!reviewText) return 'Không có nội dung đánh giá';
                
                return this.expanded || !this.isLongContent 
                    ? reviewText 
                    : reviewText.substring(0, 200) + '...';
            }
        },
        methods: {
            toggleExpandContent() {
            this.expanded = !this.expanded;
            },
            handleAvatarError(e) {
    // Thay thế bằng avatar mặc định khi ảnh lỗi
    e.target.src = 'https://ui-avatars.com/api/?name=' + 
      encodeURIComponent(this.review.name) + '&background=4d2900&color=fff';
  }
        }
        };
</script>
  
<style scoped>
  .review-item {
    border: 1px solid #f0f0f0;
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 8px;
    background-color: rgb(244, 235, 225);
  }
  
  /* Header chứa avatar và thông tin người dùng */
  .review-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
  }
  
  .avatar-container {
    flex-shrink: 0;
    margin-right: 15px;
  }
  
  .reviewer-avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    display: block;
  }
  
  /* Container chứa thông tin người dùng (tên, thời gian, rating) */
  .reviewer-info-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  /* Hàng 1: Tên và thời gian */
  .reviewer-info-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
  }
  
  .reviewer-name {
    color: rgba(0, 0, 0, 1);
    font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin: 0;
  }
  
  .review-date {
    color: rgb(159, 155, 155);
    font-size: 12px;
  }
  
  /* Hàng 2: Đánh giá sao */
  .star-rating {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .filled-star {
    color: #FFD700; /* Màu vàng */
  }

  .empty-star {
    color: #D3D3D3; /* Màu xám nhạt */
  }
  
  /* Phần nội dung đánh giá */
  .review-content {
    margin-left: 65px; /* Căn lề trái bằng với width avatar + margin */
    margin-bottom: 15px;
  }
  
  .review-text {
    color: rgba(0, 0, 0, 1);
    font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 5px;
  }
  
  .read-more-button {
    color: rgba(76, 41, 0, 1);
    font-size: 14px;
    font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 500;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: block;
    margin-top: 5px;
  }
  
  /* Phần actions */
  .review-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-left: 65px; /* Căn lề trái bằng với width avatar + margin */
    margin-top: 10px;
  }
  
  .reply-button {
    color: rgba(217, 217, 217, 1);
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
  }
  
  .like-container, .dislike-container {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  
  .like-icon {
    width: 20px;
    object-fit: contain;
  }
  
  .divider {
    width: 100%;
    margin-top: 18px;
  }
  
  /* Media queries */
  @media (max-width: 991px) {
    .review-content, .review-actions {
      margin-left: 0;
    }
    
    .review-header {
      flex-direction: column;
    }
    
    .avatar-container {
      margin-bottom: 10px;
    }
  }
</style>