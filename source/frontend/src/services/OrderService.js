import Api from '@/services/Api';
import AuthenticationService from '@/services/AuthenticationService';

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
        // Lấy token hiện tại và đảm bảo gửi cùng với userId để giải quyết lỗi 403
        const userId = AuthenticationService.getCurrentUser()?.id;
        console.log('=== BẮT ĐẦU GỬI YÊU CẦU HỦY ĐƠN HÀNG ===');
        console.log('OrderID:', orderId);
        console.log('Lý do hủy:', reason);
        console.log('UserID:', userId);
        
        return Api().post(`order/cancel/${orderId}`, { 
            reason,
            userId // Thêm userId vào request body
        })
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

    
}