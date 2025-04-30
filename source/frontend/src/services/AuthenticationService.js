import Api from '@/services/Api';
import eventBus from '@/eventBus';

export default {
    // Đăng ký tài khoản mới
    register(credentials) {
        return Api().post('auth/register', credentials);
    },
    
    // Đăng nhập
    login(credentials) {
        return Api().post('auth/login', credentials);
    },
    
    // Lưu thông tin đăng nhập vào localStorage
    setUser(userData) {
        if (userData && userData.accessToken) {
            localStorage.setItem('userToken', userData.accessToken);
            localStorage.setItem('userData', JSON.stringify({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar
            }));
        }
    },
    
    // Đăng xuất - gọi API logout của backend
    async logout() {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                console.log("Không có token, chỉ đăng xuất client");
                return;
            }
            
            try {
                await Api().get('auth/logout');
                console.log("Đăng xuất server thành công");
            } catch (error) {
                console.log("Đăng xuất server thất bại, tiếp tục đăng xuất client");
            }
        } finally {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
        }
        eventBus.emit('logout'); // Phát sự kiện đăng xuất
    },
    
    // Làm mới token khi hết hạn
    async refreshToken() {
        try {
            const response = await Api().get('auth/refresh-token');
            if (response.data && response.data.accessToken) {
                localStorage.setItem('userToken', response.data.accessToken);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            // Xử lý trường hợp không thể làm mới token
            this.logout();
            return false;
        }
    },
    
    // Kiểm tra người dùng đã đăng nhập chưa
    isLoggedIn() {
        const token = localStorage.getItem('userToken');
        return !!token;
    },
    
    // Lấy thông tin người dùng hiện tại
    getCurrentUser() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },
    
    // Lấy token hiện tại
    getToken() {
        return localStorage.getItem('userToken');
    }
}