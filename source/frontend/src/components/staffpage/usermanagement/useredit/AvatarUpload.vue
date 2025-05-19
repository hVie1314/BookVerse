<template>
  <div class="avatar-section">
    <label class="avatar-label">Ảnh đại diện</label>
    <div class="avatar-content">
      <img
        :src="avatar"
        alt="Profile"
        class="avatar-preview"
      />
      <div class="avatar-controls">
        <button class="change-button" @click="showUrlInput = !showUrlInput">
          {{ showUrlInput ? 'Ẩn form' : 'Thay đổi' }}
        </button>
      </div>
    </div>
    
    <!-- Form nhập URL avatar -->
    <div v-if="showUrlInput" class="avatar-url-form">
      <div class="input-container">
        <input 
          type="text" 
          v-model="avatarUrl" 
          placeholder="Nhập URL ảnh đại diện" 
          class="avatar-url-input"
        />
        <div class="url-actions">
          <button class="url-apply-btn" @click="applyNewAvatar">Áp dụng</button>
          <button class="url-cancel-btn" @click="cancelUrlChange">Hủy</button>
        </div>
      </div>
      <p class="url-hint">Nhập URL ảnh đại diện từ internet (định dạng JPG, PNG hoặc GIF)</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AvatarUpload',
  props: {
    avatar: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showUrlInput: false,
      avatarUrl: ''
    }
  },
  methods: {
    applyNewAvatar() {
      if (this.avatarUrl.trim()) {
        this.$emit('update:avatar', this.avatarUrl);
        this.showUrlInput = false;
      }
    },
    cancelUrlChange() {
      this.avatarUrl = '';
      this.showUrlInput = false;
    }
  }
};
</script>

<style scoped>
.avatar-section {
  display: flex;
  flex-direction: column;
  padding: 20px 42px;
  gap: 15px;
}

.avatar-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-label {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 900;
  margin-bottom: 5px;
}

.avatar-preview {
  width: 95px;
  height: 94px;
  border-radius: 50px;
  border: 5px solid #fff;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.change-button {
  padding: 12px 34px;
  border: 1px solid #ccc9c9;
  border-radius: 10px;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  background: transparent;
  cursor: pointer;
}

.change-button:hover {
  background-color: #f9f9f9;
}

.avatar-url-form {
  margin-top: 10px;
  background-color: #f9f5f0;
  border-radius: 8px;
  padding: 15px;
  border-left: 3px solid #4d2900;
  animation: slideDown 0.3s ease;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.avatar-url-input {
  width: 100%;
  padding: 10px 15px;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border 0.3s;
}

.avatar-url-input:focus {
  outline: none;
  border-color: #4d2900;
}

.url-actions {
  display: flex;
  gap: 10px;
}

.url-apply-btn, .url-cancel-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.url-apply-btn {
  background-color: #4d2900;
  color: white;
  border: none;
}

.url-apply-btn:hover {
  background-color: #724e4e;
}

.url-cancel-btn {
  background-color: transparent;
  border: 1px solid #ccc;
}

.url-cancel-btn:hover {
  background-color: #f0f0f0;
}

.url-hint {
  font-size: 12px;
  color: #777;
  margin-top: 8px;
  font-style: italic;
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
</style>