<template>
    <div class="action-buttons">
      <button class="buy-now-button" @click="buyNow">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2a79e75e4c878777ec56dd7bdc9146e84a5a316e?placeholderIfAbsent=true"
          class="button-icon"
          alt="Buy icon"
        />
        <span class="button-text">Mua sách ngay</span>
      </button>
  
      <button class="add-to-cart-button" @click="addToCart">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/c5ad92d22654c9d4b75f5fd5dfda7ab50490430c?placeholderIfAbsent=true"
          class="cart-icon"
          alt="Cart icon"
        />
        <span class="cart-text">Thêm vào giỏ hàng</span>
      </button>
  
      <button class="favorite-button" @click="addToFavorites" :class="{ 'in-wishlist': isInWishlist }">
        <i 
            :class="['fa-heart fa-lg', isInWishlist ? 'fa-solid liked' : 'fa-regular']"
            aria-hidden="true"
        ></i>
        <span class="favorite-text">{{ isInWishlist ? 'Đã yêu thích' : 'Yêu thích' }}</span>
    </button>
    </div>
    <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner"></div>
        <p>Đang xử lý...</p>
    </div>
</template>
  
<script>
    import CartService from '@/services/CartService';
    import WishlistService from '@/services/WishlistService';
    import eventBus from '@/eventBus.js';
    import AuthenticationService from '@/services/AuthenticationService';
    import OrderService from '@/services/OrderService';
    import { useToast } from 'vue-toastification';
    export default {
    name: 'ProductActions',
    props: {
        book: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    },
    setup() {
        // Khởi tạo toast trong setup hook
        const toast = useToast();
        return { toast }; // Trả về toast cho template sử dụng
    },
    data() {
        return {
            isInWishlist: false,
            isLoading: false
        }
    },
    mounted() {
        this.checkWishlistStatus();
        eventBus.on('wishlist-updated', this.checkWishlistStatus);
    },
    beforeUnmount() {
        // Hủy lắng nghe khi component bị hủy
        eventBus.off('wishlist-updated', this.checkWishlistStatus);
    },
    watch: {
        // Theo dõi khi book thay đổi để cập nhật trạng thái
        'book.id': function() {
            this.checkWishlistStatus();
        },
        'book._id': function() {
            this.checkWishlistStatus();
        }
    },
    methods: {
         async checkWishlistStatus() {
            if (AuthenticationService.isLoggedIn()) {
                try {
                    const userId = AuthenticationService.getCurrentUser().id;
                    const bookId = this.book._id || this.book.id;
                    
                    // Log IDs để debug
                    console.log('Kiểm tra sách ID:', bookId);
                    
                    const response = await WishlistService.getUserWishlist(userId);
                    
                    // Log response để debug
                    console.log('WishlistService response:', response.data);
                    
                    // Xử lý linh hoạt hơn với nhiều cấu trúc dữ liệu có thể có
                    let wishlistItems = [];
                    if (response.data && response.data.success) {
                        if (response.data.data && response.data.data.products) {
                            wishlistItems = response.data.data.products;
                        } else if (response.data.data && response.data.data.wishlist && response.data.data.wishlist.products) {
                            wishlistItems = response.data.data.wishlist.products;
                        } else if (response.data.products) {
                            wishlistItems = response.data.products;
                        } else if (response.data.wishlist && response.data.wishlist.products) {
                            wishlistItems = response.data.wishlist.products;
                        }
                    }
                    
                    console.log('Danh sách sản phẩm yêu thích:', wishlistItems);
                    
                    // Chuẩn hóa bookId để so sánh
                    const normalizedBookId = String(bookId).trim();
                    
                    // Tìm kiếm sản phẩm trong danh sách yêu thích
                    this.isInWishlist = wishlistItems.some(item => {
                        // Xử lý nhiều trường hợp productId khác nhau
                        let itemId = '';
                        
                        if (typeof item.productId === 'string') {
                            itemId = item.productId;
                        } else if (item.productId && item.productId._id) {
                            itemId = item.productId._id;
                        } else if (item.productId && typeof item.productId.toString === 'function') {
                            itemId = item.productId.toString();
                        } else if (item._id) {
                            itemId = item._id;
                        } else if (item.id) {
                            itemId = item.id;
                        }
                        
                        // Chuẩn hóa itemId và so sánh
                        return String(itemId).trim() === normalizedBookId;
                    });
                    
                    console.log('Kết quả kiểm tra trong wishlist:', this.isInWishlist);
                    
                } catch (error) {
                    console.error('Lỗi khi kiểm tra trạng thái wishlist:', error);
                }
            } else {
                this.isInWishlist = false;
            }
        },

        animateToCart() {
            // Tìm hình ảnh sách từ trang chi tiết
            const bookImage = document.querySelector('.product-detail-image');
            // Tìm icon giỏ hàng trong navbar
            const cartIcon = document.querySelector('.fa-cart-shopping');
            
            if (!bookImage || !cartIcon) return;
            
            // Lấy vị trí và kích thước của hình ảnh sách
            const bookRect = bookImage.getBoundingClientRect();
            // Lấy vị trí của icon giỏ hàng
            const cartRect = cartIcon.getBoundingClientRect();
            
            // Tạo một phần tử ảnh mới để làm hiệu ứng
            const flyingImage = document.createElement('img');
            flyingImage.src = bookImage.src;
            flyingImage.style.position = 'fixed';
            flyingImage.style.zIndex = '9999';
            flyingImage.style.left = `${bookRect.left}px`;
            flyingImage.style.top = `${bookRect.top}px`;
            flyingImage.style.width = '100px';
            flyingImage.style.height = '130px';
            flyingImage.style.objectFit = 'contain';
            flyingImage.style.borderRadius = '8px';
            flyingImage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            flyingImage.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            flyingImage.style.opacity = '1';
            
            // Thêm phần tử vào body
            document.body.appendChild(flyingImage);
            
            // Thiết lập timeout để kích hoạt hiệu ứng bay sau khi phần tử được thêm vào DOM
            setTimeout(() => {
                flyingImage.style.left = `${cartRect.left}px`;
                flyingImage.style.top = `${cartRect.top}px`;
                flyingImage.style.width = '20px';
                flyingImage.style.height = '20px';
                flyingImage.style.opacity = '0.5';
                flyingImage.style.transform = 'rotate(360deg)';
            }, 50);
            
            // Xóa phần tử sau khi hoàn thành hiệu ứng
            setTimeout(() => {
                if (document.body.contains(flyingImage)) {
                    document.body.removeChild(flyingImage);
                }
            }, 1050);
        },
        async addToCart() {
            try {
                // Hiệu ứng bay vào giỏ hàng
                this.animateToCart();
                
                // Bọc emit trong try-catch riêng để có thể xử lý lỗi nhưng vẫn tiếp tục
                try {
                eventBus.emit('cart-animation');
                } catch (err) {
                console.error('Lỗi khi emit cart-animation:', err);
                // Vẫn tiếp tục thực hiện chức năng thêm vào giỏ hàng
                }
                
                // Thêm vào giỏ hàng thông qua API
                await CartService.addToCart({ 
                    bookId: this.book._id || this.book.id, 
                    quantity: this.quantity 
                });
                
                // Cập nhật số lượng giỏ hàng
                eventBus.emit('cart-updated');
            } catch (error) {
                console.error('Lỗi khi thêm vào giỏ hàng:', error);
                if (error.response && error.response.status === 400) {
                    this.toast.warning("Số lượng tồn kho không đủ. Vui lòng giảm số lượng hoặc chọn sản phẩm khác!", {
                        timeout: 3000
                    });
                }
                else {
                    this.toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.", {
                        timeout: 1500
                    });
                }
            }
        },
        
        async addToFavorites() {
            try {
                const bookId = this.book._id || this.book.id;
                
                // Xử lý thay đổi trạng thái yêu thích
                if (this.isInWishlist) {
                    // Nếu đã có trong wishlist, xóa khỏi wishlist
                    await WishlistService.removeFromWishlist(bookId);
                    this.isInWishlist = false;
                    
                } else {
                // Nếu chưa có, thêm vào wishlist
                const response = await WishlistService.addToWishlist(bookId);
                
                // Kiểm tra phản hồi từ API 
                if (!response.data || !response.data.success) {
                    throw new Error('Thêm vào yêu thích không thành công');
                }
                
                this.isInWishlist = true;
                
            }
                
                // Phát sự kiện để cập nhật UI wishlist
                eventBus.emit('wishlist-updated');
                
            } catch (error) {
                console.error('Lỗi khi thao tác với danh sách yêu thích:', error);
                
                // Xử lý lỗi với thông báo cụ thể
                let errorMessage = 'Không thể thực hiện thao tác. Vui lòng thử lại sau.';
                if (error.response) {
                    if (error.response.status === 401) {
                        errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
                    } else if (error.response.status === 409) {
                        errorMessage = 'Sản phẩm này đã có trong danh sách yêu thích của bạn';
                    }
                }
                
                this.toast.error(errorMessage, {
                    timeout: 1500
                });
            }
        },
        async buyNow() {
            try {
                // Kiểm tra đăng nhập
                const user = AuthenticationService.getCurrentUser();
                if (!user || !user.id) {
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'error',
                    title: 'Thông báo',
                    message: 'Vui lòng đăng nhập để mua sách',
                    autoClose: true
                });
                return;
                }
                
                // Hiển thị hộp thoại xác nhận với văn bản rõ ràng hơn
                const handleConfirm = () => {
                this.createOrderWithPayment();
                // Hủy đăng ký sau khi xử lý
                eventBus.off('confirm', handleConfirm);
                };
                
                const handleCancel = () => {
                this.createOrderWithoutPayment();
                // Hủy đăng ký sau khi xử lý
                eventBus.off('cancel', handleCancel);
                };
                
                // Đăng ký lắng nghe sự kiện
                eventBus.on('confirm', handleConfirm);
                eventBus.on('cancel', handleCancel);
                
                // Hiển thị alert
                eventBus.emit('show-alert', {
                show: true,
                type: 'success',
                title: 'Xác nhận đặt hàng',
                message: 'Bạn có muốn thanh toán đơn hàng luôn không?',
                autoClose: false,
                showChoices: true,
                confirmText: 'Thanh toán ngay',
                cancelText: 'Thanh toán sau'
                });
            } catch (error) {
                console.error('Lỗi khi xử lý mua sách ngay:', error);
                this.toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            }
        },

        async createOrderWithPayment() {
            try {
                // Hiển thị trạng thái loading
                this.isLoading = true;
                eventBus.emit('show-alert', {
                show: true,
                type: 'warning',
                title: 'Đang xử lý',
                message: 'Đang tạo đơn hàng...',
                autoClose: false
                });
                
                // 1. Tạo đơn hàng trước
                const bookId = this.book._id || this.book.id;
                const totalAmount = this.book.price * this.quantity;
                
                const orderData = {
                userId: AuthenticationService.getCurrentUser().id,
                items: [{
                    bookId: bookId,
                    quantity: this.quantity
                }],
                totalAmount: totalAmount,
                paymentMethod: 'MOMO'
                };
                
                console.log('Đang tạo đơn hàng với MoMo:', orderData);
                
                // Tạo đơn hàng
                const orderResponse = await OrderService.createOrder(orderData);
                console.log('Kết quả tạo đơn hàng:', orderResponse.data);
                
                if (orderResponse.data && (orderResponse.data.success || orderResponse.data._id)) {
                // 2. Lấy orderId từ response
                const orderId = orderResponse.data._id || 
                    orderResponse.data.data?._id || 
                    orderResponse.data.data?.order?._id || 
                    (orderResponse.data.order && orderResponse.data.order._id);

                console.log('OrderId trích xuất:', orderId);
                
                // 3. Tạo yêu cầu thanh toán MoMo
                const paymentResponse = await OrderService.createMomoPayment(orderId, totalAmount);
                console.log('Kết quả tạo thanh toán MoMo:', paymentResponse.data);
                
                if (paymentResponse.data && 
                        (paymentResponse.data.payUrl || 
                        paymentResponse.data.url || 
                        (paymentResponse.data.data && paymentResponse.data.data.url))
                    ) {
                    // Lấy URL thanh toán từ bất kỳ trường nào có giá trị
                    const paymentUrl = paymentResponse.data.payUrl || 
                                    paymentResponse.data.url || 
                                    (paymentResponse.data.data && paymentResponse.data.data.url);
                    
                    console.log('URL thanh toán MoMo:', paymentUrl);
                    
                    // 4. Lưu orderId để kiểm tra sau này
                    localStorage.setItem('pendingOrderId', orderId);
                    
                    // 5. Chuyển hướng người dùng đến trang thanh toán MoMo
                    window.location.href = paymentUrl;
                    return;
                }
                
                // Nếu không có payUrl, hiển thị thông báo lỗi
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'error',
                    title: 'Lỗi thanh toán',
                    message: 'Không thể tạo liên kết thanh toán MoMo. Vui lòng thử lại sau.',
                    autoClose: true
                });
                }
            } catch (error) {
                console.error('Lỗi khi tạo đơn hàng và thanh toán:', error);
                if (error.response && error.response.data && error.response.data.errorCode === 'MISSING_ADDRESS') {
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'warning',
                    title: 'Thiếu thông tin địa chỉ',
                    message: 'Vui lòng cập nhật địa chỉ giao hàng trong hồ sơ trước khi đặt hàng.',
                    autoClose: true,
                    duration: 5000,
                    textAlign: 'center'
                });
                
                // Chuyển hướng đến trang cập nhật hồ sơ sau 2 giây
                setTimeout(() => {
                    this.$router.push('/profile');
                }, 2000);
                
                return;
                }
                
                // Hiển thị thông báo lỗi
                eventBus.emit('show-alert', {
                show: true,
                type: 'error',
                title: 'Đặt hàng thất bại',
                message: 'Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại sau',
                autoClose: true
                });
            } finally {
                this.isLoading = false;
            }
        },

        async createOrderWithoutPayment() {
            try {
                // Hiển thị trạng thái loading
                this.isLoading = true;
                eventBus.emit('show-alert', {
                show: true,
                type: 'warning',
                title: 'Đang xử lý',
                message: 'Đang tạo đơn hàng...',
                autoClose: false
                });
                
                // Tạo dữ liệu đơn hàng
                const bookId = this.book._id || this.book.id;
                const totalAmount = this.book.price * this.quantity;
                
                const orderData = {
                userId: AuthenticationService.getCurrentUser().id,
                items: [{
                    bookId: bookId,
                    quantity: this.quantity
                }],
                totalAmount: totalAmount,
                paymentMethod: 'COD'
                };
                
                console.log('Đang tạo đơn hàng chưa thanh toán với dữ liệu:', orderData);
                
                // Tạo đơn hàng
                const response = await OrderService.createOrder(orderData);
                console.log('Kết quả tạo đơn hàng:', response.data);
                
                // Kiểm tra response
                if (response.data && (response.data.success || response.data._id)) {
                // Hiển thị thông báo thành công
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'success',
                    title: 'Đặt hàng thành công',
                    message: 'Bạn đã đặt hàng thành công, vui lòng qua đơn hàng của tôi để xác nhận thanh toán.',
                    autoClose: true,
                    duration: 5000
                });
                }
            } catch (error) {
                console.error('Lỗi khi tạo đơn hàng:', error);
                if (error.response && error.response.data && error.response.data.errorCode === 'MISSING_ADDRESS') {
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'warning',
                    title: 'Thiếu thông tin địa chỉ',
                    message: 'Vui lòng cập nhật địa chỉ giao hàng trong hồ sơ trước khi đặt hàng.',
                    autoClose: true,
                    duration: 5000,
                    textAlign: 'center'
                });
                
                // Chuyển hướng đến trang cập nhật hồ sơ sau 2 giây
                setTimeout(() => {
                    this.$router.push('/profile');
                }, 2000);
                
                return;
                }
                
                // Hiển thị thông báo lỗi
                eventBus.emit('show-alert', {
                show: true,
                type: 'error',
                title: 'Đặt hàng thất bại',
                message: 'Có lỗi xảy ra khi tạo đơn hàng, vui lòng thử lại sau',
                autoClose: true
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>
  
<style scoped>
    .fa-heart {
        color: #4d2900;
        opacity: 0.7;
        transition: all 0.3s ease;
        font-size: 22px; /* Đảm bảo kích thước giống như icon trước đó */
    }

    .fa-heart.liked {
        color: #e74c3c; /* Màu đỏ khi đã yêu thích */
        opacity: 1;
    }

    .favorite-button:hover .fa-heart {
        transform: scale(1.1);
    }

    .favorite-button.in-wishlist .fa-heart {
        color: #ff6b00;
    }
    .action-buttons {
        display: flex;
        margin-top: 39px;
        width: 100%;
        align-items: flex-end;
        gap: 49px 34px;
        font-family: Hind Siliguri, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 16px;
        color: rgba(76, 41, 0, 1);
        font-weight: 500;
        text-align: center;
        line-height: 40px;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    
    @media (max-width: 991px) {
        .action-buttons {
        max-width: 100%;
        }
    }
    
    .buy-now-button {
        border-radius: 8px;
        background-color: rgba(76, 41, 0, 1);
        display: flex;
        min-width: 240px;
        min-height: 68px;
        padding: 0 35px;
        align-items: center;
        gap: 14px;
        font-size: 24px;
        color: #fff;
        font-weight: 700;
        line-height: 2;
        justify-content: center;
        flex-wrap: wrap;
        flex-grow: 1;
        flex-shrink: 1;
        width: 580px;
        border: none;
        cursor: pointer;
    }
    
    @media (max-width: 991px) {
        .buy-now-button {
        max-width: 100%;
        padding: 0 20px;
        }
    }
    
    .button-icon {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 30px;
        align-self: stretch;
        margin: auto 0;
        flex-shrink: 0;
    }
    
    .button-text {
        color: #fff;
        align-self: stretch;
        margin: auto 0;
    }
    
    .add-to-cart-button {
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: 2px solid #4c2900;
        display: flex;
        min-width: 180px; /* Giảm từ 240px */
        min-height: 48px; /* Giảm từ 52px */
        padding: 0 20px; /* Giảm từ 35px */
        gap: 8px; /* Tăng từ 3px để spacing đều hơn */
        flex-grow: 1;
        flex-shrink: 1;
        width: 240px; /* Đảm bảo cả hai nút đều 240px */
        background-color: #fff;
        cursor: pointer;
    }
    
    @media (max-width: 991px) {
        .add-to-cart-button {
        padding: 0 20px;
        }
    }
    
    .cart-icon {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 22px; /* Giảm từ 24px */
        align-self: center; /* Căn giữa theo chiều dọc */
        margin: 0;
        flex-shrink: 0;
    }
    
    .cart-text {
        align-self: stretch;
        margin: auto 0;
        width: 140px;
    }
    
    .favorite-button {
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        border: 2px solid #4c2900;
        display: flex;
        min-width: 180px; /* Giảm từ 240px */
        min-height: 48px; /* Giảm từ 52px */
        padding: 0 20px; /* Giảm từ 35px */
        gap: 8px; /* Tăng từ 3px để spacing đều hơn */
        flex-grow: 1;
        flex-shrink: 1;
        width: 240px; /* Giữ nguyên */
        background-color: #fff;
        cursor: pointer;
    }
    
    @media (max-width: 991px) {
        .favorite-button {
        padding: 0 20px;
        }
    }
    
    .favorite-icon {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 22px; /* Tăng từ 20px */
        align-self: center; /* Căn giữa theo chiều dọc */
        margin: 0;
        flex-shrink: 0;
    }

    .cart-text, .favorite-text {
        align-self: center; /* Căn giữa theo chiều dọc */
        margin: 0;
        width: auto; /* Loại bỏ width cố định */
        white-space: nowrap; /* Ngăn text bị xuống dòng */
        font-size: 14px; /* Giảm kích thước chữ để phù hợp */
    }
    .favorite-text {
        align-self: stretch;
        margin: auto 0;
        width: 67px;
    }

    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(76, 41, 0, 0.2);
        border-top-color: #4c2900;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>