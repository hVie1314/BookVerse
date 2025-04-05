<template>
  <div>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <main class="registration-container">
      <section class="registration-card">
        <header>
          <h1 class="registration-title">Create Account</h1>
          <p class="registration-subtitle">Sign up to get started</p>
        </header>

        <form class="registration-form" @submit.prevent="handleRegister">
          <!-- Username Input -->
          <div class="input-field">
            <input
              type="text"
              placeholder="Enter your account name"
              class="form-input"
              v-model="formData.username"
            />
          </div>
          
          <!-- Email Input -->
          <div class="input-field">
            <input
              type="email"
              placeholder="Enter your email address"
              class="form-input"
              v-model="formData.email"
            />
          </div>
          
          <!-- Password Input -->
          <div class="password-field">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Enter your password"
              class="form-input"
              v-model="formData.password"
              ref="passwordInput"
            />
            <div class="eye-icon-wrapper" @click="togglePasswordVisibility">
              <div v-html="eyeIconSvg"></div>
            </div>
          </div>
          
          <!-- Confirm Password Input -->
          <div class="password-field">
            <input
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              placeholder="Confirm your password"
              class="form-input"
              v-model="formData.confirmPassword"
              ref="confirmPasswordInput"
            />
            <div class="eye-icon-wrapper" @click="toggleConfirmPasswordVisibility">
              <div v-html="eyeIconSvg"></div>
            </div>
          </div>
          
          <button class="registration-button" type="submit">Create Account</button>
          
          <p class="sign-in-prompt">
            Already have an account?
            <router-link to="/login" class="sign-in-link">Sign in now</router-link>
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      formData: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      isPasswordVisible: false,
      isConfirmPasswordVisible: false,
      eyeIconSvg: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon">
        <path d="M9.72023 12.7666C10.2254 12.7666 10.7098 12.5659 11.0671 12.2087C11.4242 11.8514 11.625 11.3669 11.625 10.8618C11.625 10.3567 11.4242 9.87214 11.0671 9.51493C10.7098 9.15772 10.2254 8.95703 9.72023 8.95703C9.21502 8.95703 8.73053 9.15772 8.37332 9.51493C8.01612 9.87214 7.81543 10.3567 7.81543 10.8618C7.81543 11.3669 8.01612 11.8514 8.37332 12.2087C8.73053 12.5659 9.21502 12.7666 9.72023 12.7666Z" fill="black"></path>
        <path d="M2.10107 10.8618C2.99631 8.6332 5.97726 7.05225 9.72014 7.05225C13.463 7.05225 16.4439 8.6332 17.3392 10.8618C16.4439 13.0903 13.463 14.6713 9.72014 14.6713C5.97726 14.6713 2.99631 13.0903 2.10107 10.8618Z" fill="black"></path>
      </svg>`
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
    toggleConfirmPasswordVisibility() {
      this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    },
    handleRegister() {
      // Kiểm tra mật khẩu xác nhận
      if (this.formData.password !== this.formData.confirmPassword) {
        alert("Passwork does not match!");
        return;
      }
      
      // Kiểm tra độ dài mật khẩu
      if (this.formData.password.length < 8) {
        alert("Passwork must have at least 8 characters!");
        return;
      }
      
      // Kiểm tra email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        alert("Invalid Email!");
        return;
      }
      
      // Tiến hành đăng ký
      console.log("Processing registration: ", this.formData);
      // TODO: Gửi yêu cầu API đăng ký
      // this.$axios.post('/api/register', this.formData);
    }
  }
}
</script>

<style scoped>
.registration-container {
  max-width: none;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: rgba(183, 124, 64, 0.1);
}

.registration-card {
  width: 420px;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.97);
}

.registration-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
}

.registration-subtitle {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  text-align: center;
  margin-bottom: 44px;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-field,
.password-field {
  position: relative;
  width: 380px;
}

.form-input {
  width: 100%;
  height: 60px;
  border: 2px solid #724e4e;
  border-radius: 8px;
  padding: 0 16px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  outline: none;
}

.eye-icon-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 16px;
  cursor: pointer;
}

.eye-icon {
  position: relative;
  width: 20px;
  height: 20px;
}

.registration-button {
  height: 56px;
  border-radius: 8px;
  border: none;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(229, 62, 62, 0.25);
  margin-top: 16px;
  background-color: #724e4e;
  transition: background-color 0.3s ease;
}

.registration-button:hover {
  background-color: #5d3e3e;
}

.sign-in-prompt {
  text-align: center;
  margin-top: 24px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #666;
}

.sign-in-link {
  color: #724e4e;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 991px) {
  .registration-container {
    max-width: 991px;
  }

  .registration-card {
    width: 100%;
    max-width: 420px;
  }
}

@media (max-width: 640px) {
  .registration-container {
    max-width: 640px;
  }

  .registration-card {
    padding: 32px 16px;
  }

  .registration-title {
    font-size: 32px;
  }

  .registration-subtitle {
    font-size: 16px;
  }

  .registration-button {
    font-size: 20px;
  }
}
</style>