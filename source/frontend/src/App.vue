<template>
  <div id="app">
    <Alert 
      v-model:show="globalAlert.show" 
      :type="globalAlert.type" 
      :title="globalAlert.title" 
      :message="globalAlert.message" 
    />
    <!-- Loading overlay -->
    <transition name="fade-out">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </transition>
    
    <!-- Content only shows when loading is done -->
    <transition name="fade-in">
      <div v-if="!loading" class="content-container">
        <router-view />
      </div>
    </transition>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService';
import eventBus from './eventBus';
import Alert from '@/components/Alert.vue';
export default {
  name: 'App',
  components: {
    Alert
  },
  data() {
    return {
      loading: false,
      loadingStartTime: 0,
      minLoadingTime: 800 ,// Thời gian tối thiểu hiển thị loading (ms)
      isLoggedIn: false,
      globalAlert: {
        show: false,
        type: 'success',
        title: '',
        message: ''
      }
    }
  },
  created() {
    this.isLoggedIn = AuthenticationService.isLoggedIn();
    
    // Lắng nghe sự kiện đăng xuất
    eventBus.on('logout', this.handleLogoutEvent);

    // Trong phần lắng nghe sự kiện của App.vue
    eventBus.on('show-alert', (alertData) => {
      this.globalAlert = { ...alertData, show: true };
      
      // Chỉ tự động đóng các thông báo thành công về đăng nhập
      if (alertData.type === 'success' && 
          alertData.message && 
          (alertData.message.includes('đăng nhập thành công') || 
          alertData.message.includes('đăng xuất thành công'))) {
        setTimeout(() => {
          this.globalAlert.show = false;
        }, 5000);
      }
    });

    this.$router.beforeEach((to, from, next) => {
      // Bắt đầu hiệu ứng loading và lưu thời điểm bắt đầu
      this.loading = true;
      this.loadingStartTime = Date.now();
      next();
    });
    
    this.$router.afterEach(() => {
      // Tính thời gian đã trôi qua và thời gian còn lại cần hiển thị
      const elapsedTime = Date.now() - this.loadingStartTime;
      const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
      
      // Đảm bảo hiệu ứng loading hiển thị đủ thời gian tối thiểu
      setTimeout(() => {
        this.loading = false;
      }, remainingTime);
    });
  },
  beforeUnmount() {
    // Clean up listener
    eventBus.off('logout', this.handleLogoutEvent);
    eventBus.off('show-alert');
  },
  methods: {
    handleLogoutEvent() {
      console.log("App nhận sự kiện logout");
      this.isLoggedIn = false;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Container cho nội dung chính */
.content-container {
  width: 100%;
  min-height: 100vh;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 250, 245, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Spinner animation */
.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(77, 41, 0, 0.1);
  border-top: 6px solid #4d2900;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Transition cho loading overlay */
.fade-out-enter-active, .fade-out-leave-active {
  transition: opacity 0.3s;
}
.fade-out-leave-to {
  opacity: 0;
}

/* Transition cho nội dung */
.fade-in-enter-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-in-enter {
  opacity: 0;
  transform: translateY(10px);
}
</style>