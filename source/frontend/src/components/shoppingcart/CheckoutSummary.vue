<template>
  <aside class="checkout-summary">
    <div class="summary-content">
      
      <div class="summary-details">
        <div class="summary-row">
          <span class="summary-label">Tổng tiền hàng</span>
          <span class="summary-value">{{ formatPrice(totalPrice) }}</span>
        </div>
        
        <div class="summary-row">
          <span class="summary-label">Phí vận chuyển</span>
          <span class="summary-value">{{ formatPrice(shippingFee) }}</span>
        </div>
        
        <div class="summary-divider"></div>
        
        <div class="summary-row total-row">
          <span class="total-label">Tổng thanh toán</span>
          <span class="total-value">{{ formatPrice(totalPrice + shippingFee) }}</span>
        </div>
      </div>
      
      <button 
        class="checkout-button" 
        @click="checkout" 
        :disabled="selectedCount === 0"
      >
        ĐẶT HÀNG
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
  margin: 0;
}

.summary-content {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  width: 100%;
  padding: 20px;
  color: #000000;
}

.summary-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #4d2900;
  margin-bottom: 16px;
  text-align: center;
}

.summary-details {
  width: 100%;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-label {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  color: #666666;
}

.summary-value {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
}

.summary-divider {
  border: none;
  height: 1px;
  background-color: #e0e0e0;
  margin: 16px 0;
}

.total-row {
  margin-top: 8px;
  margin-bottom: 20px;
}

.total-label {
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #4d2900;
}

.total-value {
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #4d2900;
}

.checkout-button {
  width: 100%;
  padding: 12px 0;
  background-color: #4d2900;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.checkout-button:hover {
  background-color: #5e3300;
  transform: translateY(-2px);
}

.checkout-button:disabled {
  background-color: #a89393;
  cursor: not-allowed;
  transform: none;
}

/* Responsive styles */
@media (max-width: 991px) {
  .summary-content {
    padding: 16px;
  }
  
  .summary-title {
    font-size: 16px;
  }
  
  .checkout-button {
    padding: 10px 0;
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .summary-content {
    padding: 12px;
    border-radius: 6px;
  }
  
  .summary-label,
  .summary-value {
    font-size: 13px;
  }
  
  .total-label {
    font-size: 15px;
  }
  
  .total-value {
    font-size: 16px;
  }
  
  .checkout-button {
    font-size: 14px;
    padding: 8px 0;
  }
}

/* Styles for when it's sticky at the bottom */
.checkout-summary-container.is-sticky .checkout-summary {
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
}
</style>