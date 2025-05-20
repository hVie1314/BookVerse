<template>
  <Alert 
    v-model:show="alert.show" 
    :type="alert.type" 
    :title="alert.title" 
    :message="alert.message" 
    :auto-close-only="true"
  />
  <main class="reset-password-page">
    <div class="reset-password-overlay"></div>
    
    <form @submit.prevent="handleSubmit" class="reset-password-container">
      <header class="reset-password-header">
        <h1 class="reset-password-title">Đặt lại mật khẩu</h1>
        <p class="reset-password-subtitle">Tạo mật khẩu mới cho tài khoản của bạn</p>
      </header>

      <!-- Password Input -->
      <div class="input-container">
        <input
          :type="isPasswordVisible ? 'text' : 'password'"
          placeholder="Nhập mật khẩu mới"
          v-model="password"
          class="form-input"
          @focus="passwordFocused = true"
          @blur="passwordFocused = false"
        />
        <div class="icon-container password-toggle" @click="togglePasswordVisibility">
          <transition name="fade" mode="out-in">
            <div v-if="isPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
            <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
          </transition>
        </div>
      </div>

      <!-- Confirm Password Input -->
      <div class="input-container">
        <input
          :type="isConfirmPasswordVisible ? 'text' : 'password'"
          placeholder="Xác nhận mật khẩu mới"
          v-model="confirmPassword"
          class="form-input"
          @focus="confirmPasswordFocused = true"
          @blur="confirmPasswordFocused = false"
        />
        <div class="icon-container password-toggle" @click="toggleConfirmPasswordVisibility">
          <transition name="fade" mode="out-in">
            <div v-if="isConfirmPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
            <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
          </transition>
        </div>
      </div>

      <!-- Password Requirements -->
      <div class="password-requirements">
            <p class="requirement-title">Mật khẩu cần đáp ứng các yêu cầu sau:</p>
            <ul class="requirement-list">
            <li :class="{ 'met': password.length >= 8 }">
                <i :class="password.length >= 8 ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"></i>
                Ít nhất 8 ký tự
            </li>
            </ul>
        </div>

      <button 
        type="submit" 
        class="submit-button" 
        :disabled="!isFormValid || loading"
      >
        <span v-if="loading">Đang xử lý...</span>
        <span v-else>Cập nhật mật khẩu</span>
      </button>
    </form>
  </main>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue';

export default {
  name: 'ResetPassword',
  components: {
    Alert
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
      passwordFocused: false,
      confirmPasswordFocused: false,
      loading: false,
      alert: {
        show: false,
        type: 'success',
        title: '',
        message: ''
      }
    }
  },
  computed: {

    // Cập nhật lại property này
    isPasswordValid() {
      return this.password.length >= 8;
    },
    isFormValid() {
      return this.isPasswordValid && this.password === this.confirmPassword;
    }
  },
  created() {
  // Lấy email từ cả route params và query
    this.email = this.$route.params.email || this.$route.query.email || '';
    
    console.log('Email trong ResetPassword:', this.email); // Thêm log để debug
    
    if (!this.email) {
      console.log('Không tìm thấy email trong ResetPassword, quay về trang forgot-password');
      this.$router.push('/forgot-password');
      return;
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    },
    async handleSubmit() {
      if (!this.isFormValid) {
        // Kiểm tra mật khẩu xác nhận
        if (this.password !== this.confirmPassword) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: 'Mật khẩu xác nhận không khớp!'
          };
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: 'Mật khẩu không đáp ứng các yêu cầu an toàn!'
          };
        }
        return;
      }
      
      try {
        this.loading = true;
        const response = await AuthenticationService.resetPassword(this.email, this.password);
        
        if (response.data && response.data.success) {
          this.alert = {
            show: true,
            type: 'success',
            title: 'Thành công',
            message: 'Mật khẩu đã được cập nhật thành công. Bạn có thể đăng nhập ngay bây giờ.'
          };
          
          // Chuyển hướng đến trang đăng nhập sau 2 giây
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: response.data?.message || 'Không thể cập nhật mật khẩu'
          };
        }
      } catch (error) {
        console.error('Reset password error:', error);
        this.alert = {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        };
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.reset-password-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(244, 235, 225);
}

.reset-password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(183, 124, 64, 0.1);
}

.reset-password-container {
  position: relative;
  width: 420px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 8px 32px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.97);
}

.reset-password-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.reset-password-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 23px;
}

.reset-password-subtitle {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 33px;
}

.input-container {
  position: relative;
  width: 100%;
  max-width: 340px;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.input-container:hover {
  transform: translateY(-2px);
}

.form-input {
  width: 100%;
  height: 59px;
  border: 2px solid #724e4e;
  border-radius: 8px;
  padding: 0 40px 0 16px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #000;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #8a6363;
  box-shadow: 0 0 0 3px rgba(114, 78, 78, 0.2);
}

.icon-container {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.password-toggle {
  cursor: pointer;
}

.password-toggle:hover {
  transform: translateY(-50%) scale(1.1);
}

.password-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

.password-requirements {
  width: 100%;
  max-width: 340px;
  margin: 10px 0 20px;
  padding: 15px;
  background-color: rgba(114, 78, 78, 0.05);
  border-radius: 8px;
}

.requirement-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.requirement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirement-list li {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.requirement-list li i {
  width: 16px;
  text-align: center;
}

.requirement-list li.met {
  color: #4CAF50;
}

.requirement-list li:not(.met) i {
  color: #F44336;
}

.submit-button {
  width: 340px;
  height: 56px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
  box-shadow: 0px 4px 6px 0px rgba(229, 62, 62, 0.25);
  margin-bottom: 23px;
  background-color: #724e4e;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  background-color: #8a6363;
}

.submit-button:active:not(:disabled) {
  transform: translateY(1px);
}

.submit-button:disabled {
  background-color: #a89393;
  cursor: not-allowed;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    rgba(255, 255, 255, 0) 0%, 
    rgba(255, 255, 255, 0.2) 50%, 
    rgba(255, 255, 255, 0) 100%
  );
  transition: left 0.6s;
}

.submit-button:hover:not(:disabled)::before {
  left: 100%;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

@media (max-width: 991px) {
  .reset-password-container {
    width: 380px;
    padding: 30px;
  }

  .input-container,
  .password-requirements,
  .submit-button {
    width: 316px;
    max-width: 316px;
  }
}

@media (max-width: 640px) {
  .reset-password-container {
    width: 320px;
    padding: 20px;
  }

  .reset-password-title {
    font-size: 32px;
  }

  .reset-password-subtitle {
    font-size: 16px;
  }

  .input-container,
  .password-requirements,
  .submit-button {
    width: 280px;
    max-width: 280px;
  }
  
  .submit-button {
    font-size: 20px;
  }
}

.eyes {
  color: #724e4e;
}
</style>