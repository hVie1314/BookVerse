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
        return Api().post('cart/guest', { cartId, productId, quantity })
            .then(response => {
                // Phát sự kiện để cập nhật UI
                eventBus.emit('cart-updated');
                return response;
            });
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
            console.log(`Fetching cart for user ID: ${userId}`);
            const cartResponse = await this.getUserCart(userId);
            console.log('Cart response:', cartResponse.data);

            if (!cartResponse.data || !cartResponse.data.success || !cartResponse.data.data || !cartResponse.data.data.products) {
                console.log('Cấu trúc dữ liệu giỏ hàng không hợp lệ:', cartResponse.data);
                return [];
            }
            
            const cartItems = cartResponse.data.data.products;
            const totalPrice = cartResponse.data.data.totalPrice;
            console.log(`Found ${cartItems.length} items in cart. Total price: ${totalPrice}`);
            // 2. Lấy thông tin chi tiết cho từng sản phẩm
            const itemsWithDetails = await Promise.all(
                cartItems.map(async (item,index) => {
                    try {
                        console.log(`Fetching details for product ${index + 1}/${cartItems.length}: ID ${item.productId}`);
                        const productResponse = await BookService.getBookById(item.productId);
                        console.log(`Product ${item.productId} response:`, productResponse.data);
                        if (productResponse.data && productResponse.data.data) {
                            const bookData = productResponse.data.data.book || productResponse.data.data;
                            console.log(`Successfully fetched details for product ${item.productId}`);
                            
                            // Kết hợp thông tin chi tiết sản phẩm với số lượng từ giỏ hàng
                            return {
                                ...productResponse.data.data, // Giữ cấu trúc gốc
                                book: bookData, // Đảm bảo có thuộc tính book
                                quantity: item.quantity,
                                cartItemId: item.productId
                            };
                        } else {
                            console.warn(`No data found for product ${item.productId}`);
                            // Dữ liệu fallback nếu không thể lấy chi tiết sản phẩm
                            return {
                                id: item.productId,
                                title: `Sách #${item.productId.substring(item.productId.length - 6)}`,
                                price: 0,
                                image: '/src/images/new-books.jpg',
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
                            image: '/src/images/new-books.jpg',
                            author: 'Không có thông tin',
                            quantity: item.quantity,
                            cartItemId: item.productId
                        };
                    }
                })
            );
            console.log('Final cart items with details:', itemsWithDetails);
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

    // Thêm phương thức mới để xóa sản phẩm khỏi giỏ hàng người dùng
    removeFromUserCart(userId, productId) {
        return Api().put('cart/', { userId, productId, quantity: 0, isRemove: true });
    },

    // Thêm phương thức mới để xóa sản phẩm khỏi giỏ hàng khách
    removeFromGuestCart(cartId, productId) {
        return Api().put('cart/guest', { cartId, productId, quantity: 0, isRemove: true });
    },

    // Thêm phương thức này vào CartService.js
    async getGuestCartItemsWithDetails(guestCartId) {
        try {
            // 1. Lấy thông tin giỏ hàng cơ bản của khách
            console.log(`Fetching cart for guest ID: ${guestCartId}`);
            const cartResponse = await this.getGuestCart(guestCartId);
            console.log('Guest cart response:', cartResponse.data);

            if (!cartResponse.data || !cartResponse.data.success || !cartResponse.data.data || !cartResponse.data.data.products) {
                console.log('Cấu trúc dữ liệu giỏ hàng không hợp lệ:', cartResponse.data);
                return {
                    items: [],
                    totalPrice: 0
                };
            }
            
            const cartItems = cartResponse.data.data.products;
            const totalPrice = cartResponse.data.data.totalPrice;
            console.log(`Found ${cartItems.length} items in guest cart. Total price: ${totalPrice}`);
            
            // 2. Lấy thông tin chi tiết cho từng sản phẩm giống như với user cart
            const itemsWithDetails = await Promise.all(
                cartItems.map(async (item, index) => {
                    try {
                        console.log(`Fetching details for guest cart product ${index + 1}/${cartItems.length}: ID ${item.productId}`);
                        const productResponse = await BookService.getBookById(item.productId);
                        console.log(`Product ${item.productId} response:`, productResponse.data);
                        
                        if (productResponse.data && productResponse.data.data) {
                            const bookData = productResponse.data.data.book || productResponse.data.data;
                            console.log(`Successfully fetched details for product ${item.productId}`);
                            
                            return {
                                ...productResponse.data.data,
                                book: bookData,
                                quantity: item.quantity,
                                cartItemId: item.productId
                            };
                        } else {
                            console.warn(`No data found for product ${item.productId}`);
                            return {
                                id: item.productId,
                                title: `Sách #${item.productId.substring(item.productId.length - 6)}`,
                                price: 0,
                                image: 'https://via.placeholder.com/150?text=No+Image',
                                author: 'Không có thông tin',
                                quantity: item.quantity,
                                cartItemId: item.productId
                            };
                        }
                    } catch (error) {
                        console.error(`Lỗi khi lấy chi tiết sản phẩm ${item.productId}:`, error);
                        return {
                            id: item.productId,
                            title: 'Không thể tải thông tin sách',
                            price: 0,
                            image: 'https://via.placeholder.com/150?text=No+Image',
                            author: 'Không có thông tin',
                            quantity: item.quantity,
                            cartItemId: item.productId
                        };
                    }
                })
            );
            
            console.log('Final guest cart items with details:', itemsWithDetails);
            return {
                items: itemsWithDetails,
                totalPrice: totalPrice
            };
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết giỏ hàng khách:', error);
            return {
                items: [],
                totalPrice: 0
            };
        }
    },

    ensureGuestCartId() {
        let cartId = localStorage.getItem('guestCartId');
        if (!cartId) {
            cartId = 'guest_' + Date.now();
            localStorage.setItem('guestCartId', cartId);
        }
        return cartId;
    }
}