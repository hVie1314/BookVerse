import Api from '@/services/Api';
import AuthenticationService from './AuthenticationService';

export default {

    // Phương thức chung để thêm vào giỏ hàng
    // Trong CartService.js - Phương thức addToCart
    addToCart({ bookId, quantity = 1 }) {
        // Kiểm tra người dùng đã đăng nhập chưa
        if (AuthenticationService.isLoggedIn()) {
            const user = AuthenticationService.getCurrentUser();
            return this.addToUserCart(user.id, bookId, quantity);
        } else {
        // Lấy cartId từ localStorage nếu đã có
            let cartId = localStorage.getItem('guestCartId');
            if (!cartId) {
                // Tạo cartId mới nếu chưa có
                cartId = 'guest_' + Date.now();
                localStorage.setItem('guestCartId', cartId);
            }
            
            // Thêm debug log
            console.log("Using guest cart ID for adding item:", cartId);
            console.log("Adding book ID:", bookId, "with quantity:", quantity);
            
            return this.addToGuestCart(cartId, bookId, quantity);
        }
    },
    
    // Thêm sản phẩm vào giỏ hàng người dùng
    addToUserCart(userId, productId, quantity) {
        return Api().post('cart/', { userId, productId, quantity });
    },
    
    // Cập nhật sản phẩm trong giỏ hàng người dùng
    updateUserCart(userId, productId, quantity) {
        return Api().put('cart/', { userId, productId, quantity });
    },
    
    // Xóa giỏ hàng người dùng
    clearUserCart(userId) {
        return Api().delete(`cart/${userId}`);
    },
    
    // Lấy giỏ hàng của người dùng
    getUserCart(userId) {
        return Api().get(`cart/${userId}`);
    },
    
    // Thêm sản phẩm vào giỏ hàng khách
    addToGuestCart(cartId, productId, quantity) {
        return Api().post('cart/guest', { cartId, productId, quantity });
    },
    
    // Cập nhật sản phẩm trong giỏ hàng khách
    updateGuestCart(cartId, productId, quantity) {
        return Api().put('cart/guest', { cartId, productId, quantity });
    },
    
    // Xóa giỏ hàng khách
    clearGuestCart(cartId) {
        return Api().delete(`cart/guest/${cartId}`);
    },
    
    // Lấy giỏ hàng khách
    getGuestCart(cartId) {
        return Api().get(`cart/guest/${cartId}`);
    },
    
    // Gộp giỏ hàng khách vào giỏ hàng người dùng sau khi đăng nhập
    mergeGuestCartToUserCart(userId, cartId) {
        return Api().post('cart/merge', { userId, cartId });
    }
}