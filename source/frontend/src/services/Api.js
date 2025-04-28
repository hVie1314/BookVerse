import axios from "axios";
import AuthenticationService from "./AuthenticationService";
import router from "@/router"; // Import router

// Flag để tránh nhiều yêu cầu refresh token cùng lúc
let isRefreshing = false;
let failedQueue = [];

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
    const token = localStorage.getItem('userToken');
    
    const instance = axios.create({
        baseURL: "http://localhost:3000",
        timeout: 10000,
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

            // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
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

            return Promise.reject(error);
        }
    );
    
    return instance;
};