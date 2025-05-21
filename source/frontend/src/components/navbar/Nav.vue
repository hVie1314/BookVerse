<template>
  <header class="header-container">
    <div class="header-content">
      <router-link to="/" class="logo-section">
        <div class="logo-icon-wrapper">
          <svg
            width="62"
            height="64"
            viewBox="0 0 62 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="logo-icon"
          >
            <g clip-path="url(#clip0_1_245)">
              <path d="M57.577 22.7112C57.3262 20.7657 57.2909 17.4148 59.0415 16.2896C59.0727 16.269 59.0961 16.2392 59.1234 16.2136C60.5547 15.7411 61.5451 15.0779 60.7676 14.1856L39.6553 7.61902L5.46961 12.5252C5.46961 12.5252 1.55492 13.1028 1.90463 19.381C2.09447 22.798 3.13267 24.4761 4.04062 25.302L1.23537 26.1746C0.456762 27.067 1.44704 27.7303 2.87844 28.2021C2.90564 28.2285 2.92858 28.2581 2.96041 28.2787C4.70987 29.4048 4.6762 32.7553 4.42456 34.7013C-1.86037 36.5434 0.395702 37.1438 0.395702 37.1438L1.77436 37.4881C0.804619 38.3927 -0.158465 40.1081 0.0219401 43.3614C0.371833 49.6384 3.58729 50.0716 3.58729 50.0716L25.9582 57.5775L59.7244 49.1349C59.7244 49.1349 61.9812 48.5336 55.6946 46.6913C55.4419 44.7484 55.4067 41.3983 57.1603 40.2693C57.1925 40.2492 57.216 40.2188 57.2421 40.1936C58.6735 39.7211 59.663 39.0585 58.8853 38.1662L57.4176 37.7087C58.3965 37.0994 59.8667 35.5071 60.0971 31.3708C60.256 28.5257 59.537 26.8594 58.7047 25.8784L61.6056 25.1537C61.6058 25.1549 63.8626 24.5536 57.577 22.7112ZM29.3335 22.6308L35.0118 21.4262L54.2009 17.3556L57.0598 16.7486C56.1463 18.4745 56.1846 20.8364 56.3358 22.3545C56.3689 22.6979 56.407 23.0115 56.444 23.2499L53.3148 24.053L29.0949 30.2725L29.3335 22.6308ZM4.94227 28.7396L7.80081 29.3466L26.2293 33.2571L27.8392 33.5975L32.6672 34.6218L32.9054 42.2637L8.01248 35.8707L5.55842 35.2412C5.5945 35.0025 5.63262 34.6892 5.66722 34.3448C5.81746 32.8279 5.85651 30.4655 4.94227 28.7396ZM3.83172 19.0788C3.79712 17.4089 4.08539 16.2012 4.66806 15.5873C5.03886 15.1954 5.47645 15.1138 5.77657 15.1138C5.93514 15.1138 6.04931 15.1366 6.05708 15.1366L20.7868 20.0936L28.1357 22.5668L27.8946 30.262L7.27809 24.2956L6.19012 23.981C6.15015 23.9694 6.09594 23.9613 6.05412 23.9594C5.96919 23.9531 3.93089 23.7595 3.83172 19.0788ZM26.0115 54.2436L4.30762 47.9624C4.26746 47.9503 4.21381 47.9423 4.17199 47.9402C4.08558 47.9343 2.04636 47.7408 1.94774 43.0613C1.91258 41.3893 2.20234 40.1828 2.78389 39.5683C3.15562 39.1764 3.5934 39.0948 3.89296 39.0948C4.0519 39.0948 4.1657 39.1168 4.17402 39.1168C4.17402 39.1168 4.17495 39.1168 4.17402 39.1168L26.2511 46.5482L26.0115 54.2436ZM54.4516 46.3349C54.4858 46.6794 54.524 46.9925 54.561 47.2312L27.2112 54.2545L27.4503 46.6126L33.2974 45.3716L34.161 45.5873L37.3975 44.5014L52.3167 41.3368L55.1767 40.7294C54.2623 42.4551 54.3003 44.8179 54.4516 46.3349ZM55.9581 35.9492C55.9084 35.9504 55.8586 35.9573 55.8118 35.9725L53.7491 36.5687L34.1084 42.2536L33.8683 34.5584L40.3121 32.3888L55.9152 27.1361C55.9172 27.1352 56.736 26.9474 57.337 27.5783C57.9187 28.1922 58.2074 29.3999 58.1733 31.0698C58.0715 35.7489 56.0323 35.9433 55.9581 35.9492Z" fill="#4D2900"></path>
            </g>
            <defs>
              <clipPath id="clip0_1_245">
                <rect width="62" height="64" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
        <h1 class="brand-name">BOOKVERSE</h1>
      </router-link>
  
      <div class="search-section">
        <form @submit.prevent="handleSearch" class="search-form">
          <div class="search-bar">
            <!-- Biểu tượng tìm kiếm ở bên trái -->
            <i class="fa-solid fa-magnifying-glass search-icon-left"
              @click="handleSearch"
              :class="{ 'search-hover': searchIconHovered }"
              @mouseenter="searchIconHovered = true"
              @mouseleave="searchIconHovered = false"
            ></i>
            
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm sách hoặc tác giả..." 
              class="search-input"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
            
            <!-- Nút xóa (chỉ hiển thị khi có nội dung) -->
            <div v-if="searchQuery" class="clear-button-container" @click="clearSearch">
              <div class="clear-button">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <span class="clear-label">Xóa</span>
            </div>
            
            <!-- Nút submit tìm kiếm (ẩn đi vì đã có icon bên trái) -->
            <button type="submit" class="search-button" style="display: none;">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </form>
      </div>
  
      <nav class="menu-section">
        <div class="icon-container" @click="navigateToWishlist">
          <i class="fa-regular fa-heart fa-xl"></i>
          <span class="icon-label">Yêu thích</span>
        </div>
        
        <div class="user-menu-container" 
            @mouseover="handleMouseOver" 
            @mouseleave="handleMouseLeave"
            >
          <i class="fa-regular fa-user fa-xl" 
            :class="{ 'fa-bounce': userIconHovered }"
            @mouseenter="userIconHovered = true"
            @mouseleave="userIconHovered = false"
            @click="handleUserIconClick"></i>
          <span class="icon-label" v-if="isLoggedIn">{{ getUserName() }}</span>
          <span class="icon-label" v-else>Đăng nhập</span>
          <!-- Menu AuthButton sẽ hiển thị khi hover -->
          <div class="auth-popup" v-if="showAuthMenu">
            <AuthButton 
              :isLoggedIn="isLoggedIn" 
              @login="goToLogin" 
              @register="goToRegister"
              @profile="goToProfile"
              @logout="handleLogout" 
            />
          </div>
        </div>
        <div class="icon-container" @click="navigateToCart">
          <!-- <div class="cart-icon-container"> -->
          <i class="fa-regular fa-cart-shopping fa-xl"></i>
          <div v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</div>
          <!-- </div> -->
          <span class="icon-label label-cart">Giỏ hàng</span>
        </div>
        <div class="icon-container-menu" @click="handleBarsClick">
          <i class="fa-solid fa-bars fa-xl"
            :class="{ 'fa-beat-fade': menuIconHovered }"
            @mouseenter="menuIconHovered = true"
            @mouseleave="menuIconHovered = false"
          ></i>
        </div>
      </nav>
      <UserMenu v-if="showUserMenu" @close="showUserMenu = false" />
    </div>
  </header>
  <i ref="cartIcon" class="fa-regular fa-cart-shopping fa-xl"></i>
</template>

<script>
import AuthButton from './AuthButton.vue';
import AuthenticationService from '@/services/AuthenticationService';
import UserMenu from '@/components/menu/UserMenu.vue';
import CartService from '@/services/CartService';
import eventBus from '@/eventBus.js';

export default {
  name: 'NavBar', // Sửa tên component thành NavBar (từ ghép)
  components: {
    AuthButton,// Lazy load AuthButton component
    UserMenu, // Lazy load UserMenu component
  },
  data() {
    return {
      showAuthMenu: false, // Trạng thái hiển thị menu auth
      menuTimeout: null,
      isLoggedIn: false, // Trạng thái đăng nhập
      showUserMenu: false, // Trạng thái hiển thị menu người dùng
      userIconHovered: false, // Trạng thái hover icon người dùng
      menuIconHovered: false, // Trạng thái hover icon menu
      searchQuery: '', // Trạng thái tìm kiếm
      searchFocused: false, // Trạng thái focus vào ô tìm kiếm
      searchIconHovered: false, // Trạng thái hover icon tìm kiếm
      cartItemCount: 0, // Số lượng sản phẩm trong giỏ hàng
    };
  },
  created() {
    // Kiểm tra trạng thái đăng nhập khi component được tạo
    this.isLoggedIn = AuthenticationService.isLoggedIn();
    eventBus.on('logout', this.handleLogoutEvent);
    this.cartAnimationHandler = () => this.animateCartIcon();
    eventBus.on('cart-animation', this.cartAnimationHandler);
  },
  beforeUnmount() {
    // Loại bỏ listener khi component được hủy để tránh memory leak
    eventBus.off('cart-updated', this.getCartItemCount);
    eventBus.off('cart-animation', this.cartAnimationHandler);
  },
  mounted() {
    // Kiểm tra trạng thái đăng nhập khi component được gắn vào DOM
    this.checkLoginStatus();
    this.getCartItemCount();
    
    // Đăng ký sự kiện cập nhật giỏ hàng
    eventBus.on('cart-updated', this.getCartItemCount);
  },
  activated() {
    // Kiểm tra trạng thái đăng nhập khi component được kích hoạt (nếu sử dụng keep-alive)
    this.checkLoginStatus();
  },
  methods: {
   animateCartIcon() {
      // Lấy ra icon giỏ hàng trong thanh navigation
      const cartIcon = document.querySelector('.icon-container .fa-cart-shopping');
      if (!cartIcon) {
        console.log('Không tìm thấy icon giỏ hàng!');
        return;
      }
      
      // Xóa class fa-shake nếu đã có
      cartIcon.classList.remove('fa-shake');
      
      // Thêm class fa-shake để tạo hiệu ứng rung
      setTimeout(() => {
        cartIcon.classList.add('fa-shake');
        
        // Đặt timer để xóa hiệu ứng sau 2 giây
        setTimeout(() => {
          cartIcon.classList.remove('fa-shake');
        }, 2000);
      }, 10);
    },
      navigateToWishlist() {
          this.$router.push({
              name: 'category',
              query: { wishlist: 'true' }
          });
      },
      checkLoginStatus() {
        // Kiểm tra trạng thái đăng nhập
        this.isLoggedIn = AuthenticationService.isLoggedIn();
      },
      handleMouseOver() {
        clearTimeout(this.menuTimeout);
        this.checkLoginStatus(); // Kiểm tra trạng thái đăng nhập khi hover
        this.showAuthMenu = true;
      },
      handleMouseLeave() {
        // Trì hoãn ẩn menu để người dùng có thời gian click
        this.menuTimeout = setTimeout(() => {
          this.showAuthMenu = false;
        }, 300);
      },
      goToLogin() {
        console.log("Nút đăng nhập được nhấn");
        try {
          this.$router.push('/login');
        } catch (error) {
          console.error("Lỗi khi chuyển hướng:", error);
        }
      },
      goToRegister() {
        this.$router.push('/register'); // Chuyển hướng đến trang đăng ký
      },
      goToProfile() {
        this.$router.push('/profile'); // Chuyển hướng đến trang thông tin cá nhân
      },
      handleLogoutEvent() {
        console.log("Nhận sự kiện logout từ EventBus");
        this.isLoggedIn = false;
        this.showAuthMenu = false;
        this.showUserMenu = false;
      },
      async handleLogout() {
        try {
          await AuthenticationService.logout();
          this.isLoggedIn = false;
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          window.location.reload();
        }
      },
      getUserName() {
        // Lấy tên người dùng từ AuthenticationService
        const userData = AuthenticationService.getCurrentUser();
        return userData ? userData.username : 'Tài khoản';
      },
      handleUserIconClick() {
      // Kiểm tra trạng thái đăng nhập hiện tại
        this.checkLoginStatus();
        
        // Chuyển hướng dựa trên trạng thái đăng nhập
        if (this.isLoggedIn) {
          // Nếu đã đăng nhập, chuyển đến trang profile
          console.log("Chuyển hướng đến trang profile");
          this.$router.push('/profile');
        } else {
          // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
          console.log("Chuyển hướng đến trang đăng nhập");
          this.$router.push('/login');
        }
      },
      handleBarsClick() {
        // Kiểm tra trạng thái đăng nhập
        this.checkLoginStatus();
        
        // Kiểm tra nếu đã đăng nhập và có quyền user
        if (this.isLoggedIn) {
          const userData = AuthenticationService.getCurrentUser();
          if (userData && userData.role === 'user') {
            // Hiển thị hoặc ẩn UserMenu
            this.showUserMenu = !this.showUserMenu;
          } else {
            // Nếu không phải user, có thể hiển thị menu khác hoặc thông báo
            console.log("Bạn không có quyền truy cập menu này");
          }
        } else {
          // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
          this.$router.push('/login');
        }
      },
      handleSearch() {
        if (this.searchQuery.trim()) {
          // Chuyển hướng đến trang category với query tìm kiếm
          const searchIcon = document.querySelector('.search-icon-left');
          if (searchIcon) {
            searchIcon.classList.add('searching');
            
            // Xóa class sau khi animation hoàn thành
            setTimeout(() => {
              searchIcon.classList.remove('searching');
            }, 500);
          }
          this.$router.push({
            name: 'category',
            query: { search: this.searchQuery.trim() }
          });
          
          // Reset searchQuery sau khi tìm kiếm
          this.searchQuery = '';
        }else {
          // Focus vào input nếu không có query
          this.$nextTick(() => {
            const searchInput = document.querySelector('.search-input');
            if (searchInput) searchInput.focus();
          });
        }
      },
      clearSearch() {
        this.searchQuery = ''; // Xóa nội dung tìm kiếm
        // Focus lại vào ô input sau khi xóa
        this.$nextTick(() => {
          const searchInput = document.querySelector('.search-input');
          if (searchInput) searchInput.focus();
        });
      },
      async getCartItemCount() {
        try {
          let cartData = null;
          
          if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            const response = await CartService.getUserCart(userId);
            cartData = response.data;
          } else {
            const guestCartId = localStorage.getItem('guestCartId');
            if (guestCartId) {
              const response = await CartService.getGuestCart(guestCartId);
              cartData = response.data;
            }
          }
          
          // Kiểm tra nhiều cấu trúc dữ liệu có thể có
          if (cartData && cartData.items && Array.isArray(cartData.items)) {
            // Đếm số lượng sản phẩm riêng biệt, không phải tổng số lượng
            this.cartItemCount = cartData.items.length;
          } else if (cartData && cartData.products && Array.isArray(cartData.products)) {
            this.cartItemCount = cartData.products.length;
          } else if (cartData && cartData.cart && cartData.cart.items) {
            this.cartItemCount = cartData.cart.items.length;
          } else if (cartData && cartData.data && cartData.data.products && Array.isArray(cartData.data.products)) {
            this.cartItemCount = cartData.data.products.length;
          } else {
            this.cartItemCount = 0;
            console.log("No items in cart or invalid cart data structure:", cartData);
          }
        } catch (error) {
          this.cartItemCount = 0;
        }
      },
      // Method để chuyển đến trang giỏ hàng
      navigateToCart() {
        this.$router.push('/cart');
      }
  },
  // Kiểm tra trạng thái đăng nhập khi route thay đổi
  watch: {
    '$route'() {
      this.checkLoginStatus();
      this.getCartItemCount(); // Cập nhật lại số lượng khi chuyển trang
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap');

.header-container {
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: rgb(244, 235, 225);
}

.header-content{
  display: flex ;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0px;
  width: 85%;
  padding: 0 20px;
  box-sizing: border-box;
}

.logo-section {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-top: 25px;
  transition: all 0.3s ease;
}

.logo-section:hover {
  transform: scale(1.05);
}

.logo-section:hover .brand-name {
  color: #724e4e;
  text-shadow: 0px 2px 4px rgba(114, 78, 78, 0.2);
}

.logo-icon-wrapper {
  transition: transform 0.4s ease;
}

.logo-section:hover .logo-icon-wrapper {
  transform: rotate(5deg);
  filter: drop-shadow(0px 3px 5px rgba(77, 41, 0, 0.3));
}

.brand-name {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
  font-size: 30px;
  color: #4d2900;
  margin-left: 10px;
  margin-top: 0;
  margin-bottom: 0;
  text-decoration: none;
}

.search-section {
  flex: 1; /* Cho phép phần tìm kiếm mở rộng */
  max-width: 600px; /* Giới hạn chiều rộng tối đa */
  margin: 0 20px; /* Căn chỉnh khoảng cách */
  margin-top: 30px;
}

.search-icon {
  width: 445px;
  height: 39px;
}

.menu-section {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 20px;
  color: rgba(57, 31, 0, 1);
}

.menu-icon {
  width: 184px;
  height: 35px;
}

.icon-container, .user-menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.icon-label {
  font-size: 12px;
  margin-top: 25px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: #4d2900;
  text-align: center;
}

/* Style cho popup menu */
.auth-popup {
  position: absolute;
  top: 100%;
  right: -20px;
  z-index: 1000;
  margin-top: 10px;
}

.icon-container, .user-menu-container {
  margin-top: 40px;
}

@media (max-width: 991px) {
  .search-section {
    width: 300px;
  }

  .search-icon {
    width: 300px;
  }
}

@media (max-width: 640px) {
  .search-section {
    display: none;
  }
}

/* Hiệu ứng hover cho icon-container (heart và cart) */
.icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.icon-container:hover {
  transform: translateY(-4px);
}

.icon-container:hover i {
  color: #724e4e;
  filter: drop-shadow(0 0 2px rgba(114, 78, 78, 0.3));
}

.icon-container:hover .icon-label {
  color: #724e4e;
  font-weight: 700;
}

/* Hiệu ứng riêng cho user-menu-container */
.user-menu-container {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 1000;
}


.user-menu-container:hover {
  transform: translateY(-4px);
}

.user-menu-container:hover i {
  color: #724e4e;
  filter: drop-shadow(0 0 2px rgba(114, 78, 78, 0.3));
}

.user-menu-container:hover .icon-label {
  color: #724e4e;
  font-weight: 700;
}

/* Hiệu ứng indicator */
.icon-container::after,
.user-menu-container::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 0;
  height: 3px;
  background-color: #724e4e;
  transition: all 0.3s ease;
  transform: translateX(-50%);
  opacity: 0;
  border-radius: 3px;
}

.icon-container:hover::after,
.user-menu-container:hover::after {
  width: 60%;
  opacity: 1;
}

/* Thêm hiệu ứng cho icons */
i.fa-heart, 
i.fa-cart-shopping,
i.fa-user {
  transition: transform 0.3s ease, color 0.3s ease, filter 0.3s ease;
}

i.fa-heart:hover {
  transform: scale(1.1) translateY(-2px);
  animation: heartBeat 1.5s infinite;
}

i.fa-cart-shopping:hover {
  transform: scale(1.1) rotate(5deg);
}

i.fa-user:hover {
  transform: scale(1.1);
}

i.fa-heart, i.fa-cart-shopping, i.fa-user, i.fa-bars {
  position: relative;
  transition: transform 0.3s ease, color 0.3s ease, filter 0.3s ease;
  /* Thuộc tính này đảm bảo icon luôn giữ không gian của nó */
  transform-origin: center center;
  z-index: 1;
  display: inline-block; /* Đảm bảo transform không ảnh hưởng đến layout */
  will-change: transform; /* Tối ưu hiệu suất cho animation */
}

/* Sửa hiệu ứng hover cho từng icon để không đẩy layout */
i.fa-heart:hover {
  transform: scale(1.1) translateY(-2px);
  animation: heartBeat 1.5s infinite;
  z-index: 2;
}

i.fa-cart-shopping:hover {
  transform: scale(1.1) rotate(5deg);
  z-index: 2;
}

i.fa-user:hover {
  transform: scale(1.1);
  z-index: 2;
}

/* Đảm bảo container của icon giữ nguyên kích thước và vị trí */
.icon-container, .user-menu-container {
  /* Giữ nguyên các thuộc tính hiện có */
  transform-style: preserve-3d; /* Tối ưu hiệu ứng 3D */
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.15) translateY(-2px);
  }
  30% {
    transform: scale(1) translateY(0);
  }
  45% {
    transform: scale(1.1) translateY(-1px);
  }
  60% {
    transform: scale(1);
  }
}

/* Hiệu ứng cho icon-label */
.icon-label {
  font-size: 12px;
  margin-top: 25px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: #4d2900;
  text-align: center;
  transition: color 0.3s ease, font-weight 0.3s ease;
}

i.fa-bars{
  cursor: pointer;
}

.search-form {
  width: 100%;
}

.search-bar {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(105, 103, 100, 0.59);
  padding: 0 10px;
}

.search-icon-left {
  color: #4d2900;
  font-size: 18px;
  margin-right: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  height: 39px;
  border: none;
  background: transparent;
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  color: #4d2900;
  padding: 0 40px 0 5px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(0, 0, 0, 0.35);
}

.search-icon-left.search-hover,
.search-icon-left:hover {
  color: #724e4e;
  transform: scale(1.2);
  filter: drop-shadow(0 0 2px rgba(114, 78, 78, 0.3));
}

/* Hiệu ứng khi click */
.search-icon-left:active {
  transform: scale(0.9);
  transition: transform 0.1s ease;
}

/* Thêm animation khi thực hiện tìm kiếm */
@keyframes searchPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.search-icon-left.searching {
  animation: searchPulse 0.5s ease-in-out;
}

.search-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #4d2900;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
  transition: transform 0.3s ease;
}

.search-button:hover {
  transform: scale(1.1);
  color: #724e4e;
}

.clear-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #e0e0e0;
}

.clear-button:hover {
  background-color: #dc5d72; /* Màu đỏ khi hover */
}

.clear-button i {
  font-size: 14px;
  color: #333; /* Màu mặc định */
}

.clear-button:hover i {
  color: #ffffff; /* Màu trắng khi hover */
}

.clear-button-container {
  position: absolute;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 10;
}

/* Style cho label "Xóa" */
.clear-label {
  font-size: 12px;
  margin-top: 12px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  color: transparent; /* Ban đầu trong suốt */
  text-align: center;
  transition: color 0.3s ease, transform 0.3s ease;
  position: absolute;
  top: 100%;
  transform: translateY(-5px);
  opacity: 0;
  pointer-events: none; /* Không can thiệp vào các sự kiện hover */
}

.clear-button-container:hover .clear-label {
  color: #dc5d72; /* Màu chữ "Xóa" khi hiện lên */
  transform: translateY(0); 
  opacity: 1;
}

/* Điều chỉnh vị trí thanh tìm kiếm để có không gian cho label */
.search-bar {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(105, 103, 100, 0.59);
  padding: 0 10px;
  margin-bottom: 20px; /* Thêm margin để có không gian cho chữ "Xóa" */
}

.cart-icon-container {
  position: relative;
  width: 24px; /* Kích thước cố định cho container */
  height: 24px; /* Kích thước cố định cho container */
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -20px;
  right: -2px;
  background-color: #f84c4c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: badge-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  z-index: 2; /* Đảm bảo badge hiển thị trên các phần tử khác */
}

/* Đảm bảo icon cart có vị trí nhất quán */
.fa-cart-shopping {
  display: block;
  position: relative;
  z-index: 1;
}

@keyframes badge-pop {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Hiệu ứng khi hover vào icon giỏ hàng */
.icon-container:hover .cart-badge {
  transform: scale(1.2);
  background-color: #ff3333;
}


</style>
