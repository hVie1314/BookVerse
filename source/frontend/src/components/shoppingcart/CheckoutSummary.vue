<template>
  <aside class="checkout-summary">
    <div class="summary-content">
      <div class="summary-details">
        <!-- Thêm thông tin về sản phẩm đã chọn -->
        <div class="summary-item selected-items-info">
          <span class="summary-label">Đã chọn:</span>
          <span class="summary-value">{{ selectedCount }}/{{ totalCount }} sản phẩm</span>
        </div>
        
        <!-- Existing summary items -->
        <div class="summary-item">
          <span class="summary-label">Tổng tiền hàng: </span>
          <span class="summary-value">{{ formatPrice(totalPrice) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Phí vận chuyển: </span>
          <span class="summary-value">{{ formatPrice(shippingFee) }}</span>
        </div>
        <div class="summary-divider"></div>
        <div class="total-row">
          <h3 class="total-label">Tổng thanh toán: </h3>
          <p class="total-value">{{ formatPrice(totalPrice + shippingFee) }}</p>
        </div>
      </div>
      
      <!-- Button shows count of selected items -->
      <button class="checkout-button" @click="checkout" :disabled="selectedCount === 0">
        ĐẶT HÀNG ({{ selectedCount }})
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: "CheckoutSummary",
  props: {
    totalPrice: {
      type: Number,
      default: 0
    },
    selectedCount: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      shippingFee: 0 // Phí vận chuyển mặc định
    };
  },
  methods: {
    formatPrice(price) {
      // Đảm bảo price là một số hợp lệ
      const validPrice = isNaN(price) ? 0 : Number(price);
      
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0, // Không hiển thị phần thập phân
        maximumFractionDigits: 0
      }).format(validPrice);
    }, 
    checkout() {
      this.$emit('checkout');
    }
  }
};
</script>

<style scoped>
.checkout-summary {
  width: 100%;
  margin: 0; /* Bỏ margin auto */
}

.summary-content {
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15); /* Giảm shadow */
  width: 100%;
  padding: 16px 14px; /* Giảm padding */
  color: rgba(0, 0, 0, 1);
}

.summary-details {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
}

.summary-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: nowrap;
}

.summary-label {
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  margin-top: 10px;
}

.summary-value {
  font-family: "Darker Grotesque", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
}

.labels {
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
}

.summary-label + .summary-label {
  margin-top: 25px;
}

.values {
  font-family: "Darker Grotesque", -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  text-align: right;
}

.labels, .values {
  width: auto;
  min-width: 30%;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}

.summary-value + .summary-value {
  margin-top: 16px;
}

.summary-divider {
  border-color: rgba(208, 207, 207, 1);
  border-style: solid;
  border-width: 1px;
  margin: 10px 0;
  width: 100%;
  height: 1px;
}
@media (min-width: 1200px) {
  /* Bỏ hoàn toàn layout flex row */
  .summary-row {
    display: flex;
    flex-direction: column; /* Thay đổi thành column để giữ nguyên trật tự */
    width: 100%;
  }
  
  .labels, .values {
    display: flex;
    flex-direction: column; /* Hiển thị theo cột */
    width: 100%;
  }
  
  /* Tạo layout có 2 cột bằng cách đặt label và giá trị trên cùng một hàng */
  .summary-label, .summary-value {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 8px 0 !important;
  }
  
  /* Đặt tổng thanh toán ở cuối */
  .total-row {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }
  
  /* Nút đặt hàng vẫn giữ nguyên chiều rộng */
  .checkout-button {
    width: 100%;
    padding: 12px;
  }
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  margin: 8px 0;
}

.total-label {
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
}

.total-value {
  font-family: "Darker Grotesque", -apple-system, Roboto, Helvetica, sans-serif;
}

.checkout-button {
  border-radius: 6px; /* Giảm bo góc */
  margin-top: 12px; /* Giảm margin */
  padding: 8px; /* Giảm padding */
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px; /* Giảm font size */
  color: rgba(255, 255, 255, 1);
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5px; /* Giảm letter spacing */
  background-color: #4d2900;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
  height: 36px;
} 

.checkout-button:hover {
  background-color: #724e4e;
}

@media (max-width: 991px) {
  .checkout-summary {
    width: 100%;
  }

  .summary-content {
    margin-top: 15px; /* Giảm margin */
    padding: 15px; /* Giảm padding */
  }
}

.selected-items-info {
  font-weight: 600;
  margin-bottom: 10px;
}

/* Disable button when no items selected */
.checkout-button:disabled {
  background-color: #a89393;
  cursor: not-allowed;
}
</style>