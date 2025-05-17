import Api from '@/services/Api';

export default {
    // Lấy thông tin của tất cả người dùng (chỉ admin)
    getAllCustomers() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ hoặc không tồn tại');
            return Promise.reject(new Error('Token không hợp lệ hoặc không tồn tại'));
        }
        
        return Api().get('user/customer', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
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
    getUserById(userId) {
        const token = localStorage.getItem('token');
        return Api().get(`user/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Cập nhật thông tin người dùng
    updateUserInfo(id, userData) {
        const token = localStorage.getItem('token');
        return Api().put(`user/${id}`, userData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Xóa người dùng (chỉ admin)
    deleteUser(id) {
        return Api().delete(`user/${id}`);
    }
}