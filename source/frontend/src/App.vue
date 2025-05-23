<template>
  <div id="app">
    <Alert 
      v-model:show="globalAlert.show" 
      :type="globalAlert.type" 
      :title="globalAlert.title" 
      :message="globalAlert.message"
      :auto-close="globalAlert.autoClose"
      :duration="globalAlert.duration || 3000"
      :show-input="globalAlert.showInput"
      :input-placeholder="globalAlert.inputPlaceholder"
      :input-required="globalAlert.inputRequired"
      :show-choices="globalAlert.showChoices || false"
      :confirm-text="globalAlert.confirmText || 'Đồng ý'"
      :cancel-text="globalAlert.cancelText || 'Hủy bỏ'"
      :choices="globalAlert.choices"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
    <!-- Loading overlay -->
    <transition name="fade-out">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </transition>
    
    <!-- Content only shows when loading is done -->
    <transition name="fade-in">
      <div v-if="!loading" class="content-container">
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import eventBus from './eventBus';
import Alert from '@/components/Alert.vue';
import CartService from '@/services/CartService';
import WishlistService from '@/services/WishlistService';
export default {
  name: 'App',
  components: {
    Alert
  },
  data() {
    return {
      loading: false,
      loadingStartTime: 0,
      minLoadingTime: 800,
      isLoggedIn: false,
      globalAlert: {
        show: false,
        type: 'success',
        title: '',
        message: '',
        autoClose: true,
        duration: 3000,
        showChoices: false,
        showInput: false,
        inputPlaceholder: '',
        inputRequired: false,
        confirmText: 'Đồng ý',
        cancelText: 'Hủy bỏ',
        choices: []
      }
    }
  },
  // mounted() {
  //   this.$root.$on('show-alert', (alertOptions) => {
  //     this.alertOptions = { ...alertOptions };
  //     this.showAlert = alertOptions.show;
  //   });
  // },
  created() {
    this.isLoggedIn = AuthenticationService.isLoggedIn();
    
    // Lắng nghe sự kiện đăng xuất
    eventBus.on('logout', this.handleLogoutEvent);

    // Trong phần lắng nghe sự kiện của App.vue
    eventBus.on('show-alert', (alertData) => {
      console.log('Received show-alert event:', alertData);
      console.log('Input enabled:', alertData.showInput);
      
      // Đảm bảo truyền tất cả các thuộc tính đến alert
      this.globalAlert = { 
        ...alertData,
        show: true 
      };
      
      // Chỉ tự động đóng các thông báo thành công về đăng nhập
      if (alertData.type === 'success' && 
          alertData.message && 
          (alertData.message.includes('đăng nhập thành công') || 
          alertData.message.includes('đăng xuất thành công')) && 
          !alertData.showChoices && 
          alertData.autoClose !== false) {
        setTimeout(() => {
          this.globalAlert.show = false;
        }, alertData.duration || 5000);
      }
    });

    this.$router.beforeEach((to, from, next) => {
      // Bắt đầu hiệu ứng loading và lưu thời điểm bắt đầu
      this.loading = true;
      this.loadingStartTime = Date.now();
      next();
    });
    
    this.$router.afterEach(() => {
      // Tính thời gian đã trôi qua và thời gian còn lại cần hiển thị
      const elapsedTime = Date.now() - this.loadingStartTime;
      const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
      
      // Đảm bảo hiệu ứng loading hiển thị đủ thời gian tối thiểu
      setTimeout(() => {
        this.loading = false;
      }, remainingTime);
    });

    if (!AuthenticationService.isLoggedIn()) {
        CartService.ensureGuestCartId();
    }

    if (AuthenticationService.isLoggedIn()) {
        WishlistService.getWishlist()
            .then(response => {
                eventBus.emit('wishlist-loaded', response.data);
            })
            .catch(error => console.error('Lỗi tải danh sách yêu thích:', error));
    }
    
    // Khi người dùng đăng nhập, tải lại danh sách yêu thích
    eventBus.on('user-logged-in', () => {
      const userId = AuthenticationService.getCurrentUser()?.id;
      if (userId) {
          WishlistService.getUserWishlist(userId)
              .then(response => {
                  console.log('Đã tải danh sách yêu thích sau đăng nhập');
                  
                  // Tạo sự kiện với dữ liệu đã chuẩn hóa
                  if (response.data && response.data.data && response.data.data.wishlist) {
                      eventBus.emit('wishlist-loaded', {
                          success: true,
                          data: {
                              products: response.data.data.wishlist.products || []
                          }
                      });
                  } else {
                      eventBus.emit('wishlist-loaded', response.data);
                  }
              })
              .catch(error => console.error('Lỗi tải danh sách yêu thích sau đăng nhập:', error));
      }
  });
    eventBus.on('close-alert', () => {
      this.globalAlert.show = false; // Sửa từ this.alert thành this.globalAlert
    });
  },
  beforeUnmount() {
    // Clean up listener
    eventBus.off('logout', this.handleLogoutEvent);
    eventBus.off('show-alert');
    eventBus.off('confirm');
    eventBus.off('cancel');
    eventBus.off('close-alert', this.closeAlertHandler);
  },
  methods: {
    handleLogoutEvent() {
      this.isLoggedIn = false;
        this.userRole = null;
        
        // Hiển thị thông báo đăng xuất thành công
        eventBus.emit('show-alert', {
            show: true,
            type: 'success',
            title: 'Đăng xuất thành công',
            message: 'Bạn đã đăng xuất khỏi hệ thống',
            autoClose: true
        });

        // Chuyển hướng về trang chủ
        this.$router.push('/');
    },

    // Thêm phương thức xử lý confirm
    handleConfirm(inputValue) {
      console.log("Alert confirm được nhấn với giá trị:", inputValue);
      
      // Nếu có callback trong choices, gọi nó
      if (this.globalAlert.choices && this.globalAlert.choices.length > 0) {
        const confirmChoice = this.globalAlert.choices.find(choice => 
          choice.text === this.globalAlert.confirmText);
        
        if (confirmChoice && typeof confirmChoice.onClick === 'function') {
          confirmChoice.onClick(inputValue);
          return;
        }
      }
      
      // Emit sự kiện với input value
      eventBus.emit('confirm', inputValue);
    },
    
    // Thêm phương thức xử lý cancel
    handleCancel() {
      console.log("Alert cancel được nhấn");
      
      // Nếu có callback trong choices, gọi nó
      if (this.globalAlert.choices && this.globalAlert.choices.length > 0) {
        const cancelChoice = this.globalAlert.choices.find(choice => 
          choice.text === this.globalAlert.cancelText);
        
        if (cancelChoice && typeof cancelChoice.onClick === 'function') {
          cancelChoice.onClick();
          return;
        }
      }
      
      // Emit sự kiện cancel
      eventBus.emit('cancel');
      
      // Đóng alert
      this.globalAlert.show = false;
    }
  }
}
</script>

<style>
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Container cho nội dung chính */
.content-container {
  width: 100%;
  min-height: 100vh;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 250, 245, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Spinner animation */
.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(77, 41, 0, 0.1);
  border-top: 6px solid #4d2900;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transition cho loading overlay */
.fade-out-enter-active, .fade-out-leave-active {
  transition: opacity 0.3s;
}
.fade-out-leave-to {
  opacity: 0;
}

/* Transition cho nội dung */
.fade-in-enter-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-in-enter {
  opacity: 0;
  transform: translateY(10px);
}

.body{
  font-family: "Montserrat", sans-serif;
}

.Vue-Toastification__container {
  z-index: 9999 !important;
}

.Vue-Toastification__container.top-right, 
.Vue-Toastification__container.top-center, 
.Vue-Toastification__container.top-left {
  top: 85px !important; /* Điều chỉnh bằng chiều cao của navbar */
}

@media (max-width: 991px) {
  .Vue-Toastification__container.top-right, 
  .Vue-Toastification__container.top-center, 
  .Vue-Toastification__container.top-left {
    top: 55px !important; /* Chiều cao navbar trên thiết bị nhỏ hơn */
  }
}
</style>