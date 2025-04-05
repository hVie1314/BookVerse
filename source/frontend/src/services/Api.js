import axios from "axios";

export default () => {
    // Lấy token từ localStorage nếu có
    const token = localStorage.getItem('userToken');
    
    const instance = axios.create({
        // Sửa baseURL để phù hợp với cấu trúc backend
        baseURL: "http://localhost:3000",
        // Thêm timeout để tránh request treo quá lâu
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            // Thêm Authorization header nếu có token
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
    });
    
    // Thêm interceptor để xử lý lỗi
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Xử lý lỗi 401 Unauthorized
            if (error.response && error.response.status === 401) {
                // Xóa token và chuyển hướng về trang đăng nhập
                localStorage.removeItem('userToken');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
    
    return instance;
}