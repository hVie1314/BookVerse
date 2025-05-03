<template>
    <div class="page-container">
      <Nav />
      <main class="order-history-page">
        <div class="content-wrapper">
          <OrderCategoryTabs />
          <OrderSearchBar />
          <OrderItem
            status="pending"
            statusText="CHỜ THANH TOÁN"
            :products="[
              {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2f1fa8dbd4cffb62bed23faf6f8fa45d77916608?placeholderIfAbsent=true',
                title: 'Hoạt Động Trải Nghiệm, Hướng Nghiệp 11 - Bản 1 (Chân Trời Sáng Tạo) (Chuẩn)',
                author: 'Phạm hữu hi',
                quantity: 1,
                price: '99.000 đ'
              },
              {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/b4a7c3990fb38b36c00404a07d3cf1e4d310637a?placeholderIfAbsent=true',
                title: 'Doraemon - Tiểu Thuyết - Nobita Và Bản Giao Hưởng Địa Cầu',
                author: 'Phạm hữu hi',
                quantity: 1,
                price: '100.000 đ'
              }
            ]"
            total="199.000 đ"
            showActions
          />
          <OrderItem
            status="cancelled"
            statusText="ĐÃ HỦY"
            :products="[
              {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2f1fa8dbd4cffb62bed23faf6f8fa45d77916608?placeholderIfAbsent=true',
                title: 'Hoạt Động Trải Nghiệm, Hướng Nghiệp 11 - Bản 1 (Chân Trời Sáng Tạo) (Chuẩn)',
                author: 'Phạm hữu hi',
                quantity: 1,
                price: '99.000 đ'
              },
              {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/b4a7c3990fb38b36c00404a07d3cf1e4d310637a?placeholderIfAbsent=true',
                title: 'Doraemon - Tiểu Thuyết - Nobita Và Bản Giao Hưởng Địa Cầu',
                author: 'Phạm hữu hi',
                quantity: 1,
                price: '100.000 đ'
              }
            ]"
            total="199.000 đ"
            cancelMessage="Đã hủy bởi bạn"
          />
          <OrderItem
            status="completed"
            statusText="HOÀN THÀNH"
            :products="[
              {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2f1fa8dbd4cffb62bed23faf6f8fa45d77916608?placeholderIfAbsent=true',
                title: 'Hoạt Động Trải Nghiệm, Hướng Nghiệp 11 - Bản 1 (Chân Trời Sáng Tạo) (Chuẩn)',
                author: 'Phạm hữu hi',
                quantity: 1,
                price: '99.000 đ'
              },
              {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/b4a7c3990fb38b36c00404a07d3cf1e4d310637a?placeholderIfAbsent=true',
                title: 'Doraemon - Tiểu Thuyết - Nobita Và Bản Giao Hưởng Địa Cầu',
                author: 'Phạm hữu hi',
                quantity: 1,
                price: '100.000 đ'
              }
            ]"
            total="199.000 đ"
          />
        </div>
      </main>
      <footer-form />
    </div>
</template>
  
<script>
    import OrderCategoryTabs from './OrderCategoryTabs.vue';
    import OrderSearchBar from './OrderSearchBar.vue';
    import OrderItem from './OrderItem.vue';
    import Nav from "@/components/navbar/Nav.vue";
    import FooterForm from "@/components/footer/footer.vue";
    export default {
        name: 'OrderHistoryPage',
        components: {
            Nav,
            FooterForm,
            OrderCategoryTabs,
            OrderSearchBar,
            OrderItem
        }
    }
</script>

<style scoped>
.page-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    min-height: 100vh;
    background-color: #fffaf5;
}

.order-history-page {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    font-weight: 600;
    margin: 20px 0;
}

.content-wrapper {
    width: 83%; /* Giữ nguyên width 85% */
    margin: 0 auto;
}

/* Override component font sizes */
:deep(.order-category) {
    font-size: 20px !important;
    padding: 30px 60px 20px;
}

:deep(.search-placeholder) {
    font-size: 18px !important;
}

:deep(.order-status) {
    font-size: 20px !important;
}

:deep(.product-title) {
    font-size: 18px !important;
}

:deep(.product-author) {
    font-size: 16px !important;
}

:deep(.product-quantity),
:deep(.product-price) {
    font-size: 18px !important;
}

:deep(.total-label) {
    font-size: 16px !important;
}

:deep(.total-amount) {
    font-size: 32px !important;
}

:deep(.action-buttons) {
    font-size: 18px !important;
    width: auto !important;
}

:deep(.action-button) {
    padding: 14px 40px !important;
}

:deep(.cancel-message) {
    font-size: 18px !important;
}

@media (max-width: 991px) {
    .content-wrapper {
        width: 95%;
        padding: 0 10px;
    }
}
</style>