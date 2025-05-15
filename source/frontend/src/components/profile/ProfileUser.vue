<template>
    <div class="profile-user-container">
        <Alert 
            v-model:show="alert.show" 
            :type="alert.type" 
            :title="alert.title" 
            :message="alert.message" 
        />
        <Nav />
        <main class="profile-main">
            <div v-if="loading" class="loading-container">
                <i class="fa-solid fa-spinner fa-spin"></i> Đang tải thông tin...
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
            />
        </main>
        <Footer />
    </div>
</template>
  
<script>
import Nav from '../navbar/Nav.vue';
import Footer from '../footer/footer.vue';
import ProfilePage from './ProfilePage.vue';
import UserService from '@/services/UserService';
import AuthenticationService from '@/services/AuthenticationService';
import Alert from '@/components/Alert.vue'

export default {
  name: 'ProfileUser',
  components: {
    Nav,
    Footer,
    ProfilePage,
    Alert
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
  created() {
    this.maintainEditing = false;
    this.fetchUserData();
  },
  methods: {
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
        console.log("User data response:", response);
        
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
        
        // Gọi API để cập nhật thông tin người dùng
        const response = await UserService.updateUserInfo(currentUser.id, updatedData);
        
        if (response && response.data && response.data.success) {
          // Cập nhật thành công
          
          // Nếu cập nhật mật khẩu, đăng xuất và chuyển hướng đến trang đăng nhập
          if (updatedData.password) {
            // Hiển thị thông báo thành công
            this.alert = {
              show: true,
              type: 'success',
              title: 'Đổi mật khẩu thành công',
              message: 'Mật khẩu đã được cập nhật, bạn sẽ được chuyển đến trang đăng nhập'
            };
            
            // Đợi 1.5 giây để người dùng đọc thông báo
            setTimeout(async () => {
              // Xóa token và thông tin người dùng
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              
              // Đăng xuất chính thức
              await AuthenticationService.logout();
              
              // Chuyển hướng đến trang đăng nhập
              this.$router.push({
                path: '/login',
                query: { message: 'Vui lòng đăng nhập lại với mật khẩu mới' }
              });
            }, 1500);
            
            return;
          }
          
          // Cập nhật dữ liệu người dùng trong component
          this.userInfo = { ...this.userInfo, ...updatedData };
          
          // Cập nhật thông tin người dùng trong localStorage
          const updatedUserData = { ...currentUser, ...updatedData };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          
          // Hiển thị thông báo thành công
          this.alert = {
            show: true,
            type: 'success',
            title: 'Cập nhật thành công',
            message: 'Thông tin tài khoản của bạn đã được cập nhật'
          };
          
          this.maintainEditing = false; // Đóng chế độ chỉnh sửa
        } else {
          // Xử lý các trường hợp lỗi cụ thể
          if (response.data && response.data.errorCode === 'INVALID_OLD_PASSWORD') {
            this.alert = {
              show: true,
              type: 'error',
              title: 'Lỗi cập nhật',
              message: 'Mật khẩu hiện tại không đúng'
            };
            this.maintainEditing = true; // Giữ chế độ chỉnh sửa khi có lỗi
            
            // Truy cập đến component con ProfilePage và gọi phương thức setOldPasswordError
            this.$refs.profilePage?.setOldPasswordError('Mật khẩu hiện tại không đúng');
          } else {
            this.alert = {
              show: true,
              type: 'error',
              title: 'Cập nhật thất bại',
              message: 'Không thể cập nhật thông tin người dùng'
            };
            this.maintainEditing = true; // Giữ chế độ chỉnh sửa khi có lỗi
          }
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        
        // Xử lý các trường hợp lỗi từ response
        if (error.response && error.response.data) {
          if (error.response.data.errorCode === 'INVALID_OLD_PASSWORD') {
            this.alert = {
              show: true,
              type: 'error',
              title: 'Lỗi cập nhật',
              message: 'Mật khẩu hiện tại không đúng'
            };
            
            // Truy cập đến component con ProfilePage và gọi phương thức setOldPasswordError
            this.$refs.profilePage?.setOldPasswordError('Mật khẩu hiện tại không đúng');
          } else {
            this.alert = {
              show: true,
              type: 'error',
              title: 'Lỗi hệ thống',
              message: error.response.data.message || 'Đã xảy ra lỗi khi cập nhật thông tin'
            };
          }
        } else {
          this.alert = {
            show: true,
            type: 'error',
            title: 'Lỗi hệ thống',
            message: 'Đã xảy ra lỗi khi cập nhật thông tin'
          };
        }
        
        this.maintainEditing = true; // Giữ chế độ chỉnh sửa khi có lỗi
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
  
<style scoped>
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
</style>