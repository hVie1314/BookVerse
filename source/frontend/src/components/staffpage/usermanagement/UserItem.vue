<template>
  <article class="user-item">
    <!-- Thông tin người dùng -->
    <div class="user-info">
      <img :src="user.avatar" class="user-avatar" alt="User avatar" />
      <div class="user-details">
        <h3 class="user-name">{{ user.name }}</h3>
        <p class="user-email">{{ user.email }}</p>
      </div>
    </div>

    <!-- Vai trò -->
    <div class="user-role" :class="roleClass">
      {{ user.role }}
    </div>

    <!-- Ngày tham gia -->
    <div class="user-join-date">
      {{ formatDate(user.joinDate) }}
    </div>

    <!-- Các thao tác -->
    <div class="user-actions">
      <button class="action-btn edit-btn" @click="$emit('edit')">
        <i class="fas fa-edit"></i>
      </button>
      <button 
        class="action-btn delete-btn" 
        @click="$emit('delete')" 
        v-if="user.role !== 'Admin' || (user.role === 'Admin' && user.id !== currentUserId)">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'UserItem',
  props: {
    user: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: String,
      default: null
    }
  },
  computed: {
    roleClass() {
      const role = this.user.role.toLowerCase();
      if (role === 'admin') return 'role-admin';
      if (role === 'nhân viên' || role === 'staff') return 'role-staff';
      return 'role-customer';
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Không có dữ liệu';
      
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
  },
  emits: ['edit', 'delete']
};
</script>

<style scoped>
.user-item {
  background-color: white;
  border-bottom: 1px solid rgba(175, 164, 164, 0.5);
  display: flex;
  padding: 16px 24px;
  align-items: center;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #faf6f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 3;
  padding-right: 10px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.user-email {
  margin: 4px 0 0;
  font-size: 14px;
  color: #897B7B;
}

.user-role {
  width: 120px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-join-date {
  flex: 2;
  text-align: center;
  color: #555;
  font-size: 14px;
}

.user-actions {
  width: 100px;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.role-admin {
  background-color: #ffd700;
  color: #333;
}

.role-staff {
  background-color: #4caf50;
  color: white;
}

.role-customer {
  background-color: #2196f3;
  color: white;
}

.action-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn {
  color: #4d2900;
}

.edit-btn:hover {
  background-color: rgba(77, 41, 0, 0.1);
}

.delete-btn {
  color: #e53935;
}

.delete-btn:hover {
  background-color: rgba(229, 57, 53, 0.1);
}

@media (max-width: 991px) {
  .user-item {
    padding: 16px;
  }
  
  .user-join-date {
    display: none;
  }
  
  .user-role {
    width: 100px;
  }
  
  .user-actions {
    width: 80px;
  }
}

@media (max-width: 768px) {
  .user-item {
    flex-wrap: wrap;
  }
  
  .user-info {
    flex: 1 0 100%;
    margin-bottom: 10px;
  }
  
  .user-role {
    width: 80px;
  }
  
  .user-actions {
    width: 70px;
  }
}
</style>