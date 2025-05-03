<template>
  <transition name="fade-overlay">
    <div v-if="show" class="alert-overlay">
      <transition name="fade-alert">
        <div class="alert-container" :class="type">
          <!-- Nút đóng đặt ở góc trên bên phải -->
          <button v-if="shouldShowCloseButton" @click="closeAlert" class="alert-close">
            <i class="fa-solid fa-times"></i>
          </button>
          <!-- Success check icon at the top of alert -->
          <div v-if="type === 'success'" class="success-check-container">
            <i class="fa-light fa-circle-check success-check-icon"></i>
          </div>
          
          <!-- Error icon for error alerts -->
          <div v-else-if="type === 'error'" class="error-icon-container">
            <i class="fa-solid fa-circle-xmark error-icon"></i>
          </div>

          <div class="alert-body">
            <div class="alert-content">
              <div class="alert-title">{{ title }}</div>
              <div class="alert-message" v-if="message === 'category'|| message === 'đặt hàng'">
                <span>Vui lòng </span>
                <span class="login-link" @click="redirectToLogin">đăng nhập</span>
                <span v-if="message.includes('category')"> để thêm sản phẩm vào danh sách yêu thích</span>
                <span v-else> để đặt hàng</span>
              </div>
              <div class="alert-message" v-else>
                {{ message }}
              </div>

              <!-- Thêm vùng hiển thị nút tùy chọn -->
              
            </div>
          </div>
          <div v-if="showChoices" class="alert-choices">
            <button class="choice-button confirm-button" @click="handleConfirm">
              {{ confirmText }}
            </button>
            <button class="choice-button cancel-button" @click="handleCancel">
              {{ cancelText }}
            </button>
          </div>
        </div>
      </transition>
      
    </div>
  </transition>
</template>
  
  <script>
  export default {
    name: 'Alert-vue',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error'].includes(value)
      },
      title: {
        type: String,
        default: 'Success'
      },
      message: {
        type: String,
        default: 'Operation completed successfully'
      },
      duration: {
        type: Number,
        default: 3000
      },
      autoClose: {
        type: Boolean,
        default: true
      },
      autoCloseOnly: {
        type: Boolean,
        default: false
      },
      showChoices: { type: Boolean, default: false },
      confirmText: { type: String, default: 'Đồng ý' },
      cancelText: { type: String, default: 'Hủy bỏ' }
    },
    emits: ['update:show', 'confirm', 'cancel'],
    computed: {
      shouldAutoClose() {
        if (this.showChoices) return false;
        return this.type === 'success' && 
          (this.autoCloseOnly || 
          this.message.includes('đăng nhập thành công') || 
          this.message.includes('đăng xuất thành công'));
      },

      // Hiển thị nút đóng cho tất cả thông báo NGOẠI TRỪ thông báo tự đóng
      shouldShowCloseButton() {
        if (this.showChoices) return false;
        return !this.shouldAutoClose;
      }
    },
    watch: {
      show(newVal) {
        if (newVal && this.autoClose && this.shouldAutoClose) {
          this.setAutoClose();
        }
      }
    },
    methods: {
      closeAlert() {
        this.$emit('update:show', false);
      },
      setAutoClose() {
        setTimeout(() => {
          this.closeAlert();
        }, this.duration);
      },
      redirectToLogin() {
        this.closeAlert();
        this.$router.push('/login');
      },
      handleConfirm() {
        this.$emit('confirm');
        this.closeAlert();
      },
      handleCancel() {
        this.$emit('cancel');
        this.closeAlert();
      }
    },
    mounted() {
      if (this.show && this.autoClose && this.shouldAutoClose) {
        this.setAutoClose();
      }
    }
  }
  </script>
  
<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.alert-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Thay đổi từ center thành space-between */
  align-items: center;
  min-height: 300px; /* Thay đổi height thành min-height */
  max-width: 800px;
  min-width: 600px;
  padding: 20px 24px 30px; /* Thêm padding bottom */
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  z-index: 10000;
}

.success {
  border-left: 4px solid #4CAF50;
}

.error {
  border-left: 4px solid #F44336;
}


/* Success check icon at the top */
.success-check-container {
  position: relative;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success-check-icon {
  color: #4CAF50;
  font-size: 100px;
}

/* Error icon styling */
.error-icon-container {
  position: relative;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-icon {
  color: #F44336;
  font-size: 100px;
}

.alert-body {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px; /* Thêm margin để tạo khoảng cách với phần nút */
  flex: 1; /* Để alert-body chiếm phần còn lại của không gian */
}

.alert-icon {
  margin-right: 16px;
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alert-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #333;
}

.alert-message {
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  color: #666;
  text-emphasis: center;
  text-align: center;
}

/* Đặt nút đóng ở góc phải trên cùng */
.alert-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10001;
}

.alert-close:hover {
  color: #333;
}

/* Animation cho overlay */
.fade-overlay-enter-active, .fade-overlay-leave-active {
  transition: opacity 0.3s;
}

.fade-overlay-enter-from, .fade-overlay-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-alert-enter-from, .fade-alert-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Cập nhật CSS cho login-link */
.login-link {
  color: #4d2900;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700; /* Đậm hơn để nổi bật */
  cursor: pointer;
  position: relative;
  display: inline;
  transition: color 0.3s ease;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #4d2900;
  transition: width 0.3s ease;
}

.login-link:hover {
  color: #755e47;
}

.login-link:hover::after {
  width: 100%;
}

.login-link {
  color: #4d2900;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  display: inline;
  transition: color 0.3s ease;
}

.login-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #4d2900;
  transition: width 0.3s ease;
}

.login-link:hover {
  color: #755e47;
}

.login-link:hover::after {
  width: 100%;
}

/* Thêm style cho phần nút lựa chọn */
/* Cập nhật alert-choices */
.alert-choices {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  padding-top: 20px; /* Đặt padding thay vì margin */
  border-top: 1px solid #f0f0f0; /* Thêm đường ngăn cách nhẹ */
}

.choice-button {
  padding: 10px 20px;
  border-radius: 5px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.confirm-button {
  background-color: #4d2900;
  color: white;
}

.confirm-button:hover {
  background-color: #755e47;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background-color: #e0e0e0;
}
</style>