import Api from '@/services/Api';
import AuthenticationService from './AuthenticationService';
import eventBus from '@/eventBus.js';
import BookService from './BookService';
import {useToast} from 'vue-toastification';

const toast = useToast();
export default {

    // Phương thức chung để thêm vào giỏ hàng
    // Trong CartService.js - Phương thức addToCart
    async addToCart({ bookId, quantity = 1 }) {
        try {
            if (AuthenticationService.isLoggedIn()) {
                const userId = AuthenticationService.getCurrentUser().id;
                console.log(`Thêm sách ${bookId} vào giỏ hàng người dùng ${userId}`);
                await this.addToUserCart(userId, bookId, quantity);
            } else {
                console.log(`Thêm sách ${bookId} vào giỏ hàng khách`);
                const guestCartId = this.ensureGuestCartId();
                await this.addToGuestCart(guestCartId, bookId, quantity);
            }
            
            // Phát sự kiện cập nhật giỏ hàng
            eventBus.emit('cart-updated');
            
            // Hiển thị toast thành công
            toast.success("Đã thêm sản phẩm vào giỏ hàng", {
                timeout: 2500
            });
            
            return true;
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            
            // Hiển thị toast lỗi
            toast.error("Không thể thêm sản phẩm vào giỏ hàng", {
                timeout: 2500
            });
            
            throw error;
        }
    },
    
    // Thêm sản phẩm vào giỏ hàng người dùng
    addToUserCart(userId, productId, quantity) {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        return Api().post('cart/', { userId, productId, quantity }, { headers });
    },
    
    // Cập nhật sản phẩm trong giỏ hàng người dùng
    updateUserCart(userId, productId, quantity) {
        const token = localStorage.getItem('token');
        return Api().put('cart/', 
            { userId, productId, quantity }, 
            { headers: { 'Authorization': `Bearer ${token}` }}
        );
    },
    
    // Xóa giỏ hàng người dùng
    clearUserCart(userId) {
        const token = localStorage.getItem('token');
        return Api().delete(`cart/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
    },
    
    // Lấy giỏ hàng của người dùng
    getUserCart(userId) {
        const token = localStorage.getItem('token');
        return Api().get(`cart/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
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
    // Gộp giỏ hàng khách vào giỏ hàng người dùng sau khi đăng nhập
    async mergeGuestCartToUserCart(userId, cartId) {
        // Đảm bảo userId là string và đúng định dạng
        const userIdString = String(userId).trim();
        
        console.log(`Kiểm tra giỏ hàng guest ${cartId} trước khi merge`);
        
        // Kiểm tra xem giỏ hàng guest có sản phẩm không
        try {
            // Lấy thông tin giỏ hàng guest trước
            const guestCartResponse = await this.getGuestCart(cartId);
            
            if (!guestCartResponse.data || !guestCartResponse.data.success || 
                !guestCartResponse.data.data || !guestCartResponse.data.data.products || 
                guestCartResponse.data.data.products.length === 0) {
                
                console.log('Giỏ hàng guest trống hoặc không tồn tại, không cần merge');
                // Xóa cartId từ localStorage và trả về thành công
                localStorage.removeItem('guestCartId');
                return { data: { success: true, message: 'Giỏ hàng trống, không cần merge' } };
            }
            
            console.log(`Merge giỏ hàng guest ${cartId} cho user ${userIdString} với ${guestCartResponse.data.data.products.length} sản phẩm`);
            
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Không tìm thấy token - cần đăng nhập lại');
                return Promise.reject(new Error('Authentication token not found'));
            }
            
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            
            // Cấu trúc lại request body để phù hợp với backend
            const requestData = {
                userId: userIdString,
                cartId: cartId
            };
            
            console.log('Gửi yêu cầu merge với dữ liệu:', requestData);
            
            // Kiểm tra xem API endpoint chính xác là gì - sửa thành 'cart/merge'
            return Api().post('cart/merge', requestData, { headers })
                .then(response => {
                    console.log('Merge cart response:', response.data);
                    eventBus.emit('cart-updated');
                    localStorage.removeItem('guestCartId');
                    return response;
                })
                .catch(error => {
                    console.error('Error details:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        headers: error.response?.headers
                    });
                    
                    if (error.response?.status === 404) {
                        console.log('API merge không tồn tại, xóa guestCartId');
                        localStorage.removeItem('guestCartId');
                        // Trả về response giả lập thành công
                        return { data: { success: true, message: 'Đã xóa giỏ hàng guest' } };
                    }
                    
                    throw error;
                });
        } catch (error) {
            console.error('Lỗi khi kiểm tra giỏ hàng guest:', error);
            // Xóa guestCartId để tránh lỗi lặp lại
            localStorage.removeItem('guestCartId');
            // Trả về thành công mặc dù có lỗi
            return { data: { success: true, message: 'Đã xóa guestCartId do lỗi' } };
        }
    },
    //////////////////////////
    // Lấy chi tiết đầy đủ của tất cả sản phẩm trong giỏ hàng
    // Lấy chi tiết đầy đủ của tất cả sản phẩm trong giỏ hàng
    async getCartItemsWithDetails(userId) {
        try {
            // 1. Lấy thông tin giỏ hàng cơ bản
            console.log(`Fetching cart for user ID: ${userId}`);
            const cartResponse = await this.getUserCart(userId);
            console.log('Cart response:', cartResponse.data);

            if (!cartResponse.data || !cartResponse.data.success) {
                console.log('API không trả về dữ liệu thành công');
                return { items: [], totalPrice: 0 };
            }
            
            const cartData = cartResponse.data.data;
            if (!cartData || !cartData.products || !Array.isArray(cartData.products)) {
                console.log('Cấu trúc dữ liệu giỏ hàng không hợp lệ:', cartData);
                return { items: [], totalPrice: 0 };
            }
            
            // 2. Xử lý phản hồi mới từ API
            const cartItems = cartData.products.map(item => {
                const productInfo = item.productId; // Bây giờ productId là một object chứa thông tin sách
                
                // Xử lý ảnh
                let imageUrl = '/images/default-book-cover.jpg';
                if (productInfo.image) {
                    try {
                        if (typeof productInfo.image === 'string' && 
                            productInfo.image.startsWith('[') && 
                            productInfo.image.endsWith(']')) {
                            const imageArray = JSON.parse(productInfo.image.replace(/'/g, '"'));
                            imageUrl = imageArray[0];
                        } else {
                            imageUrl = productInfo.image;
                        }
                    } catch (error) {
                        console.error('Lỗi xử lý ảnh:', error);
                    }
                }
                
                return {
                    _id: productInfo._id,
                    title: productInfo.title,
                    author: productInfo.author,
                    price: productInfo.price,
                    image: imageUrl,
                    rawImage: productInfo.image, // Giữ lại ảnh gốc nếu cần
                    quantity: item.quantity,
                    cartItemId: productInfo._id, // ID để xóa/cập nhật
                    book: productInfo // Giữ lại dữ liệu gốc
                };
            });
            
            const totalPrice = cartData.totalPrice;
            console.log(`Processed ${cartItems.length} items in cart. Total price: ${totalPrice}`);
            
            return {
                items: cartItems,
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
        console.log(`Xóa sản phẩm ${productId} khỏi giỏ hàng người dùng ${userId}`);
        const token = localStorage.getItem('token');
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng", {
            timeout: 2500
        });
        return Api().put('cart/', 
            { userId, productId, quantity: 0 }, 
            { headers: { 'Authorization': `Bearer ${token}` }}
        );
    },

    removeFromGuestCart(cartId, productId) {
        console.log(`Xóa sản phẩm ${productId} khỏi giỏ hàng khách ${cartId}`);
        return Api().put('cart/guest', 
            { cartId, productId, quantity: 0 }
        );
    },

    // Thêm phương thức này vào CartService.js
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
        
        // 2. Lấy thông tin chi tiết cho từng sản phẩm
        const itemsWithDetails = await Promise.all(
            cartItems.map(async (item, index) => {
                try {
                    // Kiểm tra xem productId có phải là object hay không
                    if (typeof item.productId === 'object' && item.productId !== null && item.productId._id) {
                        // Nếu productId đã là object chứa thông tin đầy đủ, sử dụng trực tiếp
                        console.log(`Item ${index + 1}/${cartItems.length} already has product details:`, item.productId);
                        
                        // Xử lý hình ảnh từ dữ liệu có sẵn
                        let imageUrl = '/images/default-book-cover.jpg';
                        if (item.productId.image) {
                            try {
                                if (typeof item.productId.image === 'string' && 
                                    item.productId.image.startsWith('[') && 
                                    item.productId.image.endsWith(']')) {
                                    // Parse chuỗi JSON thành mảng
                                    const imageArray = JSON.parse(item.productId.image.replace(/'/g, '"'));
                                    if (imageArray && imageArray.length > 0) {
                                        imageUrl = imageArray[0];
                                    }
                                } else {
                                    imageUrl = item.productId.image;
                                }
                            } catch (error) {
                                console.error('Lỗi xử lý ảnh:', error);
                            }
                        }
                        
                        return {
                            id: item.productId._id,
                            _id: item.productId._id,
                            title: item.productId.title,
                            author: item.productId.author,
                            price: item.productId.price,
                            image: imageUrl,
                            quantity: item.quantity,
                            cartItemId: item.productId._id,
                            book: item.productId
                        };
                    } else {
                        // Nếu productId là string ID, gọi API để lấy thông tin
                        const productId = typeof item.productId === 'string' ? item.productId : 
                                         (item.productId && item.productId._id) ? item.productId._id : item.productId;
                        
                        console.log(`Fetching details for guest cart product ${index + 1}/${cartItems.length}: ID ${productId}`);
                        const productResponse = await BookService.getBookById(productId);
                        console.log(`Product ${productId} response:`, productResponse.data);
                        
                        if (productResponse.data && productResponse.data.data) {
                            const bookData = productResponse.data.data.book || productResponse.data.data;
                            console.log(`Successfully fetched details for product ${productId}`);
                            
                            return {
                                ...productResponse.data.data,
                                book: bookData,
                                quantity: item.quantity,
                                cartItemId: productId
                            };
                        } else {
                            console.warn(`No data found for product ${productId}`);
                            // Sử dụng String() để đảm bảo an toàn trước khi gọi substring
                            const idString = String(productId);
                            return {
                                id: productId,
                                title: `Sách #${idString.substring(idString.length - 6)}`,
                                price: 0,
                                image: 'https://via.placeholder.com/150?text=No+Image',
                                author: 'Không có thông tin',
                                quantity: item.quantity,
                                cartItemId: productId
                            };
                        }
                    }
                } catch (error) {
                    console.error(`Lỗi khi lấy chi tiết sản phẩm:`, error);
                    
                    // Tạo sản phẩm mẫu an toàn không phụ thuộc vào item.productId
                    const safeId = typeof item.productId === 'string' ? item.productId : 
                                  (item.productId && item.productId._id) ? item.productId._id : 
                                  `unknown-${index}`;
                    
                    return {
                        id: safeId,
                        title: 'Không thể tải thông tin sách',
                        price: 0,
                        image: 'https://via.placeholder.com/150?text=No+Image',
                        author: 'Không có thông tin',
                        quantity: item.quantity,
                        cartItemId: safeId
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