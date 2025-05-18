<template>
    <main class="profile-container" :class="{'staff-profile': isStaffMode}">
        <header class="profile-header">
            <h1 class="profile-title">{{ isStaffMode ? 'Thông tin tài khoản' : 'Hồ sơ cá nhân' }}</h1>
            <img :src="userAvatar" alt="avatar" class="profile-avatar" />
        </header>
      
        <!-- Hiển thị Email trước -->
        <section class="profile-field">
            <label class="field-label">
                Email <span class="required-star">*</span>
            </label>
            <div class="input-container">
                <input type="email" v-model="userForm.email" disabled class="field-input">
                <div class="icon-container"><i class="fa-regular fa-envelope eyes"></i></div>
            </div>
        </section>
      
        <!-- Username sau Email và cho phép chỉnh sửa -->
        <section class="profile-field">
            <label class="field-label">
                Tên đăng nhập
            </label>
            <div class="input-container">
                <input type="text" v-model="userForm.username" :disabled="!isEditing" class="field-input"
                       @focus="usernameFocused = true" @blur="usernameFocused = false">
                <div class="icon-container"><i class="fa-regular fa-user eyes"></i></div>
            </div>
        </section>
      
        <!-- Phần nhập mật khẩu mới -->
        <section class="profile-field" v-if="isEditing">
            <label class="field-label">Mật khẩu</label>
            <div class="password-toggle-container" @click="togglePasswordChange">
            <div class="password-toggle-button">
                <span>Thay đổi mật khẩu</span>
                <i :class="isChangingPassword ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'"></i>
            </div>
            </div>
        </section>

        <!-- Khi người dùng chọn thay đổi mật khẩu, hiển thị 2 ô mật khẩu -->
        <div v-if="isEditing && isChangingPassword" class="password-change-section">
            <!-- Phần mật khẩu hiện tại -->
            <section class="profile-field password-field">
                <label class="field-label">Mật khẩu hiện tại <span class="required-star">*</span></label>
                <div class="input-container">
                    <input 
                    :type="isOldPasswordVisible ? 'text' : 'password'" 
                    v-model="userForm.oldPassword" 
                    placeholder="Nhập mật khẩu hiện tại" 
                    class="field-input"
                    :class="{ 'error-input': oldPasswordError }" 
                    @focus="oldPasswordFocused = true" 
                    @blur="validateOldPassword"
                    >
                    <div class="icon-container password-toggle" @click="toggleOldPasswordVisibility">
                    <transition name="fade" mode="out-in">
                        <div v-if="isOldPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
                        <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
                    </transition>
                    </div>
                </div>
                <!-- Sửa container cho thông báo lỗi -->
                
            </section>
            <div v-if="oldPasswordError" class="field-error-container">
                    <div class="field-error">
                    <i class="fa-solid fa-circle-exclamation error-icon"></i>
                    {{ oldPasswordError }}
                    </div>
            </div>
            <!-- Phần mật khẩu mới -->
            <section class="profile-field">
            <label class="field-label">Mật khẩu mới <span class="required-star">*</span></label>
            <div class="input-container">
                <input 
                :type="isPasswordVisible ? 'text' : 'password'" 
                v-model="userForm.password" 
                placeholder="Nhập mật khẩu mới" 
                class="field-input"
                :class="{ 'error': passwordError }"
                @focus="passwordFocused = true" 
                @blur="passwordFocused = false"
                >
                <div class="icon-container password-toggle" @click="togglePasswordVisibility">
                <transition name="fade" mode="out-in">
                    <div v-if="isPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
                    <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
                </transition>
                </div>
            </div>
            
            </section>
            <div v-if="passwordError"  class="field-error-container"><div class="field-error">{{ passwordError }}</div></div>
            <div class="password-note">
            <span class="required-star">*</span> Lưu ý: Nếu bạn thay đổi mật khẩu, bạn sẽ cần đăng nhập lại
            </div>
        </div>
      
        <!-- Phần địa chỉ -->
        <section class="profile-field">
            <label class="field-label">Địa chỉ</label>
            <div class="input-container">
                <input type="text" v-model="userForm.address" :disabled="!isEditing" class="field-input"
                       @focus="addressFocused = true" @blur="addressFocused = false">
                <div class="icon-container"><i class="fa-regular fa-location-dot eyes"></i></div>
            </div>
        </section>
      
        <!-- Phần URL ảnh đại diện -->
        <section class="profile-field" v-if="isEditing">
            <label class="field-label">Ảnh đại diện URL</label>
            <div class="input-container">
                <input type="text" v-model="userForm.avatarUrl" :disabled="!isEditing" class="field-input"
                       @focus="avatarFocused = true" @blur="avatarFocused = false">
                <div class="icon-container"><i class="fa-regular fa-image eyes"></i></div>
            </div>
        </section>
        
        <!-- Thông báo lỗi -->
        <div class="validation-error" v-if="validationError">
            {{ validationError }}
        </div>
        
        <div class="field-note" v-if="isEditing">
            <span class="required-star">*</span> Những thông tin này không thể thay đổi
        </div>

        <!-- Các nút tương tác -->
        <div class="button-container">
            <button v-if="!isEditing" @click="startEditing" class="edit-button">
                <span class="button-text">Chỉnh sửa thông tin</span>
            </button>
            
            <template v-else>
                <button @click="saveChanges" class="save-button">
                    <span class="save-button-text">Lưu thay đổi</span>
                </button>
                
                <button @click="cancelEditing" class="cancel-button">
                    <span class="button-text">Hủy</span>
                </button>
            </template>
        </div>
    </main>
</template>

<script>
import UserService from '@/services/UserService';
import AuthenticationService from '@/services/AuthenticationService';
import { setPasswordValidationMode } from '@/services/Api';

export default {
  name: 'ProfilePage',
  props: {
    user: {
      type: Object,
      required: true
    },
    maintainEditing: {
      type: Boolean,
      default: false
    },
    isStaffMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEditing: false,
      isChangingPassword: false,
      userForm: {
        username: '',
        email: '',
        password: '',
        oldPassword: '',
        address: '',
        avatarUrl: ''
      },
      usernameFocused: false,
      emailFocused: false,
      passwordFocused: false,
      oldPasswordFocused: false,
      addressFocused: false,
      avatarFocused: false,
      isPasswordVisible: false,
      isOldPasswordVisible: false,
      validationError: '',
      oldPasswordError: '',
      passwordError: ''
    }
  },
  computed: {
    userAvatar() {
      return this.user.avatar || this.user.avatarUrl || 'https://cdn.builder.io/api/v1/image/assets/TEMP/570b2d0d0a0a8f021582986796c3b9babe6c8399?placeholderIfAbsent=true';
    }
  },
  created() {
    this.initializeForm();

    if (this.maintainEditing) {
        this.isEditing = true;
    }
  },
  watch: {
    user: {
      handler() {
        this.initializeForm();
      },
      deep: true
    },
    maintainEditing: {
        immediate: true, 
        handler(newVal) {
            if (newVal === true) {
            this.isEditing = true;
            // Không gọi initializeForm() - điều này sẽ giúp giữ lại dữ liệu
            } else {
            // Nếu maintainEditing chuyển sang false, reset form
            this.initializeForm();
            }
        }
    },
    // Đặt lại lỗi mật khẩu cũ khi người dùng thay đổi input
    'userForm.oldPassword'() {
      this.oldPasswordError = '';
    },
    // Theo dõi mật khẩu mới, nếu xóa trắng thì cũng xóa trường mật khẩu cũ
    'userForm.password'(newVal) {
      if (!newVal) {
        this.userForm.oldPassword = '';
        this.oldPasswordError = '';
      }
      this.passwordError = '';
    }
  },
  methods: {
    restoreFormAfterPasswordError() {
        // Lấy backup từ localStorage nếu có
        const formBackup = localStorage.getItem('profile_form_backup');
        if (formBackup) {
        try {
            const backupData = JSON.parse(formBackup);
            
            // Giữ lại mật khẩu cũ và mới đã nhập
            const oldPassword = this.userForm.oldPassword;
            const newPassword = this.userForm.password;
            
            // Khôi phục các trường khác
            this.userForm = {
            ...backupData,
            oldPassword: oldPassword,
            password: newPassword
            };
            
            console.log('Đã khôi phục form sau lỗi mật khẩu:', 
            { ...this.userForm, password: '[HIDDEN]', oldPassword: '[HIDDEN]' });
        } catch (e) {
            console.error('Lỗi khi khôi phục form:', e);
        }
        }
    },
    updateFormWithLatestData(userData) {
        // Không làm gì nếu không có dữ liệu
        if (!userData) return;
        
        // Lưu giữ các giá trị người dùng đã nhập
        const oldPassword = this.userForm.oldPassword;
        const newPassword = this.userForm.password;
        
        // Chỉ cập nhật các trường không phải password
        if (userData.username) this.userForm.username = userData.username;
        if (userData.email) this.userForm.email = userData.email;
        if (userData.address) this.userForm.address = userData.address;
        if (userData.avatar) this.userForm.avatarUrl = userData.avatar;
        
        // Khôi phục lại các giá trị password
        if (this.isChangingPassword) {
            this.userForm.oldPassword = oldPassword;
            this.userForm.password = newPassword;
        }
    },
    async validateOldPassword() {
        this.oldPasswordFocused = false;
        
        // Chỉ kiểm tra nếu đã nhập mật khẩu và chuỗi không trống
        if (!this.userForm.oldPassword || this.userForm.oldPassword.trim() === '') {
            return;
        }
        
        try {
            const currentUser = AuthenticationService.getCurrentUser();
            if (!currentUser || !currentUser.id) return;
            
            // Đánh dấu rằng đây là request kiểm tra mật khẩu
            setPasswordValidationMode(true);
            
            // Tạo một đối tượng dữ liệu "giả" chỉ chứa oldPassword để kiểm tra
            const testData = {
            oldPassword: this.userForm.oldPassword
            };
            
            // Gọi API updateUserInfo với dữ liệu trên, nhưng không thay đổi gì thực sự
            await UserService.updateUserInfo(currentUser.id, testData);
            
            // Nếu không có lỗi, mật khẩu là đúng
            this.oldPasswordError = '';
        } catch (error) {
            // Xử lý lỗi mật khẩu không đúng
            if (error.response && error.response.status === 401 && 
                error.response.data && error.response.data.errorCode === 'INVALID_OLD_PASSWORD') {
            this.oldPasswordError = 'Mật khẩu hiện tại không chính xác';
            
            // Emit event để component cha hiển thị alert nhưng không reset form
            this.$emit('password-error', 'Mật khẩu hiện tại bạn nhập không chính xác');
            }
        } finally {
            // Đảm bảo reset flag sau khi xong
            setPasswordValidationMode(false);
        }
    },

    setOldPasswordError(errorMessage, resetForm = false) {
        this.oldPasswordError = errorMessage;
        
        // Đảm bảo tab mật khẩu được mở
        this.isChangingPassword = true;
        
        // Khôi phục toàn bộ form từ backup
        this.restoreFormAfterPasswordError();
        
        // Sử dụng nextTick để đảm bảo DOM đã cập nhật 
        // trước khi cố gắng tìm và focus vào phần tử
        this.$nextTick(() => {
            // Cải thiện cách chọn selector để đảm bảo tìm đúng phần tử
            const oldPasswordInput = this.$el.querySelector('input[placeholder="Nhập mật khẩu hiện tại"]');
            if (oldPasswordInput) {
            // Focus vào input mật khẩu cũ
            oldPasswordInput.focus();
            
            // Scroll đến vị trí của input nếu cần
            oldPasswordInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        
        // Nếu resetForm = true, mới xóa mật khẩu đã nhập
        if (resetForm) {
            this.userForm.oldPassword = '';
        }
        },
    
    setPasswordError(errorMessage) {
      this.passwordError = errorMessage;
      // Đảm bảo tab mật khẩu được mở
      this.isChangingPassword = true;
    },
    togglePasswordChange() {
      this.isChangingPassword = !this.isChangingPassword;
      
      // Nếu đóng phần thay đổi mật khẩu, xóa các giá trị đã nhập
      if (!this.isChangingPassword) {
        this.userForm.password = '';
        this.userForm.oldPassword = '';
        this.oldPasswordError = '';
        this.passwordError = '';
      }
    },
    initializeForm() {
      this.userForm = {
        username: this.user.username || '',
        email: this.user.email || '',
        password: '',
        oldPassword: '',
        address: this.user.address || '',
        avatarUrl: this.user.avatar || this.user.avatarUrl || ''
      };
      this.validationError = '';
      this.oldPasswordError = '';
      this.passwordError = '';
    },
    startEditing() {
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
      this.isChangingPassword = false;
      this.initializeForm();
    },
    togglePasswordVisibility() {
      if (this.isEditing) {
        this.isPasswordVisible = !this.isPasswordVisible;
      }
    },
    toggleOldPasswordVisibility() {
      this.isOldPasswordVisible = !this.isOldPasswordVisible;
    },
   validateForm() {
      this.validationError = '';
      
      // Nếu đã có lỗi mật khẩu cũ, không cần kiểm tra lại
      if (this.oldPasswordError) {
        return false;
      }
      
      // Kiểm tra username
      if (this.userForm.username && this.userForm.username.trim() === '') {
        this.validationError = 'Tên đăng nhập không được để trống';
        return false;
      }
      
      // Kiểm tra mật khẩu cũ và mới nếu đang thay đổi mật khẩu
      if (this.isChangingPassword) {
        if (!this.userForm.oldPassword) {
          this.oldPasswordError = 'Vui lòng nhập mật khẩu hiện tại';
          return false;
        }
        
        if (!this.userForm.password) {
          this.passwordError = 'Vui lòng nhập mật khẩu mới';
          return false;
        }
        
        if (this.userForm.password.length < 8) {
          this.passwordError = 'Mật khẩu mới phải có ít nhất 8 ký tự';
          return false;
        }
      }

      return true;
    },
    saveChanges() {
        // Kiểm tra dữ liệu trước khi gửi
        if (!this.validateForm()) {
            return;
        }

        if (this.isChangingPassword && this.oldPasswordError) {
            // Emit sự kiện để hiển thị alert nhưng không reset form
            this.$emit('password-error', 'Mật khẩu hiện tại bạn nhập không chính xác');
            return;
        }

        const formState = {
            username: this.userForm.username,
            email: this.userForm.email,
            address: this.userForm.address,
            avatarUrl: this.userForm.avatarUrl,
            oldPassword: this.userForm.oldPassword,
            password: this.userForm.password
        };
        localStorage.setItem('profile_form_backup', JSON.stringify(formState));
        console.log('Đã lưu backup form với địa chỉ:', this.userForm.address);
        // Tạo đối tượng chỉ chứa dữ liệu đã thay đổi
        const updatedData = {};
        
        // Thêm username nếu đã thay đổi
        if (this.userForm.username !== this.user.username) {
            updatedData.username = this.userForm.username;
        }
        
        // Thêm mật khẩu và mật khẩu cũ nếu đang thay đổi mật khẩu
        if (this.isChangingPassword && this.userForm.password) {
            updatedData.password = this.userForm.password;
            updatedData.oldPassword = this.userForm.oldPassword;
        }
        
        if (this.userForm.address !== this.user.address) {
            updatedData.address = this.userForm.address;
        }
        
        if (this.userForm.avatarUrl !== this.user.avatar && this.userForm.avatarUrl !== this.user.avatarUrl) {
            updatedData.avatar = this.userForm.avatarUrl;
        }
        
        // Phát sự kiện cập nhật thông tin
        this.$emit('update-profile', updatedData);
        }
  }
}
</script>

<style scoped>
    .password-field{
        display: flex;
        
    }
    .profile-container {
        margin-top: 100px;
        width: 100%;
        box-sizing: border-box;
        background-color: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @media (max-width: 991px) {
        .profile-container {
            padding: 15px;
        }
    }
    .profile-header {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
    }
    @media (max-width: 640px) {
        .profile-header {
            flex-direction: column;
            align-items: flex-start;
        }
    }
    .profile-title {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 40px;
        color: rgba(77, 41, 0, 1);
        margin: 0;
    }
    @media (max-width: 991px) {
        .profile-title {
            font-size: 40px;
        }
    }
    @media (max-width: 640px) {
        .profile-title {
            font-size: 35px;
            margin-bottom: 20px;
        }
    }
    .profile-avatar {
        width: 130px;
        height: 130px;
        border-radius: 50%;
    }
    @media (max-width: 640px) {
        .profile-avatar {
            width: 120px;
            height: 120px;
        }
    }
    .profile-field {
        width: 80%;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        gap: 30px;
    }
    .field-label {
        display: flex;
        width: 20%;
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        font-size: 16px;
        color: #4d2900;
        margin-bottom: 8px;
    }
    @media (max-width: 991px) {
        .field-label {
            font-size: 24px;
        }
    }
    @media (max-width: 640px) {
        .field-label {
            font-size: 20px;
        }
    }
    .field-value {
        font-family: "Montserrat", sans-serif;
        font-weight: 400;
        font-size: 18px;
        color: rgba(130, 130, 130, 1);
        flex: 1;
        height: 60px;
        border-radius: 5px;
        border: 2px solid #858585;
        padding-left: 20px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        align-items: center;
    }
    @media (max-width: 991px) {
        .field-value {
            font-size: 22px;
        }
    }
    @media (max-width: 640px) {
        .field-value {
            font-size: 20px;
        }
    }
    
    .save-button {
        position: relative;
        width: 422px;
        height: 68px;
        margin: 0 auto;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #4d2900;
        border: none;
        padding: 0;
    }
    @media (max-width: 640px) {
        .save-button {
            width: 100%;
            height: 60px;
        }
    }
    .save-button-text {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 28px;
        color: #fff;
    }
    @media (max-width: 991px) {
        .save-button-text {
            font-size: 26px;
        }
    }
    @media (max-width: 640px) {
        .save-button-text {
            font-size: 24px;
        }
    }

    .field-value input {
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
        font-family: "Montserrat", sans-serif;
        font-size: 24px;
        color: rgba(130, 130, 130, 1);
        padding: 0;
        outline: none;
    }

    .field-value input:disabled {
        cursor: default;
    }

    .field-value input:not(:disabled) {
        background-color: #f9f5f0;
        border-radius: 4px;
        padding-left: 10px;
        border: 2px solid #4d2900;
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
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .edit-button:hover, .cancel-button:hover {
        background-color: #4d2900;
        color: #fff;
    }

    .button-text {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 18px;
    }

    .input-container {
        position: relative;
        width: 100%;
        margin-bottom: 5px;
        transition: transform 0.3s ease;
    }

    .input-container:hover {
        transform: translateY(-2px);
    }

    .field-input {
        width: 100%;
        height: 50px;
        border: 2px solid #4d2900;
        border-radius: 8px;
        padding: 0 40px 0 16px;
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        color: #333;
        background-color: #fff;
        box-sizing: border-box;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .field-input:focus {
        outline: none;
        border-color: #724e4e;
        box-shadow: 0 0 0 3px rgba(77, 41, 0, 0.2);
    }

    .field-input:disabled {
        background-color: #f9f9f9;
        border-color: #ddd;
        color: #666;
        cursor: default;
    }

    /* Icon container */
    .icon-container {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
    }

    .password-toggle-container {
        width: 100%;
        cursor: pointer;
    }

    .password-toggle-button {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background-color: #f9f5f0;
        border: 2px solid #4d2900;
        border-radius: 8px;
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        color: #4d2900;
        transition: all 0.3s ease;
    }

    .password-toggle-button:hover {
        background-color: #f0e5d8;
        transform: translateY(-2px);
    }

    .password-toggle {
        cursor: pointer;
    }

    .password-toggle:hover {
        transform: translateY(-50%) scale(1.1);
    }

    .password-change-section {
        width: 80%;
        background-color: #f9f5f0;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        border-left: 3px solid #4d2900;
        animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    /* Buttons */
    .button-container {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 25px;
    }

    .edit-button, .cancel-button {
        padding: 10px 20px;
        height: 50px;
        border-radius: 8px;
        border: 2px solid #4d2900;
        background-color: #fff;
        color: #4d2900;
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .edit-button:hover, .cancel-button:hover {
        transform: translateY(-3px);
        background-color: #4d2900;
        color: #fff;
    }

    .edit-button:active, .cancel-button:active {
        transform: translateY(1px);
    }

    .save-button {
        height: 50px;
        width: auto;
        min-width: 200px;
        border-radius: 8px;
        border: none;
        background-color: #4d2900;
        color: #fff;
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        padding: 0 30px;
    }

    .save-button:hover {
        transform: translateY(-3px);
        background-color: #6c3c00;
    }

    .save-button:active {
        transform: translateY(1px);
    }

    .save-button::before, .edit-button::before, .cancel-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg, 
            rgba(255, 255, 255, 0) 0%, 
            rgba(255, 255, 255, 0.2) 50%, 
            rgba(255, 255, 255, 0) 100%
        );
        transition: left 0.6s;
    }

    .save-button:hover::before, .edit-button:hover::before, .cancel-button:hover::before {
        left: 100%;
    }

    .save-button-text, .button-text {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 16px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }

    /* Eye icon color */
    .eyes {
        color: #4d2900;
    }

    /* Mạnh độ drop shadow cho avatar */
    .profile-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        border: 3px solid #fff;
    }

    /* Thêm vào phần style */
    .required-star {
    color: #ff3333;
    margin-left: 4px;
    font-weight: bold;
    }

    .field-note {
    font-size: 14px;
    color: #777;
    margin-top: 10px;
    margin-bottom: 20px;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    }

    /* Style cho input disabled */
    .field-input:disabled {
    background-color: #f5f5f5;
    border-color: #ddd;
    color: #777;
    cursor: not-allowed;
    }

    /* Giữ nguyên các style hiện tại */

    /* Thêm style cho hiển thị lỗi trường mật khẩu cũ */
    .field-error {
  color: #e74c3c;
  margin-top: 5px;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
}

.input-container .error {
  border-color: #e74c3c;
}

.validation-error {
  color: #e74c3c;
  margin: 15px 0;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-left: 3px solid #e74c3c;
  border-radius: 3px;
  width: 80%;
}

.password-note {
  color: #e67e22;
  margin: 15px 0;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-style: italic;
  width: 80%;
}

/* Thêm vào phần <style> của ProfilePage.vue */
.field-error-container {
  width: 100%;
  margin-left: 16%;
  margin-bottom:20px;
  margin-top: -5px;
  display: flex;
  /* justify-content: flex-start; */
}

.field-error {
  color: #e74c3c;
  font-size: 14px;
  font-family: "Montserrat", sans-serif;
  display: flex;
  align-items: center;
  background-color: rgba(231, 76, 60, 0.08);
  padding: 6px 12px;
  border-radius: 4px;
  border-left: 3px solid #e74c3c;
  max-width: 100%;
}

.error-icon {
  margin-right: 8px;
  font-size: 14px;
}

/* Sửa tên class để tránh conflict */
.error-input {
  border-color: #e74c3c !important;
  background-color: rgba(231, 76, 60, 0.03) !important;
}

/* Thêm hiệu ứng làm nổi bật thông báo lỗi */
@keyframes errorPulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.field-error {
  animation: errorPulse 2s infinite;
}
</style>
