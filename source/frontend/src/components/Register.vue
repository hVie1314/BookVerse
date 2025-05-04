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
              v-model="formData.username"
              @focus="usernameFocused = true"
              @blur="usernameFocused = false"
            />
          </div>
          
          <!-- Email Input -->
          <div class="input-field" :class="{ 'input-focus': emailFocused }">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              class="form-input"
              v-model="formData.email"
              @focus="emailFocused = true"
              @blur="emailFocused = false"
            />
            <div class="icon-container"><i class="fa-regular fa-envelope eyes"></i></div>
          </div>
          
          <!-- Password Input -->
          <div class="input-field" :class="{ 'input-focus': passwordFocused }">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Nhập mật khẩu của bạn"
              class="form-input"
              v-model="formData.password"
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
          <div class="input-field" :class="{ 'input-focus': confirmPasswordFocused }">
            <input
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              placeholder="Xác nhận mật khẩu của bạn"
              class="form-input"
              v-model="formData.confirmPassword"
              ref="confirmPasswordInput"
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
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
      usernameFocused: false,
      emailFocused: false,
      passwordFocused: false,
      confirmPasswordFocused: false
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    },
    async handleRegister() {
      try {
        // Kiểm tra mật khẩu xác nhận
        if (this.formData.password !== this.formData.confirmPassword) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi xác nhận',
            message: 'Mật khẩu xác nhận không khớp!'
          };
          return;
        }
        
        // Kiểm tra độ dài mật khẩu
        if (this.formData.password.length < 4) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi mật khẩu',
            message: 'Mật khẩu phải có ít nhất 4 ký tự!'
          };
          return;
        }
        
        // Kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.formData.email)) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi email',
            message: 'Email không hợp lệ!'
          };
          return;
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
          // Hiển thị alert thành công thay vì alert()
          this.alert = {
            show: true,
            type: 'success',
            title: 'Đăng ký thành công',
            message: 'Tài khoản của bạn đã được tạo. Bây giờ bạn có thể đăng nhập!'
          };
          
          // Chuyển hướng sau khi hiển thị alert (delay 2 giây)
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Đăng ký thất bại',
            message: response.data.errorCode || 'Vui lòng thử lại sau'
          };
        }
      } catch (error) {
        console.error('Registration error:', error);
        this.alert = {
          show: true,
          type: 'error',
          title: 'Đăng ký thất bại',
          message: error.response?.data?.message || 
            (error.response?.data?.errorCode === 'USER_ALREADY_EXISTS' ? 
              'Tên đăng nhập hoặc email đã tồn tại' : 
              'Không thể kết nối đến máy chủ')
        };
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
</style>