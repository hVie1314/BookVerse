<template>
    <div class="app-container">
      <NavStaffAdmin />
      <div class="staff-content">
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
  background-color: #F4EBE1;
  font-family: "Montserrat", sans-serif;
}

.staff-content {
  flex: 1;
  padding: 30px;
  margin-left: 280px; /* Khoảng cách cho sidebar */
  font-family: "Montserrat", sans-serif;
}

.welcome-banner {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: "Montserrat", sans-serif;
}

.welcome-banner h1 {
  color: #4d2900;
  font-size: 28px;
  margin-bottom: 15px;
  font-family: "Montserrat", sans-serif;
}

.welcome-banner p {
  color: #666;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
}
</style>