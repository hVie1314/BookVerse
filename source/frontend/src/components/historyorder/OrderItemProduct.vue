<template>
    <div class="product-container">
        <div class="product-details">
            <!-- Thêm router-link vào hình ảnh -->
            <router-link :to="{ name: 'product-detail', params: { id: getProductId() }}" class="product-image-link">
                <img :src="product.image" :alt="product.title" class="product-image" @error="handleImageError" />
            </router-link>
        
            <div class="product-info">
                <!-- Thêm router-link vào tiêu đề và tác giả -->
                <router-link :to="{ name: 'product-detail', params: { id: getProductId() }}" class="product-text-link">
                    <h4 class="product-title">{{ product.title }}</h4>
                    <p class="product-author">{{ product.author }}</p>
                </router-link>
                <p class="product-quantity">x{{ product.quantity }}</p>
            </div>
        </div>
        <p class="product-price">{{ product.price }}</p>
    </div>
</template>
  
<script>
    export default {
        name: 'OrderItemProduct',
        props: {
            product: {
                type: Object,
                required: true
            }
        },
        mounted() {
            // Kiểm tra xem product đã có xử lý ảnh chưa
            if (this.product.image && 
                typeof this.product.image === 'string' && 
                this.product.image.startsWith('[')) {
                console.warn('Ảnh sản phẩm chưa được xử lý đúng cách:', this.product.image);
            }
        },
        methods: {
            handleImageError(e) {
                e.target.src = `https://picsum.photos/seed/${Date.now()}/50/80`;
            },
            // Thêm phương thức mới để lấy ID sản phẩm
            getProductId() {
                // Kiểm tra trực tiếp bookId - thuộc tính chính xác được thêm từ formatProducts
                console.log("product: ", this.product);
                if (this.product.bookId) {
                    return this.product.bookId;
                }
                
                // Fallback, trả về một ID an toàn
                return 'unknown';
            }
        }
    }
</script>
  
<style scoped>
    .product-container {
        display: flex;
        width: 100%;
        align-items: stretch;
        gap: 5px;
        font-weight: 600;
        color: #000000;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .product-details {
        display: flex;
        align-items: stretch;
        gap: 8px;
        flex-wrap: wrap;
        flex: 1;
    }

    .product-image {
        aspect-ratio: 0.87;
        object-fit: contain;
        object-position: center;
        width: 50px;
        max-width: 100%;
    }

    /* Thêm style mới cho các liên kết */
    .product-image-link {
        display: block;
        text-decoration: none;
        cursor: pointer;
    }
    
    .product-text-link {
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }
    
    .product-text-link:hover .product-title {
        color: #4D2900;
        text-decoration: underline;
    }

    .product-title {
        font-size: 20px;
        margin: 0;
        font-weight: 400;
        transition: color 0.2s;
    }

    .product-author {
        color: #917c7c;
        font-weight: 400;
        font-size: 11px;
        margin: 3px 0 0 0;
    }

    .product-quantity {
        font-size: 12px;
        margin: 3px 0 0 0;
    }

    .product-price {
        font-size: 15px;
        text-align: center;
        align-self: center;
        margin: 0;
    }
  
    @media (max-width: 991px) {
        .product-info {
            max-width: 100%;
        }
    
        .product-price {
            margin-top: 40px;
        }
    }
</style>