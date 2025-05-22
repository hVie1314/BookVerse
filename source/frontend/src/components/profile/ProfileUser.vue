<template>
    <div class="profile-user-container">
        <Alert 
            v-model:show="alert.show" 
            :type="alert.type" 
            :title="alert.title" 
            :message="alert.message" 
        />
        <Nav v-if="!isStaffRoute" />
        <main class="profile-main">
            <div v-if="loading" class="loading-container">
              <div class="loading-card">
                <div class="loading-header">
                  <div class="loading-title-skeleton"></div>
                  <div class="loading-avatar-skeleton"></div>
                </div>
                
                <div class="loading-field-skeleton"></div>
                <div class="loading-field-skeleton"></div>
                <div class="loading-field-skeleton"></div>
                <div class="loading-field-skeleton"></div>
                
                <div class="loading-button-skeleton"></div>
                
                <div class="loading-overlay">
                  <div class="loading-spinner">
                    <div class="spinner-circle"></div>
                    <div class="spinner-circle-dot"></div>
                  </div>
                  <span class="loading-text">Đang tải thông tin...</span>
                </div>
              </div>
            </div>
            <div v-else-if="error" class="error-message">
                {{ error }}
                <div class="error-actions">
                    <button @click="$router.push('/login')" class="action-button">Đăng nhập</button>
                    <button @click="$router.push('/')" class="action-button">Về trang chủ</button>
                </div>
            </div>
           <ProfilePage 
              v-else 
              ref="profilePage"
              :user="userInfo" 
              :maintain-editing="maintainEditing"
              @update-profile="updateUserProfile"
              @password-error="showPasswordError"
          />
        </main>
        <Footer v-if="!isStaffRoute"  />
    </div>
</template>
  
<script>
import Nav from '../navbar/Nav.vue';
import Footer from '../footer/footer.vue';
import ProfilePage from './ProfilePage.vue';
import UserService from '@/services/UserService';
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue';
import {useToast} from 'vue-toastification';

export default {
  name: 'ProfileUser',
  components: {
    Nav,
    Footer,
    ProfilePage,
    Alert
  },
  setup() {
    const toast = useToast();
    return { toast };
  }, 
  data() {
    return {
      userInfo: null,
      loading: true,
      error: null,
      alert:{
        show: false,
        type: 'success',
        title: 'Thông báo',
        message: ''
      },
      maintainEditing: false // Biến này sẽ được sử dụng để kiểm soát chế độ chỉnh sửa
    }
  },
  computed: {
    // Thêm computed property để kiểm tra xem đang ở route staff/info hay không
    isStaffRoute() {
      return this.$route.path.includes('/staff/info');
    }
  },
  created() {
    this.maintainEditing = false;
    this.fetchUserData();
  },
  methods: {
    showPasswordError(message) {
      this.alert = {
        show: true,
        type: 'error',
        title: 'Mật khẩu không chính xác',
        message: message
      };
    },
    async fetchUserData() {
      try {
        this.loading = true;
        
        // Kiểm tra nếu người dùng đã đăng nhập
        const currentUser = AuthenticationService.getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
          this.error = "Vui lòng đăng nhập để xem thông tin cá nhân";
          this.loading = false;
          return;
        }
        
        // Lấy dữ liệu đầy đủ của người dùng từ API
        const response = await UserService.getUserById(currentUser.id);
        console.log("response của fetch info:", response);
        
        if (response.data && response.data.success) {
          // Lấy thông tin người dùng từ response
          this.userInfo = response.data.data || response.data.user;
        } else if (response.data && response.data.user) {
          // Trường hợp API trả về cấu trúc khác
          this.userInfo = response.data.user;
        } else if (response.data) {
          // Trường hợp API trả về dữ liệu người dùng trực tiếp
          this.userInfo = response.data;
        } else {
          this.error = "Không thể lấy thông tin người dùng";
        }
      } catch (error) {
        this.error = "Đã xảy ra lỗi khi tải thông tin người dùng";
        console.error("Error fetching user data:", error);
      } finally {
        this.loading = false;
      }
    },
    
    async updateUserProfile(updatedData) {
      try {
        const currentUser = AuthenticationService.getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi xác thực',
            message: 'Vui lòng đăng nhập để cập nhật thông tin'
          };
          return;
        }
        
        // Kiểm tra xem có thay đổi không
        if (Object.keys(updatedData).length === 0) {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Không có thay đổi',
            message: 'Không có thông tin nào được thay đổi'
          };
          return;
        }
        
        this.loading = true;
        console.log("Updating user with data:", updatedData);
        
        try {
          // Gọi API để cập nhật thông tin người dùng
          const response = await UserService.updateUserInfo(currentUser.id, updatedData);
          console.log("API response:", response);
          
          if (response && response.data && response.data.success) {
            // Trường hợp đổi mật khẩu thành công
            if (updatedData.password) {
              this.alert = {
                show: true,
                type: 'success',
                title: 'Đổi mật khẩu thành công',
                message: 'Mật khẩu đã được cập nhật, bạn sẽ được chuyển đến trang đăng nhập'
              };
              
              setTimeout(async () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                await AuthenticationService.logout();
                this.$router.push({
                  path: '/login',
                  query: { message: 'Vui lòng đăng nhập lại với mật khẩu mới' }
                });
              }, 1500);
              
              return;
            }

            // CẬP NHẬT THÔNG TIN USER BẰNG DỮ LIỆU MỚI TỪ API
            if (response.data.data) {
              // Cập nhật userInfo với dữ liệu trả về từ API
              this.userInfo = response.data.data;
              
              // Cập nhật thông tin trong localStorage
              const updatedUserData = { ...currentUser };
              if (updatedData.username) updatedUserData.username = response.data.data.username;
              if (updatedData.address) updatedUserData.address = response.data.data.address;
              if (updatedData.avatar) updatedUserData.avatar = response.data.data.avatar;
              localStorage.setItem('user', JSON.stringify(updatedUserData));
              
              // Thông báo cho ProfilePage cập nhật lại form với dữ liệu mới nhất
              if (this.$refs.profilePage) {
                this.$refs.profilePage.updateFormWithLatestData(response.data.data);
              }
            }
            
            // Hiển thị thông báo thành công
            this.toast.success('Cập nhật thông tin thành công');
            
            this.maintainEditing = false; // Đóng chế độ chỉnh sửa
          }
        } catch (error) {
          console.error("Error updating user profile:", error.response);
          console.log("thông điệp lỗi kiểu error.response.data: ", error.response?.data);

          if (error.response && error.response.data) {
            const errorData = error.response.data;
            const errorCode = errorData.errorCode;
            
            switch (errorCode) {
              case 'INVALID_OLD_PASSWORD':
                // console.log('đã đi vào case invalid_old_pass!');
                // this.alert = {
                //   show: true,
                //   type: 'error',
                //   title: 'Mật khẩu không chính xác',
                //   message: 'Mật khẩu hiện tại bạn nhập không chính xác'
                // };

                this.maintainEditing = true;
                // Thay đổi: không hiển thị alert mà gọi phương thức trên component con
                setTimeout(() => {
                  if (this.$refs.profilePage) {
                    console.log('Gọi setOldPasswordError và khôi phục form');
                    this.$refs.profilePage.setOldPasswordError('Mật khẩu hiện tại không đúng', false);
                  }
                }, 0);
                break;
                
              case 'OLD_PASSWORD_REQUIRED':
                if (this.$refs.profilePage) {
                  this.$refs.profilePage.setOldPasswordError('Vui lòng nhập mật khẩu hiện tại');
                } else {
                  this.alert = {
                    show: true,
                    type: 'error',
                    title: 'Lỗi cập nhật',
                    message: 'Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu'
                  };
                }
                break;
                
              case 'INVALID_PASSWORD':
                if (this.$refs.profilePage) {
                  this.$refs.profilePage.setPasswordError('Mật khẩu mới phải có ít nhất 8 ký tự');
                } else {
                  this.alert = {
                    show: true,
                    type: 'error',
                    title: 'Lỗi cập nhật',
                    message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
                  };
                }
                break;
                
              // Các case khác giữ nguyên
              case 'USER_ALREADY_EXISTS':
                this.alert = {
                  show: true,
                  type: 'error',
                  title: 'Lỗi cập nhật',
                  message: 'Tên đăng nhập đã được sử dụng bởi người dùng khác'
                };
                break;
                
              default:
                this.alert = {
                  show: true,
                  type: 'error',
                  title: 'Lỗi hệ thống',
                  message: errorData.message || 'Đã xảy ra lỗi khi cập nhật thông tin'
                };
            }
          } else {
            this.alert = {
              show: true,
              type: 'error',
              title: 'Lỗi kết nối',
              message: 'Không thể kết nối đến máy chủ, vui lòng thử lại sau'
            };
          }
          
          this.maintainEditing = true; // Giữ chế độ chỉnh sửa khi có lỗi
        }
      } finally {
        this.loading = false;
      }
    },
    // Thêm phương thức này vào methods

  }
}
</script>
  
<style scoped>

.staff-mode {
    background-color: transparent;
    padding-left: 280px; /* Để không bị đè bởi sidebar */
}

.staff-layout {
    margin-top: 20px;
    margin-bottom: 20px;
}
    .profile-user-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        background-color: rgb(244, 235, 225);
    }

    .profile-main {
        width: 100%;
        flex: 1;
        margin-top: 50px;
        margin-bottom: 50px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .loading-container, .error-message {
        width: 100%;
        max-width: 800px;
        padding: 30px;
        text-align: center;
        font-family: "Montserrat", sans-serif;
        font-size: 18px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        margin: 0 auto;
    }

    .loading-container {
        color: #4d2900;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        min-height: 200px;
    }

    .error-message {
        color: #ff3333;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }

    .error-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }

    .action-button {
        background-color: #4d2900;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .action-button:hover {
        background-color: #724e4e;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        .profile-main {
            margin-top: 30px;
            margin-bottom: 30px;
            padding: 0 15px;
        }
    }

    /* Thêm vào phần <style scoped> */

.loading-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.loading-card {
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  position: relative;
  box-shadow: 0 8px 20px rgba(77, 41, 0, 0.08);
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 15px;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(186, 148, 104, 0.25);
  border-top-color: #4d2900;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-circle-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  background-color: #4d2900;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgba(77, 41, 0, 0.5);
}

.loading-text {
  font-family: "Montserrat", sans-serif;
  color: #4d2900;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  margin-top: 10px;
}

/* Skeleton elements */
.loading-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.loading-title-skeleton {
  width: 250px;
  height: 40px;
  background: linear-gradient(90deg, #f0e5d8 25%, #f9f5f0 50%, #f0e5d8 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: skeleton-loading 1.5s infinite;
}

.loading-avatar-skeleton {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0e5d8 25%, #f9f5f0 50%, #f0e5d8 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.loading-field-skeleton {
  height: 55px;
  width: 100%;
  background: linear-gradient(90deg, #f0e5d8 25%, #f9f5f0 50%, #f0e5d8 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: skeleton-loading 1.5s infinite;
}

.loading-button-skeleton {
  height: 50px;
  width: 200px;
  margin: 30px auto 0;
  background: linear-gradient(90deg, #f0e5d8 25%, #f9f5f0 50%, #f0e5d8 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .loading-card {
    padding: 20px;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
  }
  
  .loading-title-skeleton {
    width: 180px;
    height: 35px;
  }
  
  .loading-avatar-skeleton {
    width: 100px;
    height: 100px;
  }
}
</style>