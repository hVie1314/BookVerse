import Api from '@/services/Api';

export default {
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