<template>
  <section class="profile-container">
    <ProfileHeader
      :profileImage="localUserData.profileImage"
      :email="localUserData.email"
      :name="localUserData.name"
    />
    <div class="divider"></div>

    <FormField
      label="Tên"
      type="text"
      :value="localUserData.name"
      @update:value="updateField('name', $event)"
    />

    <FormField
      label="Địa chỉ email"
      type="email"
      :value="localUserData.email"
      @update:value="updateField('email', $event)"
    />

    <FormField
      label="Địa chỉ"
      type="text"
      :value="localUserData.address"
      @update:value="updateField('address', $event)"
    />

    <!-- Phần vai trò với khả năng thay đổi -->
    <div class="role-section">
      <span class="role-label">Vai trò:</span>
      <div class="role-content">
        <span v-if="!isEditingRole" class="role-badge" :class="roleClass">
            {{ displayRoleName(localUserData.role) }}
        </span>
        <button v-if="!isEditingRole" class="edit-role-btn" @click="isEditingRole = true">
          <i class="fas fa-edit"></i> Thay đổi
        </button>
        
        <!-- Dropdown chọn vai trò -->
        <div v-if="isEditingRole" class="role-selector">
            <select v-model="selectedRole" class="role-select">
                <option value="admin">Admin</option>
                <option value="staff">Nhân viên</option>
                <option value="user">Khách hàng</option>
            </select>
            <div class="role-actions">
                <button class="role-apply-btn" @click="applyRoleChange">Áp dụng</button>
                <button class="role-cancel-btn" @click="cancelRoleChange">Hủy</button>
            </div>
        </div>
      </div>
    </div>

    <div v-if="localUserData.joinDate" class="join-date">
      <span class="join-date-label">Ngày tham gia:</span>
      <span class="join-date-value">{{ formatDate(localUserData.joinDate) }}</span>
    </div>

    <AvatarUpload
      :avatar="localUserData.profileImage"
      @update:avatar="updateField('profileImage', $event)"
    />

    <div class="divider"></div>

    <ActionButtons
      @delete="$emit('delete', localUserData)"
      @cancel="$emit('cancel')"
      @save="$emit('save', localUserData)"
    />
  </section>
</template>

<script>
import ProfileHeader from './ProfileHeader.vue';
import FormField from './FormFeild.vue';
import AvatarUpload from './AvatarUpload.vue';
import ActionButtons from './ActionButtons.vue';

export default {
  name: 'UserProfile',
  components: {
    ProfileHeader,
    FormField,
    AvatarUpload,
    ActionButtons
  },
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Tạo bản sao của userData để làm việc với local data thay vì thay đổi props
      localUserData: { ...this.userData },
      isEditingRole: false,
      selectedRole: ''
    };
  },
  watch: {
    // Cập nhật localUserData khi userData thay đổi từ bên ngoài
    userData: {
      handler(newValue) {
        this.localUserData = { ...newValue };
        this.selectedRole = this.localUserData.role;
      },
      deep: true
    }
  },
  created() {
    this.selectedRole = this.localUserData.role;
  },
  emits: ['save', 'cancel', 'delete'],
  computed: {
    roleClass() {
      const role = this.localUserData.role.toLowerCase();
      if (role === 'admin') return 'role-admin';
      if (role === 'nhân viên' || role === 'staff') return 'role-staff';
      return 'role-customer';
    }
  },
  methods: {
    displayRoleName(role) {
        if (role === 'admin') return 'Admin';
        if (role === 'staff') return 'Nhân viên';
        if (role === 'user') return 'Khách hàng';
        return role; // Fallback para otros valores
    },
    updateField(field, value) {
      // Cập nhật trường thông tin trong bản sao local
      this.localUserData[field] = value;
    },
    applyRoleChange() {
      this.localUserData.role = this.selectedRole;
      this.isEditingRole = false;
    },
    cancelRoleChange() {
      this.selectedRole = this.localUserData.role;
      this.isEditingRole = false;
    },
    formatDate(dateString) {
      if (!dateString) return 'Không có dữ liệu';
      
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    }
  }
};
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 100%;
}

.divider {
  height: 1px;
  background-color: #E5E0D8;
  margin: 20px 0;
}

.role-section, .join-date {
  padding: 10px 42px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.role-label, .join-date-label {
  font-weight: 500;
  color: #555;
  margin-right: 20px;
  min-width: 100px;
  display: inline-block;
}

.role-content {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  display: inline-block;
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

.join-date-value {
  color: #333;
}

.edit-role-btn {
  padding: 5px 10px;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.edit-role-btn:hover {
  background-color: #f0f0f0;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  animation: fadeIn 0.3s;
}

.role-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Montserrat, sans-serif;
  width: 100%;
}

.role-actions {
  display: flex;
  gap: 10px;
}

.role-apply-btn, .role-cancel-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.role-apply-btn {
  background-color: #4d2900;
  color: white;
  border: none;
}

.role-apply-btn:hover {
  background-color: #634000;
}

.role-cancel-btn {
  background-color: transparent;
  border: 1px solid #ccc;
}

.role-cancel-btn:hover {
  background-color: #f0f0f0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .role-section, .join-date {
    padding: 10px 20px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .role-label, .join-date-label {
    margin-bottom: 10px;
  }
  
  .role-selector {
    width: 100%;
  }
}
</style>