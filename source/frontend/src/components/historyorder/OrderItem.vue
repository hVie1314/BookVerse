<template>
    <article class="order-item" :class="status">
      <h3 class="order-status" :class="status">{{ statusText }}</h3>
      <div class="order-content">
        <hr class="divider" />
        <div v-for="(product, index) in products" :key="index">
          <OrderItemProduct :product="product" />
          <hr class="divider" />
        </div>
        <OrderItemFooter
          :total="total"
          :showActions="showActions"
          :cancelMessage="cancelMessage"
          @pay="$emit('pay')"
          @cancel="$emit('cancel')"
        />
      </div>
    </article>
</template>
  
<script>
  import OrderItemProduct from './OrderItemProduct.vue'
  import OrderItemFooter from './OrderItemFooter.vue'
  
  export default {
    name: 'OrderItem',
    components: {
      OrderItemProduct,
      OrderItemFooter
    },
    props: {
      status: {
        type: String,
        required: true,
        validator: value => ['pending', 'completed', 'cancelled'].includes(value)
      },
      statusText: {
        type: String,
        required: true
      },
      products: {
        type: Array,
        required: true
      },
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
    },
    emits: ['pay', 'cancel']
  }
</script>
  
<style scoped>
    .order-item {
        background-color: #ffffff;
        border: 1px solid #828282;
        display: flex;
        margin-top: 10px; /* Giảm từ 15px */
        padding: 10px 0; /* Giảm từ 15px */
        flex-direction: column;
        overflow: hidden;
        align-items: stretch;
    }

    .order-status {
        font-size: 16px; /* Giảm từ 18px */
        text-align: center;
        align-self: end;
        margin: 0 18px 0 0; /* Giảm từ 25px */
    }

    .order-content {
        display: flex;
        margin-top: 5px; /* Giảm từ 10px */
        width: 100%;
        padding: 0 15px; /* Giảm từ 20px */
        flex-direction: column;
        align-items: stretch;
    }

    .divider {
        border: 1px solid #aea0a0;
        width: 100%;
        height: 1px;
        margin: 6px 0; /* Giảm từ 10px */
    }

    .pending .order-status {
        color: #f0ed4d;
    }

    .completed .order-status {
        color: #70e077;
    }

    .cancelled .order-status {
        color: #f04d4d;
    }

    @media (max-width: 991px) {
        .order-item {
            max-width: 100%;
            margin: 40px 7px 0 0;
        }

        .order-status {
            margin-right: 10px;
        }

        .order-content {
            padding: 0 20px;
        }
    }
</style>