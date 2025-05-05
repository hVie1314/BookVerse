<template>
  <div class="payment-callback">
    <Nav />
    <div class="container">
      <div v-if="loading" class="loading">
        <p>Đang xác thực thanh toán...</p>
      </div>
      <div v-else class="result-container">
        <div class="icon-container" :class="isSuccess ? 'success' : 'failed'">
          <i v-if="isSuccess" class="fa-light fa-circle-check success-icon"></i>
          <i v-else class="fa-solid fa-circle-xmark error-icon"></i>
        </div>
        <h1>{{ isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại' }}</h1>
        <p>{{ statusMessage }}</p>
        
        <!-- Thêm dòng hiển thị thời gian tự động chuyển hướng -->
        <p v-if="isSuccess && countdown > 0" class="redirect-info">
          Tự động chuyển đến trang đơn hàng trong {{ countdown }} giây...
        </p>
        
        <div class="button-container">
          <button @click="goToOrders" class="primary-button">Xem đơn hàng của tôi</button>
          <button @click="goToHome" class="secondary-button">Tiếp tục mua sắm</button>
        </div>
      </div>
    </div>
    <footer-form />
  </div>
</template>
  
  <script>
  import Nav from "@/components/navbar/Nav.vue";
  import FooterForm from "@/components/footer/footer.vue";
  import OrderService from '@/services/OrderService';
//   import eventBus from '@/eventBus.js';
  
export default {
  name: 'PaymentCallback',
  components: {
    Nav,
    FooterForm
  },
  data() {
    return {
      loading: true,
      isSuccess: false,
      statusMessage: '',
      orderId: '',
      countdown: 5 // Giảm thời gian chờ xuống 5 giây
    };
  },
  async created() {
      // Lấy tất cả tham số từ URL
      const params = new URLSearchParams(window.location.search);
      const paramsObject = {};
      
      // Chuyển đổi URLSearchParams thành object
      for (const [key, value] of params.entries()) {
          paramsObject[key] = value;
      }
      
      try {
          // Gọi API xử lý callback
          const response = await OrderService.handleMomoCallback(paramsObject);
          console.log('Kết quả xử lý callback:', response.data);
          
          // Xác định trạng thái thanh toán
          this.isSuccess = response.data && response.data.updatedOrder && 
                          response.data.updatedOrder.orderStatus === 'success';
          
          this.statusMessage = this.isSuccess 
              ? 'Thanh toán đã được xác nhận, đơn hàng của bạn sẽ sớm được giao.' 
              : 'Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
          
          // Tự động chuyển hướng đến trang đơn hàng sau khi thành công
          if (this.isSuccess) {
              setTimeout(() => {
                  this.$router.push('/my-orders');
              }, this.countdown * 1000);
          }
      } catch (error) {
          console.error('Lỗi khi xử lý callback:', error);
          
          // Fallback dùng resultCode từ URL nếu API gặp lỗi
          const resultCode = params.get('resultCode');
          if (resultCode) {
              this.isSuccess = resultCode === '0';
              this.statusMessage = this.isSuccess
                  ? 'Thanh toán thành công theo thông tin từ MoMo.'
                  : 'Thanh toán không thành công theo thông tin từ MoMo.';
                  
              if (this.isSuccess) {
                  setTimeout(() => {
                      this.$router.push('/my-orders');
                  }, this.countdown * 1000);
              }
          }
      } finally {
          this.loading = false;
      }
  },
  methods: {
    goToOrders() {
      this.$router.push('/my-orders');
    },
    goToHome() {
      this.$router.push('/');
    }
  }
}
  </script>
  
  <style scoped>
  .payment-callback {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fffaf5;
  }
  
  .container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 50px 0;
  }
  
  .loading {
    font-size: 18px;
    color: #4d2900;
  }
  
  .result-container {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 40px;
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .icon-container {
    margin-bottom: 20px;
    font-size: 80px;
  }
  
  .success-icon {
    color: #4CAF50;
  }
  
  .error-icon {
    color: #F44336;
  }
  
  h1 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
    margin-bottom: 15px;
    color: #4d2900;
  }
  
  p {
    font-family: 'Montserrat', sans-serif;
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 1.6;
  }
  
  .button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .primary-button, .secondary-button {
    padding: 12px 20px;
    border-radius: 5px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    width: 100%;
  }
  
  .primary-button {
    background-color: #4d2900;
    color: white;
  }
  
  .primary-button:hover {
    background-color: #755e47;
  }
  
  .secondary-button {
    background-color: #f5f5f5;
    color: #4d2900;
    border: 1px solid #ddd;
  }
  
  .secondary-button:hover {
    background-color: #e0e0e0;
  }
  
  @media (min-width: 768px) {
    .button-container {
      flex-direction: row;
      justify-content: center;
    }
    
    .primary-button, .secondary-button {
      width: auto;
    }
  }
  </style>