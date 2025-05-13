<template>
  <div class="staff-info-container">
    

    <div v-if="loading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <main v-else class="profile-container">
      <header class="profile-header">
        <h2 class="profile-title">Thông tin tài khoản</h2>
        <img :src="userAvatar" alt="Avatar" class="profile-avatar" />
      </header>
      
      <section class="profile-field">
        <div class="field-label">Email</div>
        <div class="field-value">
          <input type="text" v-model="formData.email" disabled />
        </div>
      </section>
      
      <section class="profile-field">
        <div class="field-label">Tên người dùng</div>
        <div class="field-value">
          <input type="text" v-model="formData.username" disabled />
        </div>
      </section>

      <section class="profile-field">
        <div class="field-label">Vị trí</div>
        <div class="field-value">
          <input type="text" v-model="formData.role" disabled />
        </div>
      </section>
      
      <section class="profile-field">
        <div class="field-label">Địa chỉ</div>
        <div class="field-value">
          <input type="text" v-model="formData.address" :disabled="!isEditing" />
        </div>
      </section>

      <section class="profile-field" v-if="isEditing">
        <div class="field-label">
          Mật khẩu mới
          <span class="required-star" v-if="isEditing">*</span>
        </div>
        <div class="field-value input-container">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="formData.password" 
            placeholder="Nhập mật khẩu mới (để trống nếu không đổi)" 
          />
          <div class="icon-container">
            <i 
              :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" 
              class="password-toggle"
              @click="togglePasswordVisibility"
            ></i>
          </div>
        </div>
      </section>

      <section class="profile-field">
        <div class="field-label">URL hình đại diện</div>
        <div class="field-value">
          <input type="text" v-model="formData.avatar" :disabled="!isEditing" />
        </div>
      </section>
      
      <div class="field-note" v-if="isEditing">
        * Để trống nếu bạn không muốn thay đổi mật khẩu hiện tại
      </div>

      <div class="button-container">
        <template v-if="!isEditing">
          <button class="edit-button" @click="startEditing">
            <span class="button-text">Chỉnh sửa</span>
          </button>
        </template>
        <template v-else>
          <button class="cancel-button" @click="cancelEditing">
            <span class="button-text">Hủy</span>
          </button>
          <button class="save-button" @click="saveChanges">
            <span class="save-button-text">Lưu thay đổi</span>
          </button>
        </template>
      </div>
    </main>
  </div>
</template>

<script>
import UserService from '@/services/UserService';
import AuthenticationService from '@/services/AuthenticationService';
import eventBus from '@/eventBus.js';

export default {
  name: 'StaffInfo',
  data() {
    return {
      userInfo: null,
      formData: {
        email: '',
        username: '',
        role: '',
        address: '',
        password: '',
        avatar: ''
      },
      isEditing: false,
      loading: true,
      error: null,
      showPassword: false
    }
  },
  computed: {
    userAvatar() {
      if (this.formData.avatar) return this.formData.avatar;
      
      // Avatar mặc định nếu không có
      const username = this.formData.username || 'User';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=4d2900&color=fff&size=128`;
    }
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      try {
        this.loading = true;
        // Kiểm tra nếu người dùng đã đăng nhập
        const currentUser = AuthenticationService.getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
          this.error = "Vui lòng đăng nhập để xem thông tin tài khoản";
          this.loading = false;
          return;
        }
        
        // Lấy dữ liệu đầy đủ của người dùng từ API
        const response = await UserService.getUserById(currentUser.id);
        console.log("User data response:", response);
        
        if (response.data && response.data.success) {
          this.userInfo = response.data.data || response.data.user;
        } else if (response.data && response.data.user) {
          // Trường hợp API trả về cấu trúc khác
          this.userInfo = response.data.user;
        } else if (response.data) {
          // Trường hợp API trả về dữ liệu người dùng trực tiếp
          this.userInfo = response.data;
        } else {
          this.error = "Không thể tải thông tin người dùng";
          return;
        }
        
        // Khởi tạo formData từ userInfo
        this.initializeForm();
      } catch (error) {
        console.error("Error fetching user data:", error);
        this.error = "Đã xảy ra lỗi khi tải thông tin người dùng";
      } finally {
        this.loading = false;
      }
    },

    initializeForm() {
      if (!this.userInfo) return;
      
      this.formData = {
        email: this.userInfo.email || '',
        username: this.userInfo.username || '',
        role: this.mapRoleToVietnamese(this.userInfo.role) || '',
        address: this.userInfo.address || '',
        password: '',
        avatar: this.userInfo.avatar || ''
      };
    },

    mapRoleToVietnamese(role) {
      const roleMap = {
        'admin': 'Quản trị viên',
        'staff': 'Nhân viên',
        'user': 'Khách hàng'
      };
      return roleMap[role] || role;
    },

    startEditing() {
      this.isEditing = true;
    },

    cancelEditing() {
      this.initializeForm();
      this.isEditing = false;
      this.showPassword = false;
    },

    async saveChanges() {
      try {
        const currentUser = AuthenticationService.getCurrentUser();
        
        if (!currentUser || !currentUser.id) {
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Lỗi xác thực',
            message: 'Vui lòng đăng nhập để cập nhật thông tin'
          });
          return;
        }
        
        // Kiểm tra URL hình ảnh nếu có
        if (this.formData.avatar) {
          const isValidImage = await this.isValidImageUrl(this.formData.avatar);
          if (!isValidImage) {
            eventBus.emit('show-alert', {
              show: true,
              type: 'error',
              title: 'Lỗi hình ảnh',
              message: 'URL hình ảnh không hợp lệ. Vui lòng kiểm tra lại đường dẫn.'
            });
            return;
          }
        }
        
        // Chỉ gửi những trường được phép thay đổi
        const updatedData = {
          userId: currentUser.id
        };
        
        if (this.formData.password) {
          updatedData.password = this.formData.password;
        }
        
        if (this.formData.address !== this.userInfo.address) {
          updatedData.address = this.formData.address;
        }
        
        if (this.formData.avatar !== this.userInfo.avatar) {
          updatedData.avatar = this.formData.avatar;
        }
        
        if (Object.keys(updatedData).length <= 1) {
          eventBus.emit('show-alert', {
            show: true,
            type: 'error',
            title: 'Không có thay đổi',
            message: 'Không có thông tin nào được thay đổi'
          });
          return;
        }
        
        this.loading = true;
        const response = await UserService.updateUserInfo(currentUser.id, updatedData);
        
        if (response && response.data) {
          // Cập nhật dữ liệu người dùng trong component
          this.userInfo = { ...this.userInfo, ...updatedData };
          
          // Cập nhật thông tin người dùng trong localStorage
          const updatedUserData = { ...currentUser, ...updatedData };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          
          eventBus.emit('show-alert', {
            show: true,
            type: 'success',
            title: 'Cập nhật thành công',
            message: 'Thông tin tài khoản của bạn đã được cập nhật'
          });
          
          this.isEditing = false;
          this.showPassword = false;
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi hệ thống',
          message: 'Đã xảy ra lỗi khi cập nhật thông tin'
        });
      } finally {
        this.loading = false;
      }
    },

    async isValidImageUrl(url) {
      if (!url) return true;
      
      const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$','i');
      
      return pattern.test(url);
    },
    
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style scoped>
.staff-info-container {
  width: 100%;
  padding: 20px 30px;
}

.page-title {
  color: #4d2900;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}

.loading-container, .error-message {
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

/* Sao chép từ ProfilePage.vue */
.profile-container {
  width: 100%;
  box-sizing: border-box;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-header {
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.profile-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 32px;
  color: rgba(77, 41, 0, 1);
  margin: 0;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.profile-field {
  width: 80%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 30px;
}

.field-label {
  width: 20%;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #4d2900;
}

.field-value {
  flex: 1;
  height: 50px;
  border-radius: 5px;
  border: 2px solid #858585;
  padding: 0 15px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  align-items: center;
  position: relative;
}

.field-value input {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  color: rgba(130, 130, 130, 1);
  outline: none;
}

.field-value input:disabled {
  cursor: default;
}

.field-value input:not(:disabled) {
  background-color: #f9f5f0;
  border-radius: 4px;
  color: #4d2900;
}

.input-container {
  position: relative;
}

.icon-container {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.password-toggle {
  color: #777;
  font-size: 16px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #4d2900;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.edit-button, .cancel-button {
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid #4d2900;
  background-color: #fff;
  color: #4d2900;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  padding: 10px 30px;
  border-radius: 8px;
  background-color: #4d2900;
  color: #fff;
  border: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button:hover, .cancel-button:hover {
  background-color: #4d2900;
  color: #fff;
}

.save-button:hover {
  background-color: #6e3d00;
  transform: translateY(-2px);
}

.save-button-text, .button-text {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
}

.field-note {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
}

.required-star {
  color: #ff3333;
  margin-left: 4px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column-reverse;
    gap: 20px;
    width: 100%;
  }
  
  .profile-field {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
  }
  
  .field-label {
    width: 100%;
  }
}
</style>