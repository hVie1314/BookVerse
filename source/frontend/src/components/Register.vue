<template>
  <Alert 
    v-model:show="alert.show" 
    :type="alert.type" 
    :title="alert.title" 
    :message="alert.message" 
    :auto-close-only="true"
  />
  <div>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <main class="registration-container">
      <section class="registration-card">
        <header>
          <h1 class="registration-title">Tạo tài khoản</h1>
          <p class="registration-subtitle">Đăng ký để bắt đầu</p>
        </header>

        <form class="registration-form" @submit.prevent="handleRegister">
          <!-- Username Input -->
          <div class="input-field">
            <input
              type="text"
              placeholder="Nhập tên đăng nhập của bạn"
              class="form-input"
              :class="{ 'error-input': usernameError }"
              v-model="formData.username"
              @focus="usernameFocused = true"
              @blur="validateUsername"
            />
          </div>
          <!-- Username Error Message -->
          <div v-if="usernameError" class="field-error-container">
            <div class="field-error">
              <i class="fa-solid fa-circle-exclamation error-icon"></i>
              {{ usernameError }}
            </div>
          </div>
          
          <!-- Email Input -->
          <div class="input-field" :class="{ 'input-focus': emailFocused }">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              class="form-input"
              :class="{ 'error-input': emailError }"
              v-model="formData.email"
              @focus="emailFocused = true"
              @blur="validateEmail"
            />
            <div class="icon-container"><i class="fa-regular fa-envelope eyes"></i></div>
          </div>
          <!-- Email Error Message -->
          <div v-if="emailError" class="field-error-container">
            <div class="field-error">
              <i class="fa-solid fa-circle-exclamation error-icon"></i>
              {{ emailError }}
            </div>
          </div>
          
          <!-- Password Input -->
          <div class="input-field" :class="{ 'input-focus': passwordFocused }">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Nhập mật khẩu của bạn"
              class="form-input"
              :class="{ 'error-input': passwordError }"
              v-model="formData.password"
              @focus="passwordFocused = true"
              @blur="validatePassword"
            />
            <div class="icon-container password-toggle" @click="togglePasswordVisibility">
              <transition name="fade" mode="out-in">
                <div v-if="isPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
                <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
              </transition>
            </div>
          </div>
          <!-- Password Error Message -->
          <div v-if="passwordError" class="field-error-container">
            <div class="field-error">
              <i class="fa-solid fa-circle-exclamation error-icon"></i>
              {{ passwordError }}
            </div>
          </div>
          
          <!-- Confirm Password Input -->
          <div class="input-field" :class="{ 'input-focus': confirmPasswordFocused }">
            <input
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              placeholder="Xác nhận mật khẩu của bạn"
              class="form-input"
              :class="{ 'error-input': confirmPasswordError }"
              v-model="formData.confirmPassword"
              ref="confirmPasswordInput"
              @focus="confirmPasswordFocused = true"
              @blur="validateConfirmPassword"
            />
            <div class="icon-container password-toggle" @click="toggleConfirmPasswordVisibility">
              <transition name="fade" mode="out-in">
                <div v-if="isConfirmPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
                <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
              </transition>
            </div>
          </div>
          <!-- Confirm Password Error Message -->
          <div v-if="confirmPasswordError" class="field-error-container">
            <div class="field-error">
              <i class="fa-solid fa-circle-exclamation error-icon"></i>
              {{ confirmPasswordError }}
            </div>
          </div>
          
          <button class="registration-button" type="submit">Tạo tài khoản</button>
          
          <p class="sign-in-prompt">
            Bạn đã có tài khoản?
            <router-link to="/login" class="sign-in-link">Đăng nhập ngay</router-link>
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue';

export default {
  name: 'RegisterForm',
  components: {
    Alert
  }, 
  data() {
    return {
      alert: {
        show: false,
        type: 'success',
        title: 'Success',
        message: 'Registration successful!'
      },
      formData: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      // Thêm các biến lỗi cho từng trường
      usernameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
      usernameFocused: false,
      emailFocused: false,
      passwordFocused: false,
      confirmPasswordFocused: false
    }
  },
  methods: {
    // Thêm các phương thức kiểm tra hợp lệ cho từng trường
    validateUsername() {
      this.usernameFocused = false;
      this.usernameError = '';
      
      if (!this.formData.username.trim()) {
        this.usernameError = 'Vui lòng nhập tên đăng nhập';
      } else if (this.formData.username.trim().length < 3) {
        this.usernameError = 'Tên đăng nhập phải có ít nhất 3 ký tự';
      }
    },
    
    validateEmail() {
      this.emailFocused = false;
      this.emailError = '';
      
      if (!this.formData.email.trim()) {
        this.emailError = 'Vui lòng nhập email';
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.emailError = 'Email không hợp lệ';
      }
    },
    
    validatePassword() {
      this.passwordFocused = false;
      this.passwordError = '';
      
      if (!this.formData.password) {
        this.passwordError = 'Vui lòng nhập mật khẩu';
      } else if (this.formData.password.length < 8) {
        this.passwordError = 'Mật khẩu phải có ít nhất 8 ký tự';
      }
      
      // Nếu đã nhập confirm password, kiểm tra lại khi password thay đổi
      if (this.formData.confirmPassword) {
        this.validateConfirmPassword();
      }
    },
    
    validateConfirmPassword() {
      this.confirmPasswordFocused = false;
      this.confirmPasswordError = '';
      
      if (!this.formData.confirmPassword) {
        this.confirmPasswordError = 'Vui lòng xác nhận mật khẩu';
      } else if (this.formData.confirmPassword !== this.formData.password) {
        this.confirmPasswordError = 'Mật khẩu xác nhận không khớp';
      }
    },
    
    validateForm() {
      // Xóa tất cả lỗi
      this.usernameError = '';
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      
      // Kiểm tra từng trường
      this.validateUsername();
      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();
      
      // Form hợp lệ nếu không có lỗi
      return !this.usernameError && !this.emailError && 
             !this.passwordError && !this.confirmPasswordError;
    },
    
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    
    toggleConfirmPasswordVisibility() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    },
    
    async handleRegister() {
      try {
        // Kiểm tra form hợp lệ
        if (!this.validateForm()) {
          return; // Không tiếp tục nếu form không hợp lệ
        }
        
        // Tiến hành đăng ký
        console.log("Processing registration: ", this.formData);

        const response = await AuthenticationService.register({
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password,
          role: 'user' // Thêm role mặc định khi đăng ký
        });
        
        if (response.data.success) {
          // Hiển thị alert thành công
          this.alert = {
            show: true,
            type: 'success',
            title: 'Đăng ký thành công',
            message: 'Tài khoản của bạn đã được tạo. Bây giờ bạn có thể đăng nhập!'
          };
          
          // Chuyển hướng sau khi hiển thị alert (delay 2 giây)
          setTimeout(() => {
            this.$router.push('/login');
          }, 1500);
        } else {
          // Xử lý lỗi từ API
          if (response.data.errorCode === 'USER_ALREADY_EXISTS') {
            this.usernameError = 'Tên đăng nhập hoặc email đã tồn tại';
          } else {
            this.alert = {
              show: true,
              type: 'error',
              title: 'Đăng ký thất bại',
              message: response.data.message || 'Vui lòng thử lại sau'
            };
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        
        // Xử lý lỗi từ response
        if (error.response?.data?.errorCode === 'USER_ALREADY_EXISTS') {
          this.usernameError = 'Tên đăng nhập hoặc email đã tồn tại';
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Đăng ký thất bại',
            message: error.response?.data?.message || 'Không thể kết nối đến máy chủ'
          };
        }
      }
    }
  }
}
</script>

<style scoped>
.registration-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(244, 235, 225);
}


.registration-card {
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

.registration-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  line-height: 48px;
  margin-bottom: 12px;
  text-align: center;
}

.registration-subtitle {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  margin-bottom: 33px;
  text-align: center;
}

.registration-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.input-field {
  position: relative;
  width: 100%;
  max-width: 340px;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.input-field:hover {
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

.registration-button {
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
  margin-top: 24px;
}

.registration-button:hover {
  transform: translateY(-3px);
  background-color: #8a6363;
}

.registration-button:active {
  transform: translateY(1px);
}

.registration-button::before {
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

.registration-button:hover::before {
  left: 100%;
}

.sign-in-prompt {
  display: flex;
  gap: 19px;
  align-items: center;
}

.signin-text {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
}

.sign-in-link {
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
  position: relative;
  transition: color 0.3s ease;
}

.sign-in-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #724e4e;
  transition: width 0.3s ease;
}

.sign-in-link:hover::after {
  width: 100%;
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

/* Responsive styles */
@media (max-width: 991px) {
  .registration-card {
    width: 380px;
    padding: 30px;
  }

  .input-field,
  .registration-button {
    width: 316px;
    max-width: 316px;
  }
}

@media (max-width: 640px) {
  .registration-card {
    width: 320px;
    padding: 20px;
  }

  .registration-title {
    font-size: 32px;
  }

  .registration-subtitle {
    font-size: 16px;
  }

  .input-field {
    width: 280px;
    max-width: 280px;
  }

  .registration-button {
    width: 280px;
    max-width: 280px;
    font-size: 20px;
  }
}

.eyes {
  color: #724e4e;
}

.field-error-container {
  width: 100%;
  max-width: 340px;
  margin-bottom: 16px;
  margin-top: -10px;
}

.field-error {
  color: #e74c3c;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  display: flex;
  align-items: center;
  background-color: rgba(231, 76, 60, 0.08);
  padding: 6px 12px;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
  margin-top: 4px;
  animation: errorPulse 2s infinite;
}

.error-icon {
  margin-right: 8px;
  font-size: 14px;
}

.error-input {
  border-color: #e74c3c !important;
  background-color: rgba(231, 76, 60, 0.03) !important;
}

@keyframes errorPulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

/* Responsive styles */
@media (max-width: 991px) {
  .field-error-container {
    width: 316px;
    max-width: 316px;
  }
}

@media (max-width: 640px) {
  .field-error-container {
    width: 280px;
    max-width: 280px;
  }
}
</style>