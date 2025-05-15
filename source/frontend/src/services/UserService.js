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
    getUserById(userId) {
        const token = localStorage.getItem('token');
        // in thông tin token để test:
        console.log('Access token: ', token);
        return Api().get(`user/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Cập nhật thông tin người dùng
    updateUserInfo(id, userData) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('Token không tồn tại - Người dùng chưa đăng nhập');
            return Promise.reject(new Error('Authentication token not found'));
        }
        
        // Log dữ liệu gửi đi (loại bỏ mật khẩu trong log để bảo mật)
        const logData = { ...userData };
        if (logData.password) logData.password = '********';
        if (logData.oldPassword) logData.oldPassword = '********';
        console.log(`Cập nhật thông tin người dùng ${id} với dữ liệu:`, logData);
        
        return Api().put(`user/${id}`, userData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Xóa người dùng (chỉ admin)
    deleteUser(id) {
        return Api().delete(`user/${id}`);
    }
}