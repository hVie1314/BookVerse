<template>
  <section class="product-list">
    <div class="cart-divider"></div>
    <div class="cart-summary">
      <p class="cart-count">Bạn có 3 sản phẩm trong giỏ hàng</p>
      <button class="select-all">Chọn tất cả</button>
    </div>
    <ProductCard
      v-for="(product, index) in products"
      :key="index"
      :product="product"
    />
  </section>
</template>

<script>
import ProductCard from "./ProductCard.vue";

export default {
  name: "ProductList",
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [
        {
          image: "https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/01f1f192bb3216bf87a38bd6491a9aeb28e497cd?placeholderIfAbsent=true",
          name: "Italy Pizza",
          description: "Extra cheese and toping",
          price: 681,
        },
        {
          image: "https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/6eeb6ce64aec6b53776f9eff5524d99b5b16b98d?placeholderIfAbsent=true",
          name: "Combo Plate",
          description: "Extra cheese and toping",
          price: 681,
        },
        {
          image: "https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/31589fe5a4c387eb0d8f67ab6742b5773b76ba8e?placeholderIfAbsent=true",
          name: "Spanish Rice",
          description: "Extra garllic",
          price: 681,
        },
      ],
    };
  },
};
</script>

<style scoped>
.product-list {
  width: 62%;
}

.cart-divider {
  border-color: rgba(208, 207, 207, 1);
  border-style: solid;
  border-width: 2px;
  height: 2px;
  margin-bottom: 20px;
}

.cart-summary {
  display: flex;
  margin: 20px 0;
  align-items: center;
  justify-content: space-between;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 500;
}

.cart-count {
  color: rgba(30, 30, 30, 1);
}

.select-all {
  color: rgba(0, 0, 0, 1);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  transition: color 0.3s ease;
}

.select-all:hover {
  color: #4d2900;
  text-decoration: underline;
}

@media (max-width: 991px) {
  .product-list {
    width: 100%;
    margin-bottom: 30px;
  }

  .cart-summary {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>