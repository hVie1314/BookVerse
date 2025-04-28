<template>
  <Alert 
  v-model:show="alert.show" 
  :type="alert.type" 
  :title="alert.title" 
  :message="alert.message" 
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
        />
        <div class="icon-container" v-html="emailIcon"></div>
      </div>

      <!-- Input Password -->
      <div class="input-container">
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          v-model="password"
          class="form-input"
        />
        <div class="icon-container" v-html="passwordIcon"></div>
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
      alert: {
        show: false,
        type: 'success',
        title: '',
        message: ''
      },
      emailIcon: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.10358 6.5693L10.1006 10.5673L18.0976 6.5693C18.068 6.05975 17.8447 5.58079 17.4734 5.23053C17.1021 4.88027 16.611 4.68521 16.1006 4.6853H4.10058C3.59016 4.68521 3.09902 4.88027 2.72775 5.23053C2.35648 5.58079 2.13318 6.05975 2.10358 6.5693Z" fill="#724E4E"/>
        <path d="M18.1006 8.80334L10.1006 12.8033L2.10059 8.80334V14.6853C2.10059 15.2158 2.3113 15.7245 2.68637 16.0996C3.06144 16.4746 3.57015 16.6853 4.10059 16.6853H16.1006C16.631 16.6853 17.1397 16.4746 17.5148 16.0996C17.8899 15.7245 18.1006 15.2158 18.1006 14.6853V8.80334Z" fill="#724E4E"/>
      </svg>`,
      passwordIcon: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_5_18)">
          <path d="M10.1006 12.6853C10.631 12.6853 11.1397 12.4746 11.5148 12.0995C11.8899 11.7244 12.1006 11.2157 12.1006 10.6853C12.1006 10.1549 11.8899 9.64616 11.5148 9.27109C11.1397 8.89602 10.631 8.6853 10.1006 8.6853C9.57015 8.6853 9.06145 8.89602 8.68637 9.27109C8.3113 9.64616 8.10059 10.1549 8.10059 10.6853C8.10059 11.2157 8.3113 11.7244 8.68637 12.0995C9.06145 12.4746 9.57015 12.6853 10.1006 12.6853Z" fill="#724E4E"/>
          <path d="M2.1006 10.6853C3.0406 8.3453 6.1706 6.6853 10.1006 6.6853C14.0306 6.6853 17.1606 8.3453 18.1006 10.6853C17.1606 13.0253 14.0306 14.6853 10.1006 14.6853C6.1706 14.6853 3.0406 13.0253 2.1006 10.6853ZM11.1006 0.685303C6.5806 0.685303 3.0406 2.7053 1.1006 5.6453C0.160599 7.1153 0.100599 9.2553 1.1006 10.7253C3.0406 13.6653 6.5806 15.6853 11.1006 15.6853C15.6206 15.6853 19.1606 13.6653 21.1006 10.7253C22.0406 9.2553 22.1006 7.1153 21.1006 5.6453C19.1606 2.7053 15.6206 0.685303 11.1006 0.685303Z" fill="#724E4E"/>
        </g>
        <defs>
          <clipPath id="clip0_5_18">
            <rect width="20" height="20" fill="white" transform="translate(0.100586 0.685303)"/>
          </clipPath>
        </defs>
      </svg>`
    }
  },
  methods: {
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
</style>