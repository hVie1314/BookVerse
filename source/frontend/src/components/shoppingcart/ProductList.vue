<template>
  <section class="product-list">
    <div class="cart-divider"></div>
    <div class="cart-summary">
      <p class="cart-count">Bạn có {{ itemCount }} sản phẩm trong giỏ hàng</p>
    </div>
    <div v-if="products.length === 0" class="empty-cart">
      <p>Giỏ hàng của bạn đang trống hãy <span class="shop-link" @click="$router.push('/')">mua sắm</span> đi nào.</p>
    </div>
    <ProductCard
      v-for="product in products"
      :key="product._id"
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
  width: 100%; /* Thay đổi từ 62% thành 100% */
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

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  color: #4d2900;
  text-align: center;
}

.shop-link {
  color: #4d2900;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  display: inline-block;
  transition: color 0.3s ease;
  padding: 0 2px;
}

.shop-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #4d2900;
  transition: width 0.3s ease;
}

.shop-link:hover {
  color: #755e47;
}

.shop-link:hover::after {
  width: 100%;
}
</style>