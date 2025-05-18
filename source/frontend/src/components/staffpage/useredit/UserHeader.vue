<template>
  <div class="user-header">
    <div class="header-left">
      <h1 class="header-title">Quản lý người dùng</h1>
      <p class="user-count">Tổng cộng: <span>{{ totalUsers }}</span> người dùng</p>
    </div>
    <div class="header-right">
      <button class="add-user-btn" @click="$emit('add-user')">
        <i class="fas fa-plus"></i>
        Thêm người dùng
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHeader',
  props: {
    totalUsers: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: #4d2900;
  margin: 0;
  margin-bottom: 8px;
}

.user-count {
  font-size: 16px;
  color: #897B7B;
  margin: 0;
}

.user-count span {
  font-weight: 600;
  color: #4d2900;
}

.add-user-btn {
  background-color: #4d2900;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover {
  background-color: #634000;
}

@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-right {
    margin-top: 16px;
    align-self: flex-end;
  }
}
</style>