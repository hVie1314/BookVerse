<template>
    <nav class="order-category">
      <div class="category-item">
        <h2 class="category-text">Tất cả</h2>
        <div class="category-underline"></div>
      </div>
      <h2 class="category-text pending">Chờ thanh toán</h2>
      <h2 class="category-text completed">Hoàn thành</h2>
      <h2 class="category-text cancelled">Đã hủy</h2>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'OrderCategoryTabs'
  }
  </script>
  
<style scoped>
    .order-category {
        background-color: #ffffff;
        border: 1px solid #847777;
        display: flex;
        width: 100%; /* Thay đổi từ 1347px */
        max-width: 100%;
        padding: 6px 40px 6px; /* Giảm từ 41px 80px 24px */
        align-items: center; 
        gap: 40px; /* Giảm từ 40px 100px */
        font-size: 18px; /* Giảm từ 25px */
        color: #4d2900;
        text-align: center;
    }

    .category-text {
        flex-grow: 1;
        flex-shrink: 1;
        font-size: inherit;
        margin: 0;
        line-height: 1.2;
    }

    .category-underline {
        border: 1px solid #4d2900;
        margin-top: 6px; /* Giảm từ 18px */
        height: 1px;
    }

    .pending {
        width: 140px; /* Giảm từ 183px */
    }

    .completed {
        width: 100px; /* Giảm từ 134px */
    }

    .cancelled {
        width: 80px; /* Giảm từ 109px */
    }

    @media (max-width: 991px) {
        .order-category {
            margin-right: 7px;
            padding: 41px 20px 24px;
        }
    }
</style>