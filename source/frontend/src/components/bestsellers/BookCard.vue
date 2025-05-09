<template>
    <article class="book-card" @click="navigateToDetail">
        <img 
            :src="image" 
            :alt="title" 
            class="book-image" 
            @error="handleImageError" 
        />
        <div class="book-detail-info">
            <div class="price-container">
                <p class="current-price">{{ price }}</p>
                <p v-if="originalPrice" class="original-price">{{ originalPrice }}</p>
            </div>
            <h3 class="book-title">{{ title }}</h3>
            <p class="book-author">{{ author }}</p>
            <div class="footer-card-container">
                <button class="cart-button" @click.stop="addToCart">{{ cartText }}</button>
                <i class="fa-regular fa-heart fa-2xl" @click.stop="addToFavorites"></i>
            </div>
            <div class="book-sold">
                <div class="sold-title">
                    Đã bán 
                </div>
                <div class="sold-text">
                    {{ sold }}
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import CartService from '@/services/CartService';
import AuthenticationService from '@/services/AuthenticationService';
import eventBus from '@/eventBus.js';
export default {
    name: "BookCard",
    props: {
        bookId: {
            type: [String, Number],
            required: true
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        originalPrice: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        cartText: {
            type: String,
            required: true,
        },
        sold: {
            type: [String, Number], // Chấp nhận cả String và Number
            default: "0",
            validator: function(value) {
                // Chuyển đổi thành String nếu là Number
                return (typeof value === 'number' || typeof value === 'string');
            }
        },
    },
    methods: {
        handleImageError(e) {
            // Chuyển sang ảnh dự phòng khi ảnh gốc lỗi
            e.target.src = '/images/default-book-cover.jpg';
        },
        navigateToDetail() {
            this.$router.push({
                name: 'product-detail',
                params: { id: this.bookId }
            });
        },

        async addToCart() {
            try {
                await CartService.addToCart({ bookId: this.bookId, quantity: 1 });
                // Thông báo thành công (nếu bạn đang sử dụng toast notification)
                if (this.$toast) {
                    this.$toast.success("Đã thêm sách vào giỏ hàng");
                }
                
                // Emit sự kiện để cập nhật số lượng giỏ hàng
                eventBus.emit('cart-updated');
                
                console.log("Đã thêm sách ID:", this.bookId, "vào giỏ hàng");
            } catch (error) {
                console.error("Lỗi khi thêm sách vào giỏ hàng:", error);
                if (this.$toast) {
                    this.$toast.error("Không thể thêm sách vào giỏ hàng");
                }
            }
        },
        addToFavorites() {
    // Kiểm tra trạng thái đăng nhập
            if (!AuthenticationService.isLoggedIn()) {
                // Phát sự kiện hiển thị alert toàn cục
                eventBus.emit('show-alert', {
                    type: 'error',
                    title: 'Yêu cầu đăng nhập',
                    message: 'Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích'
                });
                return;
            }
            
            // Xử lý thêm vào danh sách yêu thích nếu đã đăng nhập
            console.log("Đã thêm sách vào danh sách yêu thích:", this.bookId);
            if (this.$toast) {
                this.$toast.success("Đã thêm vào danh sách yêu thích");
            }
        }
    },
};
</script>
  
<style scoped>
.book-card {
    width: 18%;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.book-image {
    padding-top: 10px;
    width: 100%;
    height: 200px;
    object-fit: contain;
    border-radius: 8px 8px 0 0;
    transition: transform 0.4s ease;
}

.book-card:hover .book-image {
    transform: scale(1.05);
}

.book-detail-info {
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.price-container {
    margin-top: 0;
}

.current-price {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #755e47;
    text-align: right;
}

.original-price {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 15px;
    color: #d70000;
    text-decoration: line-through;
    margin-top: 5px;
}

.book-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 12px;
    color: #755e47;
    margin-top: 10px;

    /* Thiết lập chiều cao cố định 3 dòng */
    display: -webkit-box;
    /* -webkit-line-clamp: 3; */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Đảm bảo luôn chiếm đúng 3 dòng */
    line-height: 1.3;
    height: 46.8px; /* = 1.3 * 12px * 3 dòng */
    min-height: 46.8px;
    max-height: 46.8px;
    margin-bottom: 0;
}

.book-author {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #8b7b6a;
    margin-top: 5px;

    /* Thiết lập chiều cao cố định 2 dòng */
    display: -webkit-box;
    /* -webkit-line-clamp: 2; */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Đảm bảo luôn chiếm đúng 2 dòng */
    line-height: 1.3;
    height: 31.2px; /* = 1.3 * 12px * 2 dòng */
    min-height: 31.2px;
    max-height: 31.2px;
    margin-bottom: 0;
}

.cart-button {
    color: #fff;
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    padding: 8px 10px;
    border-radius: 5px;
    box-shadow: 0px 5px 8px rgba(225, 106, 0, 0.19);
    
    background-color: #4d2900;
    border: none;
    cursor: pointer;
    width: 75%;
    transition: all 0.3s ease;
}

.cart-button:hover {
    background-color: #755e47;
    box-shadow: 0px 5px 12px rgba(225, 106, 0, 0.3);
    transform: translateY(-2px);
}

.heart-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
}

@media (max-width: 991px) {
    .book-card {
        width: calc(50% - 20px);
    }
}

@media (max-width: 640px) {
    .book-card {
        width: 100%;
        max-width: 300px;
    }
}

.footer-card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;   
}

.book-sold {
    font-family: "Montserrat", sans-serif;
    font-weight: 100;
    font-size: 12px;
    color: #8b7b6a;
    margin-top: 10px;
    margin-bottom: 0;
    display: flex;
    gap: 5px;
    transition: all 0.3s ease;
}

.book-card:hover .book-sold {
    color: #4d2900;
}

.sold-text {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 12px;
    color: #8b7b6a;
}

/* Hiệu ứng cho icon heart */
.fa-heart {
    color: #4d2900;
    opacity: 0.7;
    transition: all 0.3s ease;
    cursor: pointer;
}

.fa-heart:hover {
    color: #e74c3c;
    opacity: 1;
    transform: scale(1.2);
}

/* Hiệu ứng nền gradient cho card khi hover */
/* .book-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, #4d2900, #a67c52);
    opacity: 0;
    transition: opacity 0.3s ease;
} */

.book-card:hover::before {
    opacity: 1;
}


</style>
  