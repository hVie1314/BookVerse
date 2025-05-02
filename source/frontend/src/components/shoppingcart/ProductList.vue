<template>
  <section class="product-list">
    <div class="cart-divider"></div>
    <div class="cart-summary">
      <p class="cart-count">Bạn có {{ itemCount }} sản phẩm trong giỏ hàng</p>
      <button class="select-all">Chọn tất cả</button>
    </div>
    <div v-if="products.length === 0" class="empty-cart">
      <p>Giỏ hàng của bạn đang trống</p>
      <button class="continue-shopping" @click="$router.push('/')">Tiếp tục mua sắm</button>
    </div>
    <ProductCard
      v-for="product in products"
      :key="product.id || product._id"
      :product="product"
      @update-quantity="updateProductQuantity"
      @remove="removeProduct"
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
  props: {
    products: {
      type: Array,
      default: () => []
    },
    itemCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateProductQuantity(productId, quantity) {
      this.$emit('update-quantity', productId, quantity);
    },
    removeProduct(productId) {
      this.$emit('remove-item', productId);
    }
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