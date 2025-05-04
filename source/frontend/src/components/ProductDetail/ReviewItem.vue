<template>
    <article class="review-item">
      <img
        :src="review.avatar"
        class="reviewer-avatar"
        alt="Reviewer avatar"
      />
      <div class="review-content">
        <div class="reviewer-info">
          <h3 class="reviewer-name">{{ review.name }}</h3>
          <span class="review-date">{{ review.date }}</span>
        </div>
  
        <div class="review-details">
          <div class="star-rating">
            <img
              v-for="star in 5"
              :key="`star-${star}`"
              :src="star <= review.rating ? 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/b14ee1ef52e02a8d5f8aad06157d02ea0f835a9a?placeholderIfAbsent=true' : 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/244b0e75a1832a0226e3b419e9ebc0a50e647627?placeholderIfAbsent=true'"
              class="rating-star"
              alt="Rating star"
            />
          </div>
  
          <p class="review-text">
            {{ review.content }}
          </p>
  
          <button class="read-more-button">Đọc thêm</button>
        </div>
  
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
        }
    };
</script>
  
<style scoped>
    .review-item {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    
    .reviewer-avatar {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 40px;
        border-radius: 20px;
        align-self: flex-start;
        flex-shrink: 0;
        float: left;
        margin-right: 11px;
    }
    
    .review-content {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 0;
        width: fit-content;
        margin-top: 133px;
        margin-right: 11px;
    }
    
    @media (max-width: 991px) {
        .review-content {
        max-width: 100%;
        margin-right: 10px;
        margin-top: 40px;
        }
    }
    
    .reviewer-info {
        align-self: flex-start;
        display: flex;
        align-items: stretch;
        gap: 14px;
        font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 16px;
        font-weight: 700;
    }
    
    .reviewer-name {
        color: rgba(0, 0, 0, 1);
        flex-grow: 1;
        font-size: 14px; /* Giảm từ 16px */
        margin: 0;
    }
    
    .review-date {
        color: rgba(217, 217, 217, 1);
    }
    
    .review-details {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
    }
    
    @media (max-width: 991px) {
        .review-details {
        max-width: 100%;
        }
    }
    
    .star-rating {
        align-self: flex-start;
        display: flex;
        align-items: center;
        gap: 4px;
        justify-content: flex-start;
    }
    
    .rating-star {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 15px;
        align-self: stretch;
        margin: auto 0;
        flex-shrink: 0;
    }
    
    .review-text {
        color: rgba(0, 0, 0, 1);
        font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        font-size: 14px; /* Giảm từ 16px */
        margin-top: 5px; /* Giảm từ 8px */
    }
    
    @media (max-width: 991px) {
        .review-text {
        max-width: 100%;
        }
    }
    
    .read-more-button {
        color: rgba(76, 41, 0, 1);
        font-size: 18px;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 500;
        line-height: 2;
        letter-spacing: 0.18px;
        margin-top: 8px;
        background: none;
        border: none;
        padding: 0;
        text-align: left;
        cursor: pointer;
        align-self: flex-start;
    }
    
    @media (max-width: 991px) {
        .read-more-button {
        max-width: 100%;
        }
    }
    
    .review-actions {
        align-self: flex-start;
        display: flex;
        margin-top: 19px;
        margin-left: 59px;
        align-items: center;
        gap: 14px;
        font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 16px;
        color: rgba(0, 0, 0, 1);
        font-weight: 700;
        white-space: nowrap;
        justify-content: flex-start;
    }
    
    @media (max-width: 991px) {
        .review-actions {
        margin-left: 10px;
        white-space: initial;
        }
    }
    
    .reply-button {
        color: rgba(217, 217, 217, 1);
        align-self: stretch;
        margin: auto 0;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
    }
    
    .like-container {
        align-self: stretch;
        display: flex;
        margin: auto 0;
        align-items: center;
        gap: 3px;
        justify-content: flex-start;
    }
    
    @media (max-width: 991px) {
        .like-container {
        white-space: initial;
        }
    }
    
    .like-icon {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 20px;
        align-self: stretch;
        margin: auto 0;
        flex-shrink: 0;
    }
    
    .like-count {
        align-self: stretch;
        margin: auto 0;
    }
    
    .dislike-container {
        align-self: stretch;
        display: flex;
        margin: auto 0;
        align-items: center;
        gap: 9px;
        justify-content: flex-start;
    }
    
    @media (max-width: 991px) {
        .dislike-container {
        white-space: initial;
        }
    }
    
    .dislike-icon {
        transform: rotate(3.141592653589793rad);
        align-self: stretch;
        display: flex;
        min-height: 20px;
        margin: auto 0;
        gap: 10px;
    }
    
    .dislike-count {
        align-self: stretch;
        margin: auto 0;
        width: 8px;
    }
    
    .divider {
        aspect-ratio: 250;
        object-fit: contain;
        object-position: center;
        width: 100%;
        align-self: center;
        margin-top: 18px;
        margin-left: 10px;
        max-width: 1340px;
    }
    
    @media (max-width: 991px) {
        .divider {
        max-width: 100%;
        }
    }
</style>