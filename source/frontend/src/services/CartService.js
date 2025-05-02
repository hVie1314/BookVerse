import Api from '@/services/Api';
import AuthenticationService from './AuthenticationService';
import eventBus from '@/eventBus.js';
import BookService from './BookService';
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
            // console.log("Using guest cart ID for adding item:", cartId);
            // console.log("Adding book ID:", bookId, "with quantity:", quantity);
            
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
        console.log(`Merging guest cart ${cartId} to user ${userId}`);
        return Api().post('cart/merge', { userId, cartId })
          .then(response => {
            console.log('Merge cart response:', response.data);
            // Phát sự kiện để cập nhật UI giỏ hàng
            eventBus.emit('cart-updated');
            return response;
          })
          .catch(error => {
            console.error('Error merging cart:', error.response?.data || error.message);
            throw error;
          });
    },
    //////////////////////////
    // Lấy chi tiết đầy đủ của tất cả sản phẩm trong giỏ hàng
    async getCartItemsWithDetails(userId) {
        try {
            // 1. Lấy thông tin giỏ hàng cơ bản
            const cartResponse = await this.getUserCart(userId);
            
            if (!cartResponse.data || !cartResponse.data.success || !cartResponse.data.data || !cartResponse.data.data.products) {
                console.log('Cấu trúc dữ liệu giỏ hàng không hợp lệ:', cartResponse.data);
                return [];
            }
            
            const cartItems = cartResponse.data.data.products;
            const totalPrice = cartResponse.data.data.totalPrice;
            
            // 2. Lấy thông tin chi tiết cho từng sản phẩm
            const itemsWithDetails = await Promise.all(
                cartItems.map(async (item) => {
                    try {
                        const productResponse = await BookService.getBookById(item.productId);
                        
                        if (productResponse.data && productResponse.data.data) {
                            const productDetails = productResponse.data.data;
                            // Kết hợp thông tin chi tiết sản phẩm với số lượng từ giỏ hàng
                            return {
                                ...productDetails,
                                quantity: item.quantity,
                                cartItemId: item.productId
                            };
                        } else {
                            // Dữ liệu fallback nếu không thể lấy chi tiết sản phẩm
                            return {
                                id: item.productId,
                                title: `Sách #${item.productId.substring(item.productId.length - 6)}`,
                                price: 0,
                                image: '/images/default-book-cover.jpg',
                                author: 'Không có thông tin',
                                quantity: item.quantity,
                                cartItemId: item.productId
                            };
                        }
                    } catch (error) {
                        console.error(`Lỗi khi lấy chi tiết sản phẩm ${item.productId}:`, error);
                        // Trả về đối tượng mặc định nếu có lỗi
                        return {
                            id: item.productId,
                            title: 'Không thể tải thông tin sách',
                            price: 0,
                            image: '/images/default-book-cover.jpg',
                            author: 'Không có thông tin',
                            quantity: item.quantity,
                            cartItemId: item.productId
                        };
                    }
                })
            );
            
            return {
                items: itemsWithDetails,
                totalPrice: totalPrice
            };
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết giỏ hàng:', error);
            return {
                items: [],
                totalPrice: 0
            };
        }
    },
}