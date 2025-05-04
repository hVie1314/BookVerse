<template>
    <div class="action-buttons">
      <button class="buy-now-button">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2a79e75e4c878777ec56dd7bdc9146e84a5a316e?placeholderIfAbsent=true"
          class="button-icon"
          alt="Buy icon"
        />
        <span class="button-text">Mua sách ngay</span>
      </button>
  
      <button class="add-to-cart-button">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/c5ad92d22654c9d4b75f5fd5dfda7ab50490430c?placeholderIfAbsent=true"
          class="cart-icon"
          alt="Cart icon"
        />
        <span class="cart-text">Thêm vào giỏ hàng</span>
      </button>
  
      <button class="favorite-button">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/db3fc608a52b56fc3fba42309cdd515609085107?placeholderIfAbsent=true"
          class="favorite-icon"
          alt="Favorite icon"
        />
        <span class="favorite-text">Yêu thích</span>
      </button>
    </div>
</template>
  
<script>
    import CartService from '@/services/CartService';
    import WishlistService from '@/services/WishlistService';
    import eventBus from '@/eventBus.js';
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
    methods: {
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
                await WishlistService.addToWishlist(this.book._id || this.book.id);
                
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Đã thêm sản phẩm vào danh sách yêu thích',
                    autoClose: true,
                    duration: 3000
                });
            } catch (error) {
                console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
                eventBus.emit('show-alert', {
                    show: true,
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Không thể thêm sản phẩm vào danh sách yêu thích',
                    autoClose: true,
                    duration: 3000
                });
            }
        }
    }
}
</script>
  
<style scoped>
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