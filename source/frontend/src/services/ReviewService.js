import Api from '@/services/Api';

export default {
    // Thêm đánh giá cho sách
    addReview(bookId, reviewData) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            console.error('Token không tồn tại - Người dùng chưa đăng nhập');
            return Promise.reject(new Error('Authentication token not found'));
        }
        
        return Api().post(`review/${bookId}`, reviewData, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Cập nhật đánh giá
    updateReview(reviewId, reviewData) {
        return Api().put(`review/${reviewId}`, reviewData);
    },
    
    // Xóa đánh giá (chỉ staff)
    deleteReview(reviewId) {
        return Api().delete(`review/${reviewId}`);
    },
    
    // Lấy tất cả đánh giá của một sách
    getAllReviews(bookId) {
        return Api().get(`review/${bookId}`);
    },
    
    // Ẩn đánh giá (chỉ staff)
    hideReview(reviewId) {
        return Api().patch(`review/hide/${reviewId}`);
    },
    
    // Hiện đánh giá (chỉ staff)
    unhideReview(reviewId) {
        return Api().patch(`review/unhide/${reviewId}`);
    }
}