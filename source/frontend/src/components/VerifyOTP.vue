<template>
  <Alert 
    v-model:show="alert.show" 
    :type="alert.type" 
    :title="alert.title" 
    :message="alert.message" 
    :auto-close-only="true"
  />
  <main class="verify-otp-page">
    <div class="verify-otp-overlay"></div>
    
    <form @submit.prevent="handleSubmit" class="verify-otp-container">
      <header class="verify-otp-header">
        <h1 class="verify-otp-title">Xác thực OTP</h1>
        <p class="verify-otp-subtitle">Nhập mã OTP được gửi đến email của bạn</p>
      </header>

      <!-- OTP Input -->
      <div class="otp-container">
        <input
          v-for="(digit, index) in 6" 
          :key="index"
          type="text"
          maxlength="1"
          class="otp-input"
          v-model="otpDigits[index]"
          @input="onOtpInput(index)"
          @keydown="onKeyDown($event, index)"
          ref="otpInputs"
        />
      </div>

      <p class="email-info">Mã OTP đã được gửi đến: <strong>{{ maskEmail(email) }}</strong></p>

      <div class="timer-container">
        <span v-if="countdown > 0">Gửi lại mã sau {{ formatTime(countdown) }}</span>
        <button 
          v-else 
          type="button" 
          class="resend-button"
          @click="resendOtp"
          :disabled="resending"
        >
          {{ resending ? 'Đang gửi...' : 'Gửi lại mã OTP' }}
        </button>
      </div>

      <button type="submit" class="submit-button" :disabled="loading || !isOtpComplete">
        <span v-if="loading">Đang xác thực...</span>
        <span v-else>Xác nhận</span>
      </button>

      <div class="back-prompt">
        <router-link to="/forgot-password" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Quay lại
        </router-link>
      </div>
    </form>
  </main>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue';

export default {
  name: 'VerifyOTP',
  components: {
    Alert
  },
  data() {
    return {
      email: '',
      otpDigits: ['', '', '', '', '', ''],
      countdown: 120, // 2 phút
      timer: null,
      loading: false,
      resending: false,
      alert: {
        show: false,
        type: 'success',
        title: '',
        message: ''
      }
    }
  },
  computed: {
    otp() {
      return this.otpDigits.join('');
    },
    isOtpComplete() {
      return this.otpDigits.every(digit => digit !== '');
    }
  },
  created() {
  // Kiểm tra cả params và query để lấy email
    this.email = this.$route.params.email || this.$route.query.email || '';
    
    console.log('Email trong VerifyOTP:', this.email); // Debugging
    
    if (!this.email) {
      console.log('Không tìm thấy email, quay về trang quên mật khẩu');
      this.$router.push('/forgot-password');
      return;
    }
    
    // Bắt đầu đếm ngược
    this.startCountdown();
  },
  beforeUnmount() {
    this.clearCountdown();
  },
  methods: {
    startCountdown() {
      this.clearCountdown();
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.clearCountdown();
        }
      }, 1000);
    },
    
    clearCountdown() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    },
    
    maskEmail(email) {
      if (!email) return '';
      const [name, domain] = email.split('@');
      if (!name || !domain) return email;
      
      const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
      return `${maskedName}@${domain}`;
    },
    
    onOtpInput(index) {
      // Đảm bảo chỉ nhập số
      this.otpDigits[index] = this.otpDigits[index].replace(/\D/g, '');
      
      // Di chuyển focus đến ô tiếp theo
      if (this.otpDigits[index] && index < 5) {
        this.$nextTick(() => {
          this.$refs.otpInputs[index + 1].focus();
        });
      }
    },
    
    onKeyDown(event, index) {
      // Xử lý phím Backspace
      if (event.key === 'Backspace') {
        if (!this.otpDigits[index] && index > 0) {
          this.$nextTick(() => {
            this.$refs.otpInputs[index - 1].focus();
          });
        }
      }
    },
    
    async resendOtp() {
      try {
        this.resending = true;
        const response = await AuthenticationService.forgotPassword(this.email);
        
        if (response.data && response.data.success) {
          this.alert = {
            show: true,
            type: 'success',
            title: 'Thành công',
            message: 'Mã OTP mới đã được gửi đến email của bạn'
          };
          
          // Bắt đầu đếm ngược lại
          this.countdown = 120;
          this.startCountdown();
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi',
            message: response.data?.message || 'Không thể gửi lại mã OTP'
          };
        }
      } catch (error) {
        console.error('Resend OTP error:', error);
        this.alert = {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        };
      } finally {
        this.resending = false;
      }
    },
    
    async handleSubmit() {
      if (!this.isOtpComplete) return;
      
      try {
        this.loading = true;
        
        // Lưu OTP vào localStorage để sử dụng cho bước reset password
        localStorage.setItem('reset_password_otp', this.otp);
        
        // Thêm log để debug
        console.log('OTP hợp lệ, chuẩn bị chuyển đến trang reset-password với email:', this.email);
        
        this.alert = {
          show: true,
          type: 'success',
          title: 'Thành công',
          message: 'Mã OTP hợp lệ. Vui lòng đặt mật khẩu mới.'
        };
        
        // Chuyển đến trang đặt lại mật khẩu sau 1.5 giây
        setTimeout(() => {
          // Sử dụng cả hai cách để đảm bảo thành công
          this.$router.push({
            name: 'reset-password',
            query: { email: this.email }
          }).then(() => {
            console.log('Đã chuyển đến trang reset-password thành công');
          }).catch(err => {
            console.error('Lỗi khi chuyển trang:', err);
            // Thử cách khác nếu cách trên không thành công
            window.location.href = `/reset-password?email=${encodeURIComponent(this.email)}`;
          });
        }, 1500);
      } catch (error) {
        console.error('Verify OTP error:', error);
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
.verify-otp-page {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(244, 235, 225);
}

.verify-otp-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(183, 124, 64, 0.1);
}

.verify-otp-container {
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

.verify-otp-header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.verify-otp-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 23px;
}

.verify-otp-subtitle {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 33px;
}

.otp-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.otp-input {
  width: 50px;
  height: 60px;
  border: 2px solid #724e4e;
  border-radius: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  background-color: #fff;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.otp-input:focus {
  outline: none;
  border-color: #8a6363;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(114, 78, 78, 0.1);
}

.email-info {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  margin-bottom: 15px;
}

.timer-container {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  margin-bottom: 20px;
}

.resend-button {
  background: none;
  border: none;
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.resend-button:hover:not(:disabled) {
  background-color: rgba(114, 78, 78, 0.1);
}

.resend-button:disabled {
  color: #aaa;
  cursor: not-allowed;
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
  .verify-otp-container {
    width: 380px;
    padding: 30px;
  }

  .otp-container {
    gap: 8px;
  }

  .otp-input {
    width: 45px;
    height: 55px;
    font-size: 22px;
  }

  .submit-button {
    width: 316px;
  }
}

@media (max-width: 640px) {
  .verify-otp-container {
    width: 320px;
    padding: 20px;
  }

  .verify-otp-title {
    font-size: 32px;
  }

  .verify-otp-subtitle {
    font-size: 16px;
  }

  .otp-container {
    gap: 6px;
  }

  .otp-input {
    width: 40px;
    height: 50px;
    font-size: 20px;
  }

  .submit-button {
    width: 280px;
    font-size: 20px;
  }
}
</style>