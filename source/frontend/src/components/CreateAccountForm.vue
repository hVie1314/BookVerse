<template>
  <div>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <main class="account-container">
    <section class="form-card">
      <h1 class="form-title">Create Account</h1>
      <p class="form-subtitle">Sign up to get started</p>
      <form class="signup-form">
        <input
          type="text"
          placeholder="Enter your account name"
          class="form-input"
          aria-label="Account name"
        />
        <input
          type="email"
          placeholder="Enter your email address"
          class="form-input"
          aria-label="Email address"
        />
        <PasswordInput placeholder="Enter your password" />
        <PasswordInput placeholder="Confirm your password" />
        <button type="submit" class="submit-button">Create Account</button>
        <p class="login-prompt">
          Already have an account?
          <span class="login-link">Sign in now</span>
        </p>
      </form>
    </section>
    </main>
  </div>
</template>

<script>
import PasswordInput from './PasswordInput.vue';

export default {
  name: 'CreateAccountForm',
  components: {
    PasswordInput
  }
};
</script>

<style scoped>
.account-container {
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

.form-card {
  width: 420px;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.97);
}

.form-title {
  color: #724e4e;
  font-family: "Poppins", sans-serif;
  font-size: 38px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
}

.form-subtitle {
  color: #666;
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  text-align: center;
  margin-bottom: 44px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.submit-button {
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
}

.login-prompt {
  text-align: center;
  margin-top: 24px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #666;
}

.login-link {
  color: #724e4e;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 991px) {
  .account-container {
    max-width: 991px;
  }

  .form-card {
    width: 90%;
    max-width: 420px;
  }
}

@media (max-width: 640px) {
  .account-container {
    max-width: 640px;
  }

  .form-card {
    width: 100%;
    padding: 32px 16px;
  }

  .form-title {
    font-size: 32px;
  }

  .form-subtitle {
    font-size: 16px;
  }

  .submit-button {
    font-size: 20px;
  }
}
</style>
