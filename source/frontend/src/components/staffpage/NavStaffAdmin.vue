<template>
  <nav class="sidebar">
    <!-- Logo ở chính giữa với liên kết đến trang chủ -->
    <router-link to="/" class="logo-link">
      <SidebarLogo />
    </router-link>
    
    <!-- Menu Items -->
    <div class="menu-items">
      <!-- Overview Button - Liên kết đến Overview -->
      <router-link to="/staff/overview" class="menu-item" active-class="active">
        <div class="menu-icon">
          <svg
            width="22"
            height="22"
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="menu-svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.5 0L0 13.125V17.5H2.4375V32.8125H9.75V21.875H17.0625V32.8125H36.5625V17.5H39V13.125L34.125 9.84375V2.1875H26.8125V4.92188L19.5 0ZM21.9375 21.875H29.25V28.4375H21.9375V21.875Z"
            ></path>
          </svg>
        </div>
        <span class="menu-text">Tổng quan</span>
      </router-link>
      
      <!-- ProductionIcon - Liên kết đến ProductManagement -->
      <router-link to="/staff/products" class="menu-item" active-class="active">
        <div class="menu-icon">
          <i class="fas fa-book"></i>
        </div>
        <span class="menu-text">Sản phẩm</span>
      </router-link>

      <template v-if="isAdmin">
        <!-- Quản lý người dùng -->
        <router-link to="/admin/users" class="menu-item" active-class="active">
          <div class="menu-icon">
            <i class="fas fa-users"></i>
          </div>
          <span class="menu-text">Người dùng</span>
        </router-link>
        
        <!-- Thống kê -->
        <router-link to="/admin/statistics" class="menu-item" active-class="active">
          <div class="menu-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <span class="menu-text">Thống kê</span>
        </router-link>
      </template>
      
      <!-- Thêm các menu item khác ở đây nếu cần -->
    </div>
    
    <!-- User và Logout ở cuối -->
    <div class="user-section">
      <!-- Thông tin người dùng - Thêm router-link -->
      <router-link to="/staff/info" class="user-info">
        <i class="fas fa-user"></i>
        <span>{{ userName }}</span>
      </router-link>
      
      <!-- Nút logout -->
      <div class="logout-button" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span>Đăng xuất</span>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import SidebarLogo from './SidebarLogo.vue';

export default {
  name: 'NavStaffAdmin',
  components: {
    SidebarLogo
  },
  data() {
    return {
      userName: "Admin"
    };
  },
  computed: {
    isAdmin() {
      const currentUser = AuthenticationService.getCurrentUser();
      return currentUser && currentUser.role === 'admin';
    }
  },
  created() {
    // Lấy thông tin người dùng hiện tại từ Authentication Service
    const currentUser = AuthenticationService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.username || "Admin";
    }
  },
  methods: {
    logout() {
      // Gọi hàm đăng xuất từ Authentication Service
      AuthenticationService.logout()
        .catch(error => {
          console.error('Lỗi khi đăng xuất:', error);
        });
    }
  }
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: #F4EBE1;
  display: flex;
  flex-direction: column;
  border-right: 2px solid rgba(77, 41, 0, 0.31);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.logo-link {
  text-decoration: none;
  transition: opacity 0.3s ease;
  padding-top: 39px;
  display: block;
}

.logo-link:hover {
  opacity: 0.9;
}

.menu-items {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  align-items: center;
}

/* Styling của các menu item */
.menu-item {
  display: flex;
  align-items: center;
  width: 100%; 
  height: 51px;
  text-decoration: none;
  padding: 0 20px;
  transition: all 0.3s ease;
  position: relative;
}

.menu-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  margin-right: 20px; /* Giảm khoảng cách từ 40px xuống 20px */
  flex-shrink: 0;
}

/* Style cho SVG icon */
.menu-svg {
  fill: #897B7B;
  width: 22px;
  height: 22px;
}

/* Style cho Font Awesome icon */
.menu-icon i {
  color: #897B7B;
  font-size: 22px; /* Đặt kích thước cụ thể cho font icon */
}

.menu-text {
  color: #897B7B;
  font-size: 20px;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
}

/* Style khi hover */
.menu-item:hover {
  background-color: #f5f0e8;
}

/* Active state styling */
.menu-item.active {
  background-color: #fff;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 7px;
  background-color: #4d2900;
}

.menu-item.active .menu-svg {
  fill: #4d2900;
}

.menu-item.active .menu-icon i {
  color: #4d2900;
}

.menu-item.active .menu-text {
  color: #4d2900;
  font-weight: bold;
}

.user-section {
  margin-top: auto;
  padding: 30px 20px;
  border-top: 1px solid rgba(77, 41, 0, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  color: #4d2900;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif; /* Thêm font-family */
}

.user-info:hover {
  opacity: 0.8;
  color: #6e3d00;
}

.user-info i {
  margin-right: 10px;
}

.logout-button {
  display: flex;
  align-items: center;
  color: #4d2900;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Montserrat", sans-serif; /* Thêm font-family */
}

.logout-button i {
  margin-right: 10px;
}

.logout-button:hover {
  opacity: 0.8;
}
</style>