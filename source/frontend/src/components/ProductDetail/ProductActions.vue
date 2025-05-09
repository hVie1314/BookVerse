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
</template>
  
<script>
    import CartService from '@/services/CartService';
    import WishlistService from '@/services/WishlistService';
    import eventBus from '@/eventBus.js';
    import AuthenticationService from '@/services/AuthenticationService';
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
    data() {
        return {
            isInWishlist: false
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
                    
                    const response = await WishlistService.getUserWishlist(userId);
                    
                    if (response.data && response.data.success && response.data.data) {
                        const wishlistItems = response.data.data.products || [];
                        
                        // Cải thiện cách so sánh
                        this.isInWishlist = wishlistItems.some(item => {
                            if (typeof item.productId === 'string') {
                                return item.productId === bookId;
                            }
                            
                            if (item.productId && item.productId._id) {
                                return item.productId._id === bookId;
                            }
                            
                            if (item.productId && item.productId.toString) {
                                return item.productId.toString() === bookId.toString();
                            }
                            
                            return false;
                        });
                    }
                } catch (error) {
                    console.error('Lỗi khi kiểm tra trạng thái wishlist:', error);
                }
            } else {
                this.isInWishlist = false;
            }
        },
        async addToCart() {
            try {
                await CartService.addToCart({ 
                    bookId: this.book._id || this.book.id, 
                    quantity: this.quantity 
                });
                
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã thêm sản phẩm vào giỏ hàng',
                    autoClose: true,
                    duration: 3000
                });
                
                eventBus.emit('cart-updated');
            } catch (error) {
                console.error('Lỗi khi thêm vào giỏ hàng:', error);
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể thêm sản phẩm vào giỏ hàng',
                    autoClose: true,
                    duration: 3000
                });
            }
        },
        
        async addToFavorites() {
            try {
                const bookId = this.book._id || this.book.id;
                
                // Kiểm tra đăng nhập trước khi thêm vào yêu thích
                if (!AuthenticationService.isLoggedIn()) {
                    eventBus.emit('show-alert', {
                        show: true,
                        type: 'warning',
                        title: 'Yêu cầu đăng nhập',
                        message: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích',
                        autoClose: true,
                        duration: 3000,
                        showChoices: true,
                        confirmText: 'Đăng nhập',
                        cancelText: 'Hủy',
                        choices: [
                            {
                                text: 'Đăng nhập',
                                onClick: () => this.$router.push('/login')
                            },
                            {
                                text: 'Hủy',
                                onClick: () => {}
                            }
                        ]
                    });
                    return;
                }
                
                const response = await WishlistService.addToWishlist(bookId);
                
                // Kiểm tra phản hồi từ API trước khi hiển thị thông báo thành công
                if (!response.data || !response.data.success) {
                    throw new Error('Thêm vào yêu thích không thành công');
                }
                
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã thêm sản phẩm vào danh sách yêu thích',
                    autoClose: true,
                    duration: 3000
                });
                this.isInWishlist = true; // Cập nhật trạng thái yêu thích
            } catch (error) {
                console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
                
                // Thông báo lỗi cụ thể hơn dựa trên mã lỗi
                let errorMessage = 'Không thể thêm sản phẩm vào danh sách yêu thích';
                if (error.response) {
                    if (error.response.status === 401) {
                        errorMessage = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
                    } else if (error.response.status === 409) {
                        errorMessage = 'Sản phẩm này đã có trong danh sách yêu thích của bạn';
                    }
                }
                
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: errorMessage,
                    autoClose: true,
                    duration: 3000
                });
            }
        },
        buyNow() {
            // Đầu tiên thêm sản phẩm vào giỏ hàng
            this.addToCart();
            
            // Sau đó chuyển hướng đến trang giỏ hàng
            setTimeout(() => {
                this.$router.push('/cart');
            }, 300);
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
</style>