<template>
    <article class="product-info">
      <div class="info-container">
        <div class="book-info">
          <h1 class="book-title">Thiên tài bên trái, kẻ điên bên phải</h1>
          <p class="book-author">Cao Minh</p>
          <p class="book-price">116.350 đ</p>
  
          <div class="sold-info">
            <p class="sold-detail-text">
              <span class="sold-label">Đã bán</span>
              <span class="sold-count">20</span>
            </p>
            <div class="progress-info-container">
              <div class="progress-bar"></div>
            </div>
          </div>
  
          <section class="description-section">
            <h2 class="description-title">Mô tả</h2>
            <p class="description-text">
              NẾU MỘT NGÀY ANH THẤY TÔI ĐIÊN, THỰC RA CHÍNH LÀ ANH ĐIÊN
              ĐẤY!<br />Hỡi những con người đang oằn mình trong cuộc sống,
              bạn biết gì về thế giới của mình? Là vô vàn thứ lý thuyết
              được các bậc vĩ nhân kiểm chứng, là luật lệ ...
            </p>
            <button class="read-more">Đọc thêm</button>
          </section>
  
          <div class="quantity-section">
            <p class="quantity-label">Số lượng</p>
            <div class="quantity-selector">
              <div class="decrement-button"></div>
              <span class="quantity-value">1</span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2b3e53de73fd963852263eb44cecf25179597046?placeholderIfAbsent=true"
                class="increment-button"
                alt="Increment quantity"
              />
            </div>
          </div>
        </div>
  
        <ProductActions />
      </div>
    </article>
</template>
  
<script>
    import ProductActions from './ProductActions.vue';
    
    export default {
        name: 'ProductInfo',
        components: {
        ProductActions
        }
    };
</script>
  
<style scoped>
    .product-info {
        margin-top: 10px; /* Giảm từ 14px */
        width: 100%;
    }

    @media (max-width: 991px) {
        .product-info {
            margin-top: 25px; /* Giảm từ 40px */
        }
    }

    
    .info-container {
        width: 100%;
    }
    
    @media (max-width: 991px) {
        .info-container {
        max-width: 100%;
        margin-right: 2px;
        }
    }
    
    .book-title {
        color: rgba(76, 41, 0, 1);
        font-size: 22px; /* Giảm từ 28px */
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        line-height: 1.3; /* Giảm từ 1.4 */
    }
    
    @media (max-width: 991px) {
        .book-title {
        max-width: 100%;
        }
    }
    
    .book-author {
        color: #828282;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 400;
        line-height: 1.3;
        letter-spacing: 0.2px;
        text-transform: uppercase;
        font-size: 14px; /* Giảm từ 16px */
        margin-top: 8px; /* Giảm từ 10px */
    }
    
    @media (max-width: 991px) {
        .book-author {
        max-width: 100%;
        }
    }
    
    .book-price {
        color: rgba(76, 41, 0, 1);
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-weight: 700;
        letter-spacing: 0.5px; /* Giảm từ 0.72px */
        font-size: 20px; /* Giảm từ 24px */
        margin-top: 8px; /* Giảm từ 10px */
    }
    
    .book-title, 
    .book-author, 
    .book-price {
        width: 100%;
    }
    @media (max-width: 991px) {
        .book-price {
        max-width: 100%;
        }
    }
    
    .sold-info {
        display: flex;
        margin-top: 15px; /* Giảm từ 22px */
        width: 100%;
        flex-direction: column;
        align-items: stretch;
    }
    
    .sold-detail-text {
        color: #333333;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 16px; /* Giảm từ 20px */
        font-weight: 700;
        line-height: 1.4;
        letter-spacing: 0.2px;
        align-self: flex-start;
    }
    
    .sold-label {
        color: rgba(130, 130, 130, 1);
    }
    
    .sold-count {
        color: rgba(76, 41, 0, 1);
    }
    
    .progress-info-container {
        width: 100%;
        border-radius: 5px;
        display: flex;
        margin-top: 10px;
        flex-direction: column;
        align-items: flex-start;
        background-color: #f2f2f2;
    }
    
    @media (max-width: 991px) {
        .progress-container {
        max-width: 100%;
        padding-right: 20px;
        }
    }
    
    .progress-bar {
        border-radius: 5px;
        background-color: rgba(76, 41, 0, 1);
        display: flex;
        flex-shrink: 0;
        height: 6px;
    }
    
    .description-section {
        display: flex;
        margin-top: 15px;
        width: 100%;
        padding-bottom: 8px;
        flex-direction: column;
        align-items: flex-start;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        color: rgba(76, 41, 0, 1);
    }
    
    .description-title {
        font-size: 16px; /* Giảm từ 22px */
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.22px;
    }
    
    .description-text {
        width: 100%;
        color: rgba(51, 51, 51, 1);
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 0.2px;
        align-self: stretch;
        font-size: 14px; /* Giảm từ 20px */
        line-height: 1.4; /* Giảm từ 28px */
        margin-top: 8px; /* Giảm từ 21px */
    }
    
    @media (max-width: 991px) {
        .description-text {
        max-width: 100%;
        }
    }
    
    .read-more {
        font-size: 15px;
        font-weight: 500;
        line-height: 2;
        letter-spacing: 0.18px;
        margin-top: 8px;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        text-align: left;
    }
    
    .quantity-section {
        display: flex;
        margin-top: 15px;
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        color: #333;
        font-weight: 700;
    }
    
    @media (max-width: 991px) {
        .quantity-section {
        max-width: 100%;
        }
    }
    
    .quantity-label {
        color: #333;
        font-size: 16px;
        line-height: 1.4;
        letter-spacing: 0.2px;
        align-self: flex-start;
    }
    
    .quantity-selector {
        width: 100%;
        border-radius: 8px;
        border: 1px solid var(--Gray-3, #828282);
        display: flex;
        margin-top: 12px;
        padding: 5px 15px;
        align-items: center;
        gap: 15px;
        font-size: 16px;
        white-space: nowrap;
        text-align: center;
        letter-spacing: 0.18px;
        line-height: 2;
        flex-wrap: wrap;
        justify-content: space-between;
        background-color: #fff;
    }
    
    @media (max-width: 991px) {
        .quantity-selector {
        max-width: 100%;
        padding-left: 20px;
        white-space: initial;
        }
    }
    
    .decrement-button {
        background-color: rgba(77, 41, 0, 1);
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        width: 5px;
        flex-shrink: 0;
        height: 2px;
        cursor: pointer;
    }
    
    .quantity-value {
        color: #333;
        align-self: flex-start;
    }
    
    .increment-button {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 27px;
        flex-shrink: 0;
        cursor: pointer;
    }
</style>