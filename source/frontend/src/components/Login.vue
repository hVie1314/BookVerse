<template>
  <Alert 
  v-model:show="alert.show" 
  :type="alert.type" 
  :title="alert.title" 
  :message="alert.message" 
  :auto-close-only="true"
  />
  <main class="login-page">
    <div class="login-overlay"></div>
    
    <form @submit.prevent="handleSubmit" class="login-container">
      <header class="login-header">
        <h1 class="login-title">Chào mừng trở lại</h1>
        <p class="login-subtitle">Đăng nhập để tiếp tục</p>
      </header>

      <!-- Input Email/Username -->
      <div class="input-container">
        <input
          type="text"
          placeholder="Nhập email hoặc tên đăng nhập"
          v-model="email"
          class="form-input"
          @focus="emailFocused = true"
          @blur="emailFocused = false"
        />
        <div class="icon-container" ><i class="fa-regular fa-envelopes eyes"></i></div>
      </div>

      <!-- Input Password -->
      <div class="input-container">
        <input
          :type="isPasswordVisible ? 'text' : 'password'"
          placeholder="Nhập mật khẩu"
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

      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="rememberMe" class="remember-checkbox" />
          <span class="remember-text">Ghi nhớ tài khoản</span>
        </label>
        <button type="button" class="forgot-password">Quên mật khẩu?</button>
      </div>

      <button type="submit" class="sign-in-button">Đăng nhập</button>

      <div class="signup-prompt">
        <span class="signup-text">Chưa có tài khoản?</span>
        <router-link to="/register" class="signup-link">Đăng ký ngay</router-link>
      </div>
    </form>
  </main>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue';
import CartService from '@/services/CartService';
import eventBus from '@/eventBus.js';

export default {
  name: 'LoginForm',
  components: {
    Alert
  },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      isPasswordVisible: false, // Thêm dòng này
      emailFocused: false,     // Biến này cũng cần thêm
      passwordFocused: false,
      alert: {
        show: false,
        type: 'success',
        title: '',
        message: ''
      },
    }
  },
  methods: {
    
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    async handleSubmit() {
      try {
        const response = await AuthenticationService.login({
          username: this.email,
          password: this.password
        });
        
        console.log('dữ liệu gửi đi:', {
          username: this.email,
          password: this.password
        });
        console.log('Login response:', response.data);
        
        // Kiểm tra phản hồi theo cấu trúc thực tế
        if (response.data && response.data.success) {
          // Nếu dữ liệu người dùng nằm trong response.data.data
          const userData = response.data.data;
          
          // Tạo đối tượng người dùng với accessToken (nếu không có, tạo giá trị tạm)
          const userWithToken = {
            ...userData,
            accessToken: userData.accessToken || userData.token || 'dummy-token-for-development'
          };
          
          // Lưu thông tin người dùng
          AuthenticationService.setUser(userWithToken);
          
          // Kiểm tra và merge giỏ hàng khách (THÊM MỚI)
          const guestCartId = localStorage.getItem('guestCartId');
          if (guestCartId) {
            try {
              // Gọi API để merge giỏ hàng
              await CartService.mergeGuestCartToUserCart(userData.id || userData._id, guestCartId);
              console.log('Đã merge giỏ hàng khách vào tài khoản');
              
              // Xóa guestCartId từ localStorage
              localStorage.removeItem('guestCartId');
              
              // Thông báo cập nhật giỏ hàng để cập nhật UI
              eventBus.emit('cart-updated');
            } catch (mergeError) {
              console.error('Lỗi khi merge giỏ hàng:', mergeError);
              // Không hiển thị lỗi cho người dùng, vẫn cho phép đăng nhập thành công
            }
          }
          
          this.alert = {
            show: true,
            type: 'success',
            title: 'Đăng nhập thành công',
            message: 'Chào mừng bạn quay trở lại BookVerse!'
          };
          
          setTimeout(() => {
            const redirectPath = this.$route.query.redirect || '/';
            this.$router.push(redirectPath);
          }, 1500);
        } else {
          // Xử lý trường hợp đăng nhập thất bại nhưng server không trả về lỗi
          this.alert = {
            show: true,
            type: 'error',
            title: 'Đăng nhập thất bại',
            message: 'Không thể xác thực thông tin đăng nhập'
          };
        }
      } catch (error) {
        // Giữ xử lý lỗi như cũ
        console.error('Login error:', error);
        this.alert = {
          show: true,
          type: 'error',
          title: 'Đăng nhập thất bại',
          message: error.response?.data?.message || 'Thông tin đăng nhập không chính xác'
        };
      }
    }
  }
}
</script>

<style scoped>
/* LoginPage styles */
.login-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(183, 124, 64, 0.1);
}

/* LoginForm styles */
.login-container {
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

.login-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.login-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 23px;
}

.login-subtitle {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 33px;
}

/* FormInput styles */
.input-container {
  position: relative;
  width: 100%;
  max-width: 340px;
  margin-bottom: 16px;
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
}

.form-options {
  width: 100%;
  max-width: 340px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 38px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #724e4e;
  border-radius: 2px;
  background-color: #fff;
}

.remember-text {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
}

.forgot-password {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.sign-in-button {
  width: 356px;
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
}

.signup-prompt {
  display: flex;
  gap: 19px;
  align-items: center;
}

.signup-text {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
}

.signup-link {
  color: rgba(114, 78, 78, 0.89);
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-decoration: none;
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

.input-focus {
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

.animate-icon {
  animation: float 3s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(-60%);
  }
}

.sign-in-button {
  width: 356px;
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

.sign-in-button:hover {
  transform: translateY(-3px);
  background-color: #8a6363;
}

.sign-in-button:active {
  transform: translateY(1px);
}

.sign-in-button::before {
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

.sign-in-button:hover::before {
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

.signup-link {
  position: relative;
  transition: color 0.3s ease;
}

.signup-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #724e4e;
  transition: width 0.3s ease;
}

.signup-link:hover::after {
  width: 100%;
}

/* Responsive styles */
@media (max-width: 991px) {
  .login-container {
    width: 380px;
    padding: 30px;
  }

  .input-container,
  .form-options,
  .sign-in-button {
    width: 316px;
  }
}

@media (max-width: 640px) {
  .login-container {
    width: 320px;
    padding: 20px;
  }

  .login-title {
    font-size: 32px;
  }

  .login-subtitle {
    font-size: 16px;
  }

  .input-container {
    width: 280px;
  }

  .form-options {
    width: 280px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .sign-in-button {
    width: 280px;
  }
  .input-container,
  .form-options,
  .sign-in-button {
    max-width: 280px;
  }
}

.eyes{
  color:#724e4e;
}
</style>