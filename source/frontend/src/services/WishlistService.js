import Api from '@/services/Api';
import AuthenticationService from './AuthenticationService';
import eventBus from '@/eventBus.js';

export default {
    // Thêm sản phẩm vào wishlist người dùng
    addToUserWishlist(userId, productId) {
        const token = localStorage.getItem('token');
        return Api().post('wishlist/', { 
            userId,
            productId 
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Xóa sản phẩm khỏi wishlist người dùng
    removeFromUserWishlist(userId, productId) {
        const token = localStorage.getItem('token');
        return Api().delete('wishlist/', { 
            headers: { 'Authorization': `Bearer ${token}` },
            data: { userId, productId }
        });
    },
    
    // Lấy wishlist của người dùng theo userId
    getUserWishlist(userId) {
        const token = localStorage.getItem('token');
        return Api().get(`wishlist/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Thêm sản phẩm vào wishlist khách
    addToGuestWishlist(wishlistId, productId) {
        return Api().post('wishlist/guest', { wishlistId, productId });
    },
    
    // Xóa sản phẩm khỏi wishlist khách
    removeFromGuestWishlist(wishlistId, productId) {
        return Api().delete('wishlist/guest', { data: { wishlistId, productId } });
    },
    
    // Lấy wishlist của khách theo wishlistId
    getGuestWishlist(wishlistId) {
        return Api().get(`wishlist/guest/${wishlistId}`);
    },
    
    // Gộp wishlist khách vào wishlist người dùng sau khi đăng nhập
    mergeGuestWishlistToUserWishlist(userId, wishlistId) {
        return Api().post('wishlist/merge', { userId, wishlistId });
    },
    
    // Đảm bảo luôn có cartId cho khách
    ensureGuestWishlistId() {
        let wishlistId = localStorage.getItem('guestWishlistId');
        if (!wishlistId) {
            wishlistId = 'guest_wishlist_' + Date.now();
            localStorage.setItem('guestWishlistId', wishlistId);
        }
        return wishlistId;
    },
    
    // Phương thức wrapper để tự động chọn loại wishlist phù hợp
    addToWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            return this.addToUserWishlist(userId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    return response;
                });
        } else {
            const wishlistId = this.ensureGuestWishlistId();
            return this.addToGuestWishlist(wishlistId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    return response;
                });
        }
    },
    
    // Xóa sản phẩm khỏi wishlist
    removeFromWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            return this.removeFromUserWishlist(userId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    return response;
                });
        } else {
            const wishlistId = this.ensureGuestWishlistId();
            return this.removeFromGuestWishlist(wishlistId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    return response;
                });
        }
    }
}