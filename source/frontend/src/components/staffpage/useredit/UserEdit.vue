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
  </section>
</template>

<script>
import UserHeader from './UserHeader.vue';
import SearchFilter from './SearchFilter.vue';
import UserTable from './UserTable.vue';
import UserService from '@/services/UserService';
import eventBus from '@/eventBus.js';

export default {
  name: 'UserEdit',
  components: {
    UserHeader,
    SearchFilter,
    UserTable
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
      userToDelete: null
    };
  },
  created() {
    this.fetchAllUsers();
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
      // Xử lý khi nhấn nút sửa
      console.log('Sửa người dùng:', user);
      // TODO: Implement edit user functionality
    },
    
    handleDeleteUser(user) {
      // Hiển thị modal xác nhận xóa
      this.userToDelete = user;
      this.showDeleteConfirm = true;
    },
    
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.userToDelete = null;
    },
    
    async confirmDelete() {
      if (!this.userToDelete) return;
      
      try {
        await UserService.deleteUser(this.userToDelete.id);
        
        // Cập nhật danh sách
        this.allUsers = this.allUsers.filter(user => user.id !== this.userToDelete.id);
        this.applyFilters();
        this.totalUsers = this.allUsers.length;
        
        // Hiển thị thông báo thành công
        eventBus.emit('show-alert', {
          show: true,
          type: 'success',
          title: 'Thành công',
          message: `Đã xóa người dùng ${this.userToDelete.name} thành công`,
          autoClose: true
        });
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
        
        // Hiển thị thông báo lỗi
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể xóa người dùng. Vui lòng thử lại sau.',
          autoClose: true
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
</style>