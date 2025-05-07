<template>
    <div class="product-container">
      <div class="product-details">
        <img :src="product.image" :alt="product.title" class="product-image" @error="handleImageError" />
        <div class="product-info">
          <h4 class="product-title">{{ product.title }}</h4>
          <p class="product-author">{{ product.author }}</p>
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
        }
    }
    }
</script>
  
<style scoped>
    .product-container {
        display: flex;
        width: 100%;
        align-items: stretch;
        gap: 5px; /* Giảm từ 8px */
        font-weight: 600;
        color: #000000;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .product-details {
        display: flex;
        align-items: stretch;
        gap: 8px; /* Giảm từ 10px */
        flex-wrap: wrap;
        flex: 1;
    }

    .product-image {
        aspect-ratio: 0.87;
        object-fit: contain;
        object-position: center;
        width: 50px; /* Giảm từ 65px */
        max-width: 100%;
    }

    .product-title {
        font-size: 20px; /* Giảm từ 15px */
        margin: 0;
        font-weight: 400;
    }

    .product-author {
        color: #917c7c;
        font-weight: 400;
        font-size: 11px; /* Giảm từ 12px */
        margin: 3px 0 0 0; /* Giảm từ 5px */
    }

    .product-quantity {
        font-size: 12px; /* Giảm từ 14px */
        margin: 3px 0 0 0; /* Giảm từ 5px */
    }

    .product-price {
        font-size: 15px; /* Giảm từ 18px */
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