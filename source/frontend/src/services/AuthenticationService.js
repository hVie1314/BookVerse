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
            localStorage.setItem('token', userData.accessToken);
            localStorage.setItem('user', JSON.stringify({
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar
            }));
            
            // Phát sự kiện đăng nhập thành công
            eventBus.emit('user-logged-in', userData);
        }
    },
    
    // Đăng xuất - gọi API logout của backend
    async logout() {
        try {
            // Lấy token từ đúng key
            const token = localStorage.getItem('token');
            
            if (token) {
                // Đặt token vào header Authorization
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                
                try {
                    // Gọi API đăng xuất với token trong header
                    await Api().get('auth/logout', config);
                    console.log("Đăng xuất server thành công");
                } catch (error) {
                    console.log("Đăng xuất server thất bại:", error);
                }
            } else {
                console.log("Không có token, chỉ đăng xuất client");
            }
        } finally {
            // Xóa đúng key trong localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Phát sự kiện đăng xuất
            eventBus.emit('logout');
        }
    },
    
    // Làm mới token khi hết hạn
    async refreshToken() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;
            
            const response = await Api().get('auth/refresh-token', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data?.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                return true;
            }
            return false;
        } catch (error) {
            this.logout();
            return false;
        }
    },
    
    // Kiểm tra người dùng đã đăng nhập chưa
    isLoggedIn() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        // Kiểm tra xem token có hết hạn chưa (kiểm tra nhanh phía client)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Nếu jwt chứa exp, kiểm tra
            if (payload.exp) {
                return payload.exp * 1000 > Date.now();
            }
            return true;
        } catch (e) {
            console.error('Token không hợp lệ', e);
            return false;
        }
    },
    
    // Lấy thông tin người dùng hiện tại
    getCurrentUser() {
        try {
            const userJson = localStorage.getItem('user');
            if (!userJson) return null;
            
            // Kiểm tra token
            const token = localStorage.getItem('token');
            if (!token) {
                // Nếu không có token, xóa thông tin người dùng
                localStorage.removeItem('user');
                return null;
            }
            
            return JSON.parse(userJson);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            return null;
        }
    },
    
    // Lấy token hiện tại
    getToken() {
        return localStorage.getItem('token');
    },

    forgotPassword(email) {
        return Api().post('auth/forgot-password', { email });
    },
    
    // Xác thực OTP
    verifyOtp(email, otp) {
        return Api().post('auth/verify-otp', { email, otp });
    },
    
    // Đặt lại mật khẩu
    resetPassword(email, newPassword) {
        return Api().post('auth/reset-password', { email, newPassword });
    }
}