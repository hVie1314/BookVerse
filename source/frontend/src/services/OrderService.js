import Api from '@/services/Api';

export default {
    // Tạo đơn hàng mới
    createOrder(orderData) {
        return Api().post('order/create', orderData);
    },

    // Lấy tất cả đơn hàng của một người dùng
    getAllOrders(userId) {
        return Api().get(`order/history/${userId}`);
    },
        
    // Lấy chi tiết một đơn hàng
    getOrderById(orderId) {
        return Api().get(`order/details/${orderId}`);
    },

    // Cập nhật trạng thái đơn hàng (chỉ staff)
    updateOrderStatus(orderId, orderStatus) {
        return Api().put(`order/update/${orderId}`, { orderStatus }); // Loại bỏ khoảng trắng
    },

    // Tạo yêu cầu thanh toán với MoMo
    createMomoPayment(orderId, amount) {
        console.log('Dữ liệu gửi đi:', { orderId, amount });
        if (!orderId) {
            console.error('Lỗi: Missing orderId in MOMO payment request');
            return Promise.reject(new Error('Missing orderId'));
        }
        
        // Đảm bảo amount là số nguyên
        const amountInt = parseInt(amount);
        
        // Thêm headers nếu cần
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Thử với cấu trúc dữ liệu mới
        return Api().post('payment/momo', { 
            orderId, 
            amount: amountInt,
            // Thêm các trường khác nếu API yêu cầu
            redirectUrl: window.location.origin + '/payment/callback'
        }, { headers });
    },

    // Kiểm tra trạng thái thanh toán
    checkTransactionStatus(orderId) {
        return Api().post('payment/momo/check-transaction-status', { orderId });
    },
    
    // Tạo yêu cầu hủy đơn hàng
    createCancelRequest(orderId, reason) {
        return Api().post(`order/cancel/${orderId}`, { reason });
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
    }
}