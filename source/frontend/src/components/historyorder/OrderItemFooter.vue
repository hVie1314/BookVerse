<template>
    <footer class="order-footer">
      <div v-if="cancelMessage" class="cancel-message">
        {{ cancelMessage }}
      </div>
      <div class="total-container">
        <p class="total-label">Thành tiền:</p>
        <p class="total-amount">{{ total }}</p>
      </div>
      <div v-if="showActions" class="action-buttons">
        <button class="action-button payment">Thanh toán</button>
        <button class="action-button cancel">Hủy đơn</button>
      </div>
    </footer>
</template>
  
<script>
  export default {
    name: 'OrderItemFooter',
    props: {
      total: {
        type: String,
        required: true
      },
      showActions: {
        type: Boolean,
        default: false
      },
      cancelMessage: {
        type: String,
        default: ''
      }
    }
  }
</script>
  
<style scoped>
    .order-footer {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-top: 8px; /* Giảm từ 15px */
    }

    .cancel-message {
        color: #4d2900;
        font-size: 12px; /* Giảm từ 14px */
        align-self: start;
        margin: 3px 0; /* Giảm từ 5px */
    }

    .total-container {
        display: flex;
        align-items: center;
        gap: 10px; /* Giảm từ 15px */
        text-align: center;
    }

    .total-label {
        color: #726666;
        font-size: 12px; /* Giảm từ 14px */
        margin: auto 0;
    }

    .total-amount {
        color: #cd5252;
        font-size: 16px; /* Giảm từ 20px */
        margin: 0;
    }

    .action-buttons {
        display: flex;
        margin-top: 6px; /* Giảm từ 10px */
        width: 100%;
        max-width: 100%;
        gap: 8px; /* Giảm từ 12px */
        font-size: 11px; /* Giảm từ 13px */
        text-align: center;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .action-button {
        border-radius: 3px; /* Giảm từ 4px */
        padding: 4px 12px; /* Giảm từ 6px 15px */
        overflow: hidden;
        flex: 0 0 auto;
        min-width: 75px; /* Giảm từ 90px */
        font-size: inherit;
        font-weight: 600;
        cursor: pointer;
    }

    .payment {
        background-color: #4d2900;
        color: #ffffff;
        border: none;
        min-width: 85px; /* Giảm từ 100px */
    }
    
    .cancel {
        color: #4d2900;
        border: 1px solid #7c7272;
        background-color: #ffffff;
    }
    
    @media (max-width: 991px) {
        .order-footer {
        margin-top: 40px;
        }
    
        .action-buttons {
        margin: 40px 2px 0 0;
        }
    
        .action-button {
        padding: 17px 20px;
        }
    }
</style>