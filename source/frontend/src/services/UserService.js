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
        
        // Chỉ gửi các trường được phép cập nhật theo backend
        const allowedFields = ['username', 'password', 'oldPassword', 'address', 'avatar'];
        const filteredData = {};
        
        Object.keys(userData).forEach(key => {
            if (allowedFields.includes(key) && userData[key] !== undefined) {
                filteredData[key] = userData[key];
            }
        });
        
        // Log dữ liệu gửi đi (loại bỏ mật khẩu trong log để bảo mật)
        const logData = { ...filteredData };
        if (logData.password) logData.password = '********';
        if (logData.oldPassword) logData.oldPassword = '********';
        console.log(`Cập nhật thông tin người dùng ${id} với dữ liệu:`, logData);
        
        return Api().put(`user/${id}`, filteredData, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(error => {
            console.error('Lỗi khi cập nhật thông tin:', error.response?.data || error.message);
            // Throw lại lỗi để component cha xử lý
            throw error;
        });
    },
    
    // Xóa người dùng (chỉ admin)
    deleteUser(id) {
        return Api().delete(`user/${id}`);
    }

}