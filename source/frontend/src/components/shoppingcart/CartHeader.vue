<template>
    <header class="cart-header">
      <div class="header-content">
        <h1 class="main-title">Giỏ hàng của tôi</h1>
        <div class="information-container">
          <h2 class="product-label">Sản phẩm</h2>
          <h2 class="quantity-label">Số lượng</h2>
          <h2 class="price-label">Đơn giá</h2>
        </div>  
      </div>
    </header>
  </template>
    
<script>
  export default {
    name: "CartHeader",
  };
</script>
    
<style scoped>
    .cart-header {
      z-index: 10;
      width: 100%;
      display: flex;
    }
      
    .header-content {
      width: 100%; /* Thay đổi từ 62% thành 100% */
      display: flex;  
      flex-direction: column;
      gap: 30px; /* Giảm xuống từ 80px */
    }

    .main-title{
      color: rgba(77, 41, 0, 1);
      font-size: 36px;
      font-weight: 800;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    }
      
    .information-container {
      display: flex;
      margin-top: 20px;
      width: 100%;
      align-items: center;
    }

    .product-label {
      color: rgba(77, 41, 0, 1);
      font-size: 24px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-weight: 800;
      text-align: left;
      width: 60%; /* Tương ứng với product-info trong ProductCard */
    }
      
      
    .quantity-label {
      color: rgba(77, 41, 0, 1);
      font-size: 24px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-weight: 800;
      text-align: left;
      width: 20%; /* Tương ứng với quantity-controls trong ProductCard */
    }

      
    .price-label {
      color: rgba(77, 41, 0, 1);
      font-size: 24px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-weight: 800;
      text-align: right;
      width: 20%; /* Tương ứng với price-info trong ProductCard */
    }

    @media (max-width: 991px) {
      .information-container {
        display: none; /* Ẩn tiêu đề cột trên mobile */
      }
      
      .header-content {
        gap: 20px;
      }
      
      .main-title {
        font-size: 28px;
        text-align: center;
      }
    }
</style>