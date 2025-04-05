<template>
  <div class="password-field">
    <input
      type="password"
      :placeholder="placeholder"
      class="form-input"
      :aria-label="placeholder"
      v-model="password"
      ref="passwordInput"
    />
    <div class="eye-icon-wrapper" @click="togglePasswordVisibility">
      <div v-html="eyeIconSvg"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PasswordInput",
  props: {
    placeholder: {
      type: String,
      default: "Enter your password",
    },
  },
  data() {
    return {
      password: "",
      isPasswordVisible: false,
      eyeIconSvg: `<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="eye-icon" style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; cursor: pointer">
<path d="M9.72023 12.7666C10.2254 12.7666 10.7098 12.5659 11.0671 12.2087C11.4242 11.8514 11.625 11.3669 11.625 10.8618C11.625 10.3567 11.4242 9.87214 11.0671 9.51493C10.7098 9.15772 10.2254 8.95703 9.72023 8.95703C9.21502 8.95703 8.73053 9.15772 8.37332 9.51493C8.01612 9.87214 7.81543 10.3567 7.81543 10.8618C7.81543 11.3669 8.01612 11.8514 8.37332 12.2087C8.73053 12.5659 9.21502 12.7666 9.72023 12.7666Z" fill="black"></path>
<path d="M2.10107 10.8618C2.99631 8.6332 5.97726 7.05225 9.72014 7.05225C13.463 7.05225 16.4439 8.6332 17.3392 10.8618C16.4439 13.0903 13.463 14.6713 9.72014 14.6713C5.97726 14.6713 2.99631 13.0903 2.10107 10.8618Z" fill="black"></path>
</svg>`,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
      if (this.$refs.passwordInput) {
        this.$refs.passwordInput.type = this.isPasswordVisible
          ? "text"
          : "password";
      }
    },
  },
};
</script>

<style scoped>
.password-field {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  height: 59px;
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
}
</style>
