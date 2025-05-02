<template>
    <header class="cart-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">Giỏ hàng của tôi</h1>
          <h2 class="product-label">Sản phẩm</h2>
        </div>
        <div class="quantity-section">
          <h2 class="quantity-label">Số lượng</h2>
        </div>
      </div>
      <div class="price-section">
        <h2 class="price-label">Đơn giá</h2>
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
    justify-content: space-between;
    padding-bottom: 20px;
  }
    
  .header-content {
    display: flex;
    width: 78%;
  }
    
  .title-section {
    width: 76%;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    color: rgba(77, 41, 0, 1);
  }
    
  .main-title {
    font-size: 42px;
    font-weight: 600;
    margin-bottom: 40px;
  }
    
  .product-label {
    font-size: 24px;
    font-weight: 800;
    margin-top: 60px;
  }
    
  .quantity-section {
    width: 24%;
  }
    
  .quantity-label {
    color: rgba(77, 41, 0, 1);
    font-size: 24px;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 800;
    text-align: center;
    margin-top: 127px;
  }
    
  .price-section {
    width: 22%;
  }
    
  .price-label {
    color: rgba(77, 41, 0, 1);
    font-size: 24px;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 800;
    text-align: center;
    margin-top: 127px;
  }
    
  @media (max-width: 991px) {
    .cart-header {
      flex-direction: column;
    }
  
    .header-content {
      flex-direction: column;
      width: 100%;
    }
    
    .title-section,
    .quantity-section,
    .price-section {
      width: 100%;
    }
    
    .main-title {
      font-size: 32px;
      margin-bottom: 20px;
    }
    
    .product-label,
    .quantity-label,
    .price-label {
      margin-top: 20px;
      font-size: 20px;
      text-align: left;
    }
  }
  </style>