import Api from '@/services/Api';
import AuthenticationService from '@/services/AuthenticationService';

export default {
    // Thêm đánh giá cho sách
    addReview(bookId, reviewData) {
        const userId = AuthenticationService.getCurrentUser().id;
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('Token không tồn tại - Người dùng chưa đăng nhập');
            return Promise.reject(new Error('Authentication token not found'));
        }
        
        // Thêm userId vào request body
        return Api().post(`review/${bookId}`, {
            ...reviewData,
            userId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Cập nhật đánh giá
    updateReview(reviewId, updatedReview) {
        const userId = AuthenticationService.getCurrentUser().id;
        const token = localStorage.getItem('token');
        
        return Api().put(`review/${reviewId}`, {
            ...updatedReview,
            userId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Xóa đánh giá (chỉ staff)
    deleteReview(reviewId) {
        const userId = AuthenticationService.getCurrentUser().id;
        const token = localStorage.getItem('token');
        
        return Api().delete(`review/${reviewId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            data: { userId }
        });
    },
    
    // Lấy tất cả đánh giá của một sách
    getAllReviews(bookId) {
        // Lấy token nếu đã đăng nhập
        const token = localStorage.getItem('token');
        
        // Kiểm tra nếu có token, thêm vào header
        if (token) {
            return Api().get(`review/${bookId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
        
        // Nếu không có token, gọi API bình thường
        return Api().get(`review/${bookId}`);
    },
    
    // Ẩn đánh giá (chỉ staff)
    hideReview(reviewId) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không tồn tại - Người dùng chưa đăng nhập');
            return Promise.reject(new Error('Authentication token not found'));
        }
        
        return Api().patch(`review/hide/${reviewId}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },

    // Hiện đánh giá (chỉ staff)
    unhideReview(reviewId) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không tồn tại - Người dùng chưa đăng nhập');
            return Promise.reject(new Error('Authentication token not found'));
        }
        
        return Api().patch(`review/unhide/${reviewId}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    }
}