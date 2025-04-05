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
        if (userData && userData.data && userData.data.accessToken) {
            localStorage.setItem('userToken', userData.data.accessToken);
            localStorage.setItem('userData', JSON.stringify({
                id: userData.data.id,
                username: userData.data.username,
                email: userData.data.email,
                role: userData.data.role,
                avatar: userData.data.avatar
            }));
        }
    },
    
    // Đăng xuất
    logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
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
    }
}