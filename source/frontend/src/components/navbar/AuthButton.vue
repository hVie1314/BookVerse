<template>
    <div class="auth-container">
      <button @click="$emit('login')" class="auth-button login-button">Đăng nhập</button>
      <button @click="$emit('register')" class="auth-button register-button">Đăng ký</button>
    </div>
  </template>
  
  <style scoped>
  .auth-container {
    max-width: none;
    margin-left: auto;
    margin-right: auto;
    width: 321px;
    height: 139px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    gap: 13px;
    background-color: #fffaf5;
  }
  
  .auth-button {
    width: 270px;
    height: 47px;
    border-radius: 8px;
    font-family: "Montserrat", sans-serif;
    font-size: 20px;
    font-weight: 900;
    line-height: 39px;
    cursor: pointer;
    border: none;
  }
  
  .login-button {
    background-color: #4d2900;
    color: #fffaf5;
  }
  
  .register-button {
    border: 2px solid #4d2900;
    background-color: #fffaf5;
    color: #4d2900;
  }
  
  @media (max-width: 991px) {
    .auth-container {
      max-width: 991px;
      width: 100%;
      padding: 20px;
    }
  
    .auth-button {
      width: 100%;
    }
  }
  
  @media (max-width: 640px) {
    .auth-container {
      max-width: 640px;
      padding: 16px;
    }
  
    .auth-button {
      width: 100%;
    }
  }
  </style>
  
  <script>
  export default {
    name: "AuthButtons",
    emits: ["login", "register"],
  };
  </script>
  