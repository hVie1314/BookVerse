<template>
  <Alert 
    v-model:show="alert.show" 
    :type="alert.type" 
    :title="alert.title" 
    :message="alert.message" 
    :auto-close-only="true"
  />
  <main class="forgot-password-page">
    <div class="forgot-password-overlay"></div>
    
    <form @submit.prevent="handleSubmit" class="forgot-password-container">
      <header class="forgot-password-header">
        <h1 class="forgot-password-title">Quên mật khẩu</h1>
        <p class="forgot-password-subtitle">Nhập email để đặt lại mật khẩu</p>
      </header>

      <!-- Input Email -->
      <div class="input-container">
        <input
          type="email"
          placeholder="Nhập email của bạn"
          v-model="email"
          class="form-input"
          required
          @focus="emailFocused = true"
          @blur="emailFocused = false"
        />
        <div class="icon-container"><i class="fa-regular fa-envelope eyes"></i></div>
      </div>

      <button type="submit" class="submit-button" :disabled="loading">
        <span v-if="loading">Đang gửi...</span>
        <span v-else>Gửi yêu cầu</span>
      </button>

      <div class="back-prompt">
        <router-link to="/login" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Quay lại đăng nhập
        </router-link>
      </div>
    </form>
  </main>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue';

export default {
  name: 'ForgotPassword',
  components: {
    Alert
  },
  data() {
    return {
      email: '',
      loading: false,
      emailFocused: false,
      alert: {
        show: false,
        type: 'success',
        title: '',
        message: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // Kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: 'Email không hợp lệ!'
          };
          return;
        }

        this.loading = true;
        const response = await AuthenticationService.forgotPassword(this.email);
        console.log('Phản hồi từ API forgotPassword:', response.data);
        
        if (response.data && response.data.success) {
          this.alert = {
            show: true,
            type: 'success',
            title: 'Thành công',
            message: 'Vui lòng kiểm tra email của bạn để lấy mã OTP'
          };
          
          // Chuyển đến trang xác thực OTP sau 2 giây
          console.log('Chuyển hướng đến trang verify-otp với email:', this.email);
          setTimeout(() => {
          this.$router.push({
            name: 'verify-otp',
            query: { email: this.email } // Thay đổi từ params thành query
          }).then(() => {
            console.log('Chuyển hướng thành công');
          }).catch(error => {
            console.error('Lỗi chuyển hướng:', error);
          });
        }, 2000);
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: response.data?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu'
          };
        }
      } catch (error) {
        console.error('Forgot password error:', error);
        this.alert = {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: error.response?.data?.message || 'Email không tồn tại vui lòng nhập đúng email!'
        };
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(244, 235, 225);
}

.forgot-password-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(183, 124, 64, 0.1);
}

.forgot-password-container {
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

.forgot-password-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.forgot-password-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 23px;
}

.forgot-password-subtitle {
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
  margin-bottom: 24px;
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

.back-prompt {
  margin-top: 10px;
}

.back-link {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
}

.back-link:hover {
  color: #8a6363;
}

@media (max-width: 991px) {
  .forgot-password-container {
    width: 380px;
    padding: 30px;
  }

  .input-container,
  .submit-button {
    width: 316px;
    max-width: 316px;
  }
}

@media (max-width: 640px) {
  .forgot-password-container {
    width: 320px;
    padding: 20px;
  }

  .forgot-password-title {
    font-size: 32px;
  }

  .forgot-password-subtitle {
    font-size: 16px;
  }

  .input-container,
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