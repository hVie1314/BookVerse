<template>
  <section class="user-edit">
    <UserHeader :totalUsers="totalUsers" />
    <SearchFilter 
      @search="handleSearch" 
      @filter-change="handleFilterChange" 
    />
    
    <div v-if="loading" class="loading-container">
      <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="filteredUsers.length === 0" class="no-users-message">
      Không tìm thấy người dùng nào phù hợp với bộ lọc
    </div>
    
    <UserTable v-else :users="filteredUsers" @edit-user="handleEditUser" @delete-user="handleDeleteUser" />
    
    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="delete-confirm-modal">
        <h2>Xác nhận xóa người dùng</h2>
        <p>Bạn có chắc chắn muốn xóa người dùng <strong>{{ userToDelete?.name }}</strong>?</p>
        <p class="warning">Hành động này không thể hoàn tác!</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelDelete">Hủy</button>
          <button class="confirm-btn" @click="confirmDelete">Xóa</button>
        </div>
      </div>
    </div>

    <!-- Modal chỉnh sửa người dùng -->
    <transition name="fade">
      <div v-if="showEditModal" class="modal-overlay" @click.self="cancelEdit">
        <transition name="slide-up">
          <div v-if="showEditModal" class="edit-modal">
            <UserProfile 
              v-if="selectedUser"
              :userData="selectedUser"
              @cancel="cancelEdit"
              @save="saveUserChanges"
              @delete="handleDeleteFromEdit"
            />
          </div>
        </transition>
      </div>
    </transition>
  </section>
</template>

<script>
import UserHeader from './UserHeader.vue';
import SearchFilter from './SearchFilter.vue';
import UserTable from './UserTable.vue';
import UserProfile from './useredit/UserProfile.vue';
import UserService from '@/services/UserService';
import eventBus from '@/eventBus.js';
import { useToast } from 'vue-toastification';
export default {
  name: 'UserEdit',
  components: {
    UserHeader,
    SearchFilter,
    UserTable,
    UserProfile
  },
  data() {
    return {
      allUsers: [],
      filteredUsers: [],
      totalUsers: 0,
      loading: true,
      error: null,
      searchQuery: '',
      currentFilter: 'all',
      showDeleteConfirm: false,
      userToDelete: null,
      showEditModal: false,  // Thêm thuộc tính này
      selectedUser: null     // Thêm thuộc tính này
    };
  },
  created() {
    this.fetchAllUsers();
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        // Gọi API lấy tất cả người dùng từ UserService
        const [customersRes, staffsRes, adminsRes] = await Promise.all([
          UserService.getAllCustomers(),
          UserService.getAllStaffs(),
          UserService.getAllAdmins()
        ]);
        
        // Xử lý dữ liệu khách hàng
        const customers = customersRes.data.data || customersRes.data || [];
        const customersList = customers.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=4d2900&color=fff`,
          role: 'Khách hàng',
          joinDate: user.createdAt,
          rawData: user
        }));
        
        // Xử lý dữ liệu nhân viên
        const staffs = staffsRes.data.data || staffsRes.data || [];
        const staffsList = staffs.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=4d2900&color=fff`,
          role: 'Nhân viên',
          joinDate: user.createdAt,
          rawData: user
        }));
        
        // Xử lý dữ liệu admin
        const admins = adminsRes.data.data || adminsRes.data || [];
        const adminsList = admins.map(user => ({
          id: user._id,
          name: user.username,
          email: user.email,
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=4d2900&color=fff`,
          role: 'Admin',
          joinDate: user.createdAt,
          rawData: user
        }));
        
        // Kết hợp dữ liệu
        this.allUsers = [...customersList, ...staffsList, ...adminsList];
        this.filteredUsers = this.allUsers;
        this.totalUsers = this.allUsers.length;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        this.error = 'Không thể tải danh sách người dùng. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    
    handleSearch(query) {
      this.searchQuery = query;
      this.applyFilters();
    },
    
    handleFilterChange(filter) {
      this.currentFilter = filter;
      this.applyFilters();
    },
    
    applyFilters() {
      let filtered = [...this.allUsers];
      
      // Áp dụng tìm kiếm nếu có
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        );
      }
      
      // Áp dụng bộ lọc
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter(user => 
          user.role.toLowerCase() === this.currentFilter.toLowerCase()
        );
      }
      
      this.filteredUsers = filtered;
    },
    
    handleEditUser(user) {
      // Định dạng lại dữ liệu người dùng để phù hợp với UserProfile
      this.selectedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.rawData.address || '',
        profileImage: user.avatar,
        role: user.role,
        joinDate: user.joinDate,
        rawData: user.rawData
      };
      
      this.showEditModal = true;
      // Thêm class vào body để ngăn cuộn trang
      document.body.classList.add('overlay-active');
    },

    cancelEdit() {
      this.showEditModal = false;
      this.selectedUser = null;
      // Xóa class để cho phép cuộn lại
      document.body.classList.remove('overlay-active');
    },

    async saveUserChanges(updatedUser) {
      try {
        this.loading = true;
        
        // Lưu trữ vai trò ban đầu để kiểm tra xem có thay đổi không
        const originalRole = this.selectedUser.role;
        const newRole = updatedUser.role;
        
        // Chuẩn bị dữ liệu cập nhật (không bao gồm role)
        const userData = {
          username: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
          avatar: updatedUser.profileImage
        };
        
        // Gọi API cập nhật thông tin cơ bản
        await UserService.updateUserInfo(updatedUser.id, userData);
        
        // Nếu vai trò đã thay đổi, cập nhật bằng API riêng
        if (originalRole !== newRole) {
          // Chuyển đổi từ tên hiển thị sang giá trị vai trò trong DB
          let roleValue = newRole.toLowerCase();
          if (roleValue === 'khách hàng') roleValue = 'user';
          
          await UserService.setRole(updatedUser.id, roleValue);
        }
        
        // Cập nhật danh sách người dùng
        await this.fetchAllUsers();
        
        // Hiển thị thông báo thành công
        eventBus.emit('show-alert', {
          show: true,
          type: 'success',
          title: 'Thành công',
          message: `Đã cập nhật thông tin người dùng ${updatedUser.name} thành công`,
          autoClose: true
        });
        
        // Đóng modal
        this.cancelEdit();
      } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        
        // Hiển thị thông báo lỗi chi tiết hơn
        let errorMessage = 'Không thể cập nhật thông tin người dùng. Vui lòng thử lại sau.';
        
        if (error.response) {
          if (error.response.status === 403) {
            errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
        
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: errorMessage,
          autoClose: true
        });
      } finally {
        this.loading = false;
      }
    },

    handleDeleteUser(user) {
      this.userToDelete = user;
      this.showDeleteConfirm = true;
    },
    
    handleDeleteFromEdit(user) {
      this.userToDelete = user;
      this.showDeleteConfirm = true;
      this.showEditModal = false;
    },
    
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.userToDelete = null;
    },
    
    async confirmDelete() {
      if (!this.userToDelete) return;
      
      try {
        if (this.userToDelete.role === 'Admin') {
          // Kiểm tra xem còn bao nhiêu Admin trong hệ thống
          const admins = this.allUsers.filter(user => user.role === 'Admin');
          
          if (admins.length <= 1) {
            eventBus.emit('show-alert', {
              show: true,
              type: 'error',
              title: 'Lỗi',
              message: 'Không thể xóa Admin duy nhất trong hệ thống!',
              autoClose: true
            });
            this.showDeleteConfirm = false;
            this.userToDelete = null;
            return;
          }
          
        }
        await UserService.deleteUser(this.userToDelete.id);
        
        // Cập nhật danh sách
        this.allUsers = this.allUsers.filter(user => user.id !== this.userToDelete.id);
        this.applyFilters();
        this.totalUsers = this.allUsers.length;
        
        // Hiển thị thông báo thành công
        this.toast.success(`Đã xóa người dùng ${this.userToDelete.name} thành công!`, {
          timeout: 1500,
          closeOnClick: true
        });
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        
        // Hiển thị thông báo lỗi
        this.toast.error('Không thể xóa người dùng. Vui lòng thử lại sau.', {
          timeout: 1500,
          closeOnClick: true
        });
      } finally {
        this.showDeleteConfirm = false;
        this.userToDelete = null;
      }
    }
  }
};
</script>

<style scoped>
.user-edit {
  background-color: #F4EBE1;
  padding: 38px 42px;
  min-height: 100%;
  overflow: hidden;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #4d2900;
  margin-top: 40px;
}

.error-message, .no-users-message {
  text-align: center;
  font-size: 18px;
  color: #e53935;
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-users-message {
  color: #4d2900;
}

/* Modal xác nhận xóa */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.delete-confirm-modal {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.delete-confirm-modal h2 {
  color: #4d2900;
  margin-top: 0;
  font-size: 20px;
}

.delete-confirm-modal p {
  margin: 16px 0;
  color: #333;
}

.warning {
  color: #e53935;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.confirm-btn {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

@media (max-width: 991px) {
  .user-edit {
    padding: 38px 20px;
  }
}

.edit-modal {
  background-color: white;
  border-radius: 10px;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .edit-modal {
    width: 95%;
  }
}

:deep(body.overlay-active) {
  overflow: hidden;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s, opacity 0.3s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>