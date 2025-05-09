<template>
    <main class="profile-container">
        <header class="profile-header">
            <h1 class="profile-title">Hồ sơ cá nhân</h1>
            <img :src="userAvatar" alt="avatar" class="profile-avatar" />
        </header>
      
        <section class="profile-field">
            <label class="field-label">
                Tên đăng nhập <span class="required-star">*</span>
            </label>
            <div class="input-container">
                <input type="text" v-model="userForm.username" disabled class="field-input">
                <div class="icon-container"><i class="fa-regular fa-user eyes"></i></div>
            </div>
        </section>
      
        <section class="profile-field">
            <label class="field-label">
                Email <span class="required-star">*</span>
            </label>
            <div class="input-container">
                <input type="email" v-model="userForm.email" disabled class="field-input">
                <div class="icon-container"><i class="fa-regular fa-envelope eyes"></i></div>
            </div>
        </section>
      
        <section class="profile-field">
            <label class="field-label">Mật khẩu</label>
            <div class="input-container">
                <input :type="isPasswordVisible ? 'text' : 'password'" v-model="userForm.password" 
                       placeholder="••••••••" :disabled="!isEditing" class="field-input"
                       @focus="passwordFocused = true" @blur="passwordFocused = false">
                <div class="icon-container password-toggle" @click="togglePasswordVisibility" v-if="isEditing">
                    <transition name="fade" mode="out-in">
                        <div v-if="isPasswordVisible" key="visible"><i class="fa-regular fa-eye eyes"></i></div>
                        <div v-else key="hidden"><i class="fa-regular fa-eye-slash eyes"></i></div>
                    </transition>
                </div>
                <div class="icon-container" v-else><i class="fa-solid fa-lock eyes"></i></div>
            </div>
        </section>
      
        <section class="profile-field">
            <label class="field-label">Địa chỉ</label>
            <div class="input-container">
                <input type="text" v-model="userForm.address" :disabled="!isEditing" class="field-input"
                       @focus="addressFocused = true" @blur="addressFocused = false">
                <div class="icon-container"><i class="fa-regular fa-location-dot eyes"></i></div>
            </div>
        </section>
      
        <section class="profile-field" v-if="isEditing">
            <label class="field-label">Ảnh đại diện URL</label>
            <div class="input-container">
                <input type="text" v-model="userForm.avatarUrl" :disabled="!isEditing" class="field-input"
                       @focus="avatarFocused = true" @blur="avatarFocused = false">
                <div class="icon-container"><i class="fa-regular fa-image eyes"></i></div>
            </div>
        </section>
        
        <div class="field-note" v-if="isEditing">
            <span class="required-star">*</span> Những thông tin này không thể thay đổi
        </div>

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
    } 
  },
  data() {
    return {
      isEditing: false,
      userForm: {
        username: '',
        email: '',
        password: '',
        address: '',
        avatarUrl: ''
      },
      usernameFocused: false,
      emailFocused: false,
      passwordFocused: false,
      addressFocused: false,
      avatarFocused: false,
      isPasswordVisible: false
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
    // Thêm watcher để phản ứng với prop maintainEditing
    maintainEditing: {
        immediate: true, // Đảm bảo chạy ngay khi component được tạo
        handler(newVal) {
            if (newVal === true) {
                this.isEditing = true;
            }
        }
    }
  },
  methods: {
    initializeForm() {
      this.userForm = {
        username: this.user.username || '',
        email: this.user.email || '',
        password: '',
        address: this.user.address || '',
        avatarUrl: this.user.avatar || this.user.avatarUrl || ''
      };
    },
    startEditing() {
      this.isEditing = true;
    },
    cancelEditing() {
      this.isEditing = false;
      this.initializeForm();
    },
    saveChanges() {
      // Tạo đối tượng chỉ chứa dữ liệu đã thay đổi
      const updatedData = {};
      
      if (this.userForm.password) {
        updatedData.password = this.userForm.password;
      }
      
      if (this.userForm.address !== this.user.address) {
        updatedData.address = this.userForm.address;
      }
      
      if (this.userForm.avatarUrl !== this.user.avatar && this.userForm.avatarUrl !== this.user.avatarUrl) {
        updatedData.avatar = this.userForm.avatarUrl;
      }
      
    //   // Kiểm tra xem có dữ liệu thay đổi không
    //   if (Object.keys(updatedData).length > 0) {
      this.$emit('update-profile', updatedData);
    //   }
      
    //   this.isEditing = false;
    },
    togglePasswordVisibility() {
      if (this.isEditing) { // Chỉ toggle khi đang ở chế độ edit
        this.isPasswordVisible = !this.isPasswordVisible;
      }
    }
  }
}
</script>

<style scoped>
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

    .password-toggle {
        cursor: pointer;
    }

    .password-toggle:hover {
        transform: translateY(-50%) scale(1.1);
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
</style>
  