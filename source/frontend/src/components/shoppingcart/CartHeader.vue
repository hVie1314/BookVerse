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
      width: 62%;
      display: flex;  
      flex-direction: column;
      gap: 80px;
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
    }

    .product-label {
      color: rgba(77, 41, 0, 1);
      font-size: 24px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-weight: 800;
      text-align: left;
      width: 47%;
    }
      
      
    .quantity-label {
      color: rgba(77, 41, 0, 1);
      font-size: 24px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-weight: 800;
      text-align: left;
      width: 30%;
    }

      
    .price-label {
      color: rgba(77, 41, 0, 1);
      font-size: 24px;
      font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
      font-weight: 800;
      text-align: center;
    }

</style>