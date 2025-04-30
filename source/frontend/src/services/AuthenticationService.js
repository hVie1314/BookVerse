import Api from '@/services/Api';
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
            // Thử làm mới token trước khi đăng xuất
            const token = localStorage.getItem('userToken');
            if (!token) {
                console.log("Không có token, đã đăng xuất trên client");
                return;
            }
    
            // Sử dụng Api() từ Api.js để tận dụng cơ chế refresh token tự động
            await Api().get('auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
            // Nếu không thể refresh token hoặc đăng xuất từ server,
            // vẫn tiếp tục đăng xuất ở phía client
        } finally {
            // Luôn xóa dữ liệu local bất kể kết quả từ server
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            console.log("Đã xóa token:", localStorage.getItem('userToken'));
            console.log("Đã xóa userData:", localStorage.getItem('userData'));
        }
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