import Api from '@/services/Api';
import AuthenticationService from '@/services/AuthenticationService';

export default {
    // Tạo đơn hàng mới
    createOrder(orderData) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Không tìm thấy token - cần đăng nhập lại');
            return Promise.reject(new Error('Authentication token not found'));
        }
        
        // Log chi tiết dữ liệu gửi đi
        console.log('Dữ liệu đơn hàng gửi đến API:', JSON.stringify(orderData, null, 2));
        
        return Api().post('order/create', orderData, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            console.log('API response:', response.data);
            return response;
        }).catch(error => {
            console.error('API error:', error.response?.data || error.message);
            throw error;
        });
    },

    // Lấy tất cả đơn hàng của một người dùng
    getAllOrders(userId) {
        const token = localStorage.getItem('token');
        return Api().get(`order/history/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
        
    // Lấy chi tiết một đơn hàng
    getOrderById(orderId) {
        const token = localStorage.getItem('token');
        return Api().get(`order/details/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    // Cập nhật trạng thái đơn hàng (chỉ staff)
    updateOrderStatus(orderId, orderStatus) {
        const token = localStorage.getItem('token');
        return Api().put(`order/update/${orderId}`, { orderStatus }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    // Tạo yêu cầu thanh toán với MoMo
    createMomoPayment(orderId, amount) {
        // Đảm bảo amount là số nguyên
        const amountInt = parseInt(amount);
        const userId = AuthenticationService.getCurrentUser().id;
        
        // Thêm headers với token
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Thêm userId vào request body
        return Api().post(`payment/momo/${userId}`, { 
            orderId, 
            amount: amountInt
        }, { headers });
    },

    // Kiểm tra trạng thái thanh toán
    checkTransactionStatus(orderId) {
        const userId = AuthenticationService.getCurrentUser()?.id;
        const token = localStorage.getItem('token');
        
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Thêm userId vào cả path params và request body
        return Api().post(`payment/momo/check-transaction-status/${userId}`, { 
            orderId,
            userId
        }, { headers });
    },
    
    // Tạo yêu cầu hủy đơn hàng
    // Tạo yêu cầu hủy đơn hàng
    createCancelRequest(orderId, reason) {
        // Lấy token hiện tại và đảm bảo gửi cùng với userId để giải quyết lỗi 403
        const userId = AuthenticationService.getCurrentUser()?.id;
        console.log('=== BẮT ĐẦU GỬI YÊU CẦU HỦY ĐƠN HÀNG ===');
        console.log('OrderID:', orderId);
        console.log('Lý do hủy:', reason);
        console.log('UserID:', userId);
        
        // Đảm bảo headers có token
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return Api().post(`order/cancel/${orderId}`, { 
            reason,
            userId // Thêm userId vào request body
        }, { headers })
        .then(response => {
            console.log('=== KẾT QUẢ HỦY ĐƠN HÀNG ===');
            console.log('Status:', response.status);
            console.log('Response:', response.data);
            return response;
        })
        .catch(error => {
            console.error('=== LỖI KHI HỦY ĐƠN HÀNG ===');
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.response?.data || error.message);
            throw error;
        });
    },
    
    // Cập nhật trạng thái yêu cầu hủy đơn hàng (chỉ staff)
    updateCancelRequestStatus(requestId, status) {
        return Api().patch(`order/cancel/${requestId}`, { status });
    },
    
    // Lấy tất cả yêu cầu hủy đơn hàng (chỉ staff)
    getAllCancelRequests() {
        return Api().get('order/cancel');
    },
    
    // Lấy chi tiết yêu cầu hủy đơn hàng (chỉ staff)
    getCancelRequestById(requestId) {
        return Api().get(`order/cancel/${requestId}`);
    },

    // Thêm phương thức xử lý callback từ MoMo
    handleMomoCallback(params) {
        // Lấy các tham số từ URL callback
        const orderId = params.orderId;
        const resultCode = params.resultCode;
        const transId = params.transId;
        const message = params.message;
        
        console.log('Callback data from MoMo:', { orderId, resultCode, transId, message });
        
        // Gửi dữ liệu callback đến backend để xác nhận và cập nhật đơn hàng
        return Api().post('payment/momo/callback', {
            orderId,
            resultCode,
            transId,
            message,
            extraData: params.extraData,
            signature: params.signature,
            payType: params.payType,
            responseTime: params.responseTime
        });
    },

    getOrderStatistics() {
        const token = localStorage.getItem('token');
        const headers = {};
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return Api().get('order/statistics', { headers })
            .then(response => {
                console.log('Thống kê đơn hàng:', response.data);
                return response;
            })
            .catch(error => {
                console.error('Lỗi khi lấy thống kê đơn hàng:', error.response?.data || error.message);
                throw error;
            });
    },
}