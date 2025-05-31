<template>
  <section class="product-list">
    <div class="cart-divider"></div>
    <div class="cart-summary">
      <p class="cart-count">Bạn có {{ itemCount }} sản phẩm trong giỏ hàng</p>
      
      <!-- Add select all checkbox -->
      <div class="select-all-container" v-if="products.length > 0">
        <input 
          type="checkbox" 
          id="selectAll" 
          class="select-all-checkbox" 
          :checked="allSelected"
          @change="toggleSelectAll"
        />
        <div for="selectAll" class="select-all-label">Chọn tất cả</div>
      </div>
    </div>
    
    <div v-if="products.length === 0" class="empty-cart">
      <p>Giỏ hàng của bạn đang trống hãy <span class="shop-link" @click="$router.push('/')">mua sắm</span> đi nào.</p>
    </div>
    
    <ProductCard
      v-for="product in products"
      :key="product._id"
      :product="product"
      :isSelected="selectedItems.includes(product.cartItemId || product._id)"
      @update-quantity="updateProductQuantity"
      @remove="removeProduct"
      @toggle-selection="toggleProductSelection"
    />
  </section>
  <div class="cart-actions" v-if="selectedItems.length > 0">
    <button class="remove-selected-btn" @click="removeSelectedItems">
      <i class="fa-solid fa-trash"></i> Xóa đã chọn ({{ selectedItems.length }})
    </button>
  </div>
</template>

<script>
import ProductCard from "./ProductCard.vue";
import eventBus from '@/eventBus';

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
  emits: [
    'update-quantity',
    'remove-item',
    'remove-selected',
    'selection-changed'
  ],
  data() {
    return {
      selectedItems: []
    };
  },
  computed: {
    allSelected() {
      return this.products.length > 0 && this.selectedItems.length === this.products.length;
    }
  },
  methods: {
    updateProductQuantity(productId, quantity) {
      this.$emit('update-quantity', productId, quantity);
    },
    removeProduct(productId) {
      this.$emit('remove-item', productId);
      // Remove from selected items if it was selected
      this.selectedItems = this.selectedItems.filter(id => id !== productId);
    },
    toggleProductSelection(productId) {
      if (this.selectedItems.includes(productId)) {
        this.selectedItems = this.selectedItems.filter(id => id !== productId);
      } else {
        this.selectedItems.push(productId);
      }
      this.$emit('selection-changed', this.selectedItems);
    },
    toggleSelectAll() {
      if (this.allSelected) {
        // Deselect all
        this.selectedItems = [];
      } else {
        // Select all
        this.selectedItems = this.products.map(product => product.cartItemId || product._id);
      }
      this.$emit('selection-changed', this.selectedItems);
    },
    removeSelectedItems() {
  if (this.selectedItems.length === 0) return;
  
  // Thay thế confirm với eventBus để hiển thị hộp thoại xác nhận
  const handleConfirm = () => {
    // Gọi event để xóa các sản phẩm đã chọn
    this.$emit('remove-selected', this.selectedItems);
    
    // Hủy đăng ký sự kiện sau khi xử lý
    eventBus.off('confirm', handleConfirm);
    eventBus.off('cancel', handleCancel);
  };
  
  const handleCancel = () => {
    console.log("Đã hủy xóa sản phẩm đã chọn");
    
    // Hủy đăng ký sự kiện
    eventBus.off('confirm', handleConfirm);
    eventBus.off('cancel', handleCancel);
  };
  
  // Đăng ký lắng nghe sự kiện
  eventBus.on('confirm', handleConfirm);
  eventBus.on('cancel', handleCancel);
  
  // Hiển thị alert xác nhận
  eventBus.emit('show-alert', {
    show: true,
    type: 'error',
    title: 'Xác nhận xóa sản phẩm',
    message: `Bạn có chắc muốn xóa ${this.selectedItems.length} sản phẩm đã chọn khỏi giỏ hàng?`,
    autoClose: false,
    showChoices: true,
    confirmText: 'Xóa',
    cancelText: 'Hủy'
  });
}
  },
  watch: {
    // Reset selected items when products change
    products: {
      handler(newProducts) {
        // Keep only selected items that are still in the cart
        const validIds = newProducts.map(product => product.cartItemId || product._id);
        this.selectedItems = this.selectedItems.filter(id => validIds.includes(id));
        this.$emit('selection-changed', this.selectedItems);
      },
      deep: true
    }
  }
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
  display: flex;
  align-items: center;
  gap: 8px;
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

.select-all-checkbox {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  cursor: pointer;
  accent-color: #724e4e;
}

.select-all-label {
  color: #724e4e;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  margin-bottom: 5px;
  cursor: pointer;
}

.cart-actions {
  display: flex;
  margin-top: 10px;
}

.remove-selected-btn {
  background-color: #f8d7da;
  color: #dc3545;
  border: 1px solid #dc3545;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.remove-selected-btn:hover {
  background-color: #dc3545;
  color: white;
}

.select-all-container{
  display: flex;
  /* margin-bottom: 10px; */
}
</style>