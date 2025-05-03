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
            countdown: 15 // Thêm bộ đếm thời gian
        };
    },
    async created() {
        // Lấy các tham số từ URL
        const params = new URLSearchParams(window.location.search);
        const resultCode = params.get('resultCode');
        this.orderId = params.get('orderId') || localStorage.getItem('pendingOrderId');
        
        if (!this.orderId) {
            this.loading = false;
            this.isSuccess = false;
            this.statusMessage = 'Không tìm thấy thông tin đơn hàng';
            return;
        }

        // Hiển thị bộ đếm ngược
        const timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
            clearInterval(timer);
            }
        }, 1000);
        
        try {
            // Gọi API để kiểm tra trạng thái giao dịch
            const response = await OrderService.checkTransactionStatus(this.orderId);
            console.log('Kết quả kiểm tra giao dịch:', response.data);
            
            this.isSuccess = response.data && (response.data.success || response.data.status === 'success');
            this.statusMessage = this.isSuccess 
            ? 'Thanh toán đã được xác nhận, đơn hàng của bạn sẽ sớm được giao.' 
            : 'Thanh toán không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.';
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái giao dịch:', error);
            
            // Sử dụng resultCode từ URL của MoMo nếu API bị lỗi
            if (resultCode !== null) {
            // MoMo trả về resultCode=0 khi thành công
            this.isSuccess = resultCode === '0';
            this.statusMessage = this.isSuccess
                ? 'Thanh toán thành công theo thông tin từ MoMo, đơn hàng của bạn sẽ sớm được giao.'
                : 'Thanh toán không thành công theo thông tin từ MoMo. Vui lòng thử lại sau.';
            } else {
            this.isSuccess = false;
            this.statusMessage = 'Đã xảy ra lỗi khi kiểm tra trạng thái thanh toán. Vui lòng kiểm tra đơn hàng của bạn.';
            }
        } finally {
            // Xóa orderId đã xử lý
            localStorage.removeItem('pendingOrderId');
            this.loading = false;
            clearInterval(timer);
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