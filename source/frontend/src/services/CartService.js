import Api from '@/services/Api';

export default {
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