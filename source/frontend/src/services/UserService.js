import Api from '@/services/Api';

export default {
    // Lấy thông tin của tất cả người dùng (chỉ admin)
    getAllCustomers() {
        return Api().get('user/customers');
    },
    
    // Lấy thông tin của tất cả nhân viên (chỉ admin)
    getAllStaffs() {
        return Api().get('user/staffs');
    },
    
    // Lấy thông tin của tất cả admin (chỉ admin)
    getAllAdmins() {
        return Api().get('user/admins');
    },
    
    // Lấy thông tin người dùng theo ID
    getUserById(id) {
        return Api().get(`user/${id}`);
    },
    
    // Cập nhật thông tin người dùng
    updateUserInfo(id, userData) {
        return Api().put(`user/${id}`, userData);
    },
    
    // Xóa người dùng (chỉ admin)
    deleteUser(id) {
        return Api().delete(`user/${id}`);
    }
}