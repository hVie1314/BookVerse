import axios from "axios";
import AuthenticationService from "./AuthenticationService";
import router from "@/router"; // Import router
import eventBus from "@/eventBus"; // Import event bus để hiển thị thông báo

// Flag để tránh nhiều yêu cầu refresh token cùng lúc
let isRefreshing = false;
let failedQueue = [];

// Thêm biến để theo dõi nếu đang kiểm tra mật khẩu 
let isPasswordValidation = false;

// Thêm phương thức để thiết lập trạng thái kiểm tra mật khẩu
export const setPasswordValidationMode = (value) => {
    isPasswordValidation = value;
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export default () => {
    // Lấy token từ localStorage nếu có
    const token = localStorage.getItem('token');
    
    const instance = axios.create({
        //baseURL: "https://bookverse-hcmus.vercel.app",
        baseURL: process.env.VUE_APP_ROOT_API || "https://bookverse-hcmus.vercel.app",
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
    
    // Thêm interceptor để xử lý lỗi
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Kiểm tra xem đây có phải lỗi 401 do mật khẩu không đúng không
            const isPasswordError = error.response && 
                error.response.status === 401 && 
                error.response.data && 
                error.response.data.errorCode === 'INVALID_OLD_PASSWORD';

            // Nếu đang trong chế độ kiểm tra mật khẩu hoặc là lỗi mật khẩu, skip refresh token
            if (isPasswordValidation || isPasswordError) {
                console.log('Đây là lỗi xác thực mật khẩu, không refresh token');
                // Reset flag nếu đang ở chế độ kiểm tra mật khẩu
                isPasswordValidation = false;
                // Trả về lỗi để component xử lý hiển thị thông báo
                return Promise.reject(error);
            }

            // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                // Thêm kiểm tra lỗi mật khẩu
                if (error.response.data && error.response.data.errorCode === 'INVALID_OLD_PASSWORD') {
                    console.log('Lỗi mật khẩu, không tiến hành refresh token');
                    return Promise.reject(error);
                }

                if (isRefreshing) {
                    // Nếu đang refresh, thêm request vào hàng đợi
                    return new Promise(function(resolve, reject) {
                        failedQueue.push({resolve, reject});
                    }).then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return instance(originalRequest);
                    }).catch(err => {
                        return Promise.reject(err);
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                // Thử refresh token
                try {
                    const refreshed = await AuthenticationService.refreshToken();
                    if (refreshed) {
                        const newToken = AuthenticationService.getToken();
                        // Cập nhật token cho request hiện tại và xử lý hàng đợi
                        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                        processQueue(null, newToken);
                        return instance(originalRequest);
                    } else {
                        // Nếu refresh thất bại, chuyển về trang đăng nhập
                        processQueue(error, null);
                        router.push('/login');
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    // Chuyển hướng về trang đăng nhập
                    router.push('/login');
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Các xử lý khác giữ nguyên
            if (error.response && error.response.status === 403) {
                console.error('Lỗi quyền truy cập:', error.response.data);
                if (error.config && error.config.url && 
                    (error.config.url.includes('review/') || 
                    error.config.url.includes('/review/') ||
                    error.config.url.includes('review?') ||
                    error.config.url.includes('/review?'))) {
                    console.log('Đã bỏ qua alert cho endpoint review');
                    return Promise.reject(error);
                }
                // Nếu người dùng đã đăng nhập nhưng không có quyền
                if (AuthenticationService.isLoggedIn()) {
                    eventBus.emit('show-alert', {
                        show: true,
                        type: 'error',
                        title: 'Lỗi quyền truy cập',
                        message: 'Bạn không có quyền thực hiện hành động này.',
                        autoClose: true,
                        duration: 3000
                    });
                } else {
                    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
                    router.push('/login');
                }
            }

            return Promise.reject(error);
        }
    );
    
    return instance;
};