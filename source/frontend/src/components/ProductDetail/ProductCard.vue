<template>
    <article class="product-card">
      <img
        :src="product.image"
        class="product-image"
        alt="Product"
      />
      <h3 class="product-price">{{ product.price }}</h3>
      <h2 class="product-title">{{ product.title }}</h2>
      <p class="product-author">{{ product.author }}</p>
  
      <div class="cart-action">
        <button class="add-to-cart-button">giỏ hàng</button>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/92d75261c9c7f32d62e39cade518ca9f2e8ca00d?placeholderIfAbsent=true"
          class="cart-icon"
          alt="Cart"
        />
      </div>
    </article>
</template>
  
<script>
    export default {
        name: 'ProductCard',
        props: {
        product: {
            type: Object,
            required: true
        }
        }
    };
</script>
  
<style scoped>
    .product-card {
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
        display: flex;
        padding: 25px 29px;
        flex-direction: column;
        align-items: flex-start;
    }
    
    @media (max-width: 991px) {
        .product-card {
        padding: 25px 20px;
        }
    }
    
    .product-image {
        aspect-ratio: 0.69;
        object-fit: contain;
        object-position: center;
        width: 128px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        align-self: center;
        max-width: 100%;
    }
    
    .product-price {
        color: #4d2900;
        font-size: 18px;
        margin-top: 17px;
        font-weight: 700;
    }
    
    .product-title {
        color: #4d2900;
        margin-top: 11px;
        font-size: 12px;
        font-weight: 700;
    }
    
    .product-author {
        color: #4d2900;
        font-weight: 400;
        margin-top: 4px;
        font-size: 12px;
    }
    
    .cart-action {
        align-self: stretch;
        display: flex;
        margin-top: 15px;
        align-items: stretch;
        gap: 2px;
        color: rgba(255, 255, 255, 1);
        font-weight: 900;
        text-transform: uppercase;
    }
    
    .add-to-cart-button {
        border-radius: 3px;
        box-shadow: 0px 3px 8px 0px rgba(225, 106, 0, 0.19);
        padding: 8px 13px;
        background-color: #4d2900;
        color: #fff;
        border: none;
        cursor: pointer;
        font: inherit;
        text-transform: uppercase;
        font-weight: 900;
    }
    
    @media (max-width: 991px) {
        .add-to-cart-button {
        padding-right: 20px;
        }
    }
    
    .cart-icon {
        aspect-ratio: 1.25;
        object-fit: contain;
        object-position: center;
        width: 35px;
        flex-shrink: 0;
    }
</style>