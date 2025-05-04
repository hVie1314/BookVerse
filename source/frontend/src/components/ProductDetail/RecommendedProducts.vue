<template>
    <section class="recommended-products">
      <button class="nav-arrow left-arrow">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/86b2b344cfb856969953b54456f4fe1a831cc5c4?placeholderIfAbsent=true"
          class="arrow-icon"
          alt="Previous"
        />
      </button>
  
      <ProductCard
        v-for="(product, index) in products"
        :key="`product-${index}`"
        :product="product"
      />
  
      <button class="nav-arrow right-arrow">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/c47e7dad0fc9db7de1cbbc110c8e3a15dd7c654c?placeholderIfAbsent=true"
          class="arrow-icon"
          alt="Next"
        />
      </button>
    </section>
</template>
  
<script>
    import ProductCard from './ProductCard.vue';
    
    export default {
        name: 'RecommendedProducts',
        components: {
        ProductCard
        },
        data() {
        return {
            products: [
            {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/c19dbb29989a23c73cef7330c515a06e8168ec10?placeholderIfAbsent=true',
                price: 'Giá',
                title: 'tên',
                author: 'tác giả'
            },
            {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/2aa4c7cd5332a8b5ba630197e170dd624a6698df?placeholderIfAbsent=true',
                price: 'Giá',
                title: 'tên',
                author: 'tác giả'
            },
            {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/3b9379fd8f6644806a1da87184cc78f83d3be8e9?placeholderIfAbsent=true',
                price: 'Giá',
                title: 'tên',
                author: 'tác giả'
            },
            {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/d77f77d14c65e4a27b7424e2d22c70da93ad9423?placeholderIfAbsent=true',
                price: 'Giá',
                title: 'tên',
                author: 'tác giả'
            },
            {
                image: 'https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/afc2dc5e3d9c43d54c92b7571382d7b592a46a98?placeholderIfAbsent=true',
                price: 'Giá',
                title: 'tên',
                author: 'tác giả'
            }
            ]
        };
        }
    };
</script>
  
<style scoped>
    .recommended-products {
        display: flex;
        margin-top: 30px;
        align-items: stretch;
        gap: 15px;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 12px;
        color: #4d2900;
        font-weight: 700;
        line-height: 2;
        justify-content: space-between;
    }
    
    @media (max-width: 991px) {
        .recommended-products {
        margin-right: 10px;
        margin-top: 40px;
        }
    }
    
    .nav-arrow {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }
    
    .arrow-icon {
        aspect-ratio: 0.54;
        object-fit: contain;
        object-position: center;
        width: 22px;
        stroke-width: 1px;
        stroke: #4d2900;
        margin: auto 0;
        flex-shrink: 0;
    }
</style>