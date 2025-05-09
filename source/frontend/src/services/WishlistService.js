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
    // Phương thức wrapper để tự động chọn loại wishlist phù hợp
    addToWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            const token = localStorage.getItem('token');
            
            if (!token) {
                // Hiển thị thông báo lỗi và chuyển hướng đến đăng nhập nếu cần
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'error',
                    title: 'Lỗi xác thực',
                    message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
                    autoClose: true
                });
                
                return Promise.reject(new Error('Authentication token not found'));
            }
            
            return this.addToUserWishlist(userId, productId)
                .then(response => {
                    eventBus.emit('wishlist-updated');
                    return response;
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        // Xử lý lỗi 401 Unauthorized
                        eventBus.emit('show-alert', {
                            show: true,
                            type: 'error',
                            title: 'Lỗi xác thực',
                            message: 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại',
                            autoClose: true
                        });
                    }
                    return Promise.reject(error);
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
    },

    checkProductInWishlist(productId) {
        if (AuthenticationService.isLoggedIn()) {
            const userId = AuthenticationService.getCurrentUser().id;
            return this.getUserWishlist(userId)
                .then(response => {
                    if (response.data && response.data.success && response.data.data) {
                        const wishlistItems = response.data.data.products || [];
                        return wishlistItems.some(item => {
                            if (typeof item.productId === 'string') {
                                return item.productId === productId;
                            }
                            
                            if (item.productId && item.productId._id) {
                                return item.productId._id === productId;
                            }
                            
                            if (item.productId && item.productId.toString) {
                                return item.productId.toString() === productId.toString();
                            }
                            
                            return false;
                        });
                    }
                    return false;
                })
                .catch(error => {
                    console.error('Lỗi khi kiểm tra sản phẩm trong wishlist:', error);
                    return false;
                });
        } else {
            // Kiểm tra trong wishlist khách nếu cần
            return Promise.resolve(false);
        }
    },
}