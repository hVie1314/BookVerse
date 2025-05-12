<template>
    <div class="app-container">
      <NavStaffAdmin />
      <div class="staff-content">
        <div class="welcome-banner">
          <h1>Chào mừng đến với Trang Quản lý BookVerse</h1>
          <p>Vui lòng chọn một chức năng từ menu bên trái để bắt đầu.</p>
        </div>
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import NavStaffAdmin from './NavStaffAdmin.vue';
  
  export default {
    name: 'StaffLayout',
    components: {
      NavStaffAdmin
    }
  }
  </script>
  
  <style>
  /* Global styles */
  body {
    margin: 0;
    padding: 0;
    font-family: "Montserrat", sans-serif;
  }
  
  .app-container {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: rgb(244, 235, 225);
  }
  
  .staff-content {
    flex: 1;
    padding: 30px;
    margin-left: 280px; /* Khoảng cách cho sidebar */
  }
  
  .welcome-banner {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .welcome-banner h1 {
    color: #4d2900;
    font-size: 28px;
    margin-bottom: 15px;
  }
  
  .welcome-banner p {
    color: #666;
    font-size: 16px;
  }
  </style>
