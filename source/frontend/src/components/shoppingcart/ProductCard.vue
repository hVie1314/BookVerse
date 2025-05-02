<template>
  <article class="product-card">
    <div class="product-info">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-details">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
      </div>
    </div>
    <div class="quantity-controls">
      <button class="quantity-btn" @click="decreaseQuantity">-</button>
      <span class="quantity-value">{{ quantity }}</span>
      <button class="quantity-btn" @click="increaseQuantity">+</button>
    </div>
    <div class="price-info">
      <span class="price-value">${{ product.price }}</span>
      <button class="remove-button">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      quantity: 1,
    };
  },
  methods: {
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
  },
};
</script>

<style scoped>
.product-card {
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 15px;
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

.product-info {
  width: 56%;
  display: flex;
  gap: 20px;
  align-items: center;
}

.product-image {
  aspect-ratio: 1;
  object-fit: cover;
  width: 90px;
  height: 90px;
  border-radius: 8px;
}

.product-details {
  margin: auto 0;
}

.product-name {
  font-size: 18px;
  font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
  color: rgba(30, 30, 30, 1);
  font-weight: 500;
  margin-bottom: 8px;
}

.product-description {
  font-size: 14px;
  font-family: Nunito, -apple-system, Roboto, Helvetica, sans-serif;
  color: rgba(30, 30, 30, 1);
  font-weight: 500;
}

.quantity-controls {
  width: 22%;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  font-family: Roboto, -apple-system, Roboto, Helvetica, sans-serif;
}

.quantity-btn {
  background-color: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover {
  background-color: #e0e0e0;
}

.quantity-value {
  color: rgba(57, 57, 57, 1);
  font-size: 20px;
  font-family: Raleway, -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.price-info {
  width: 22%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price-value {
  font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  color: rgba(57, 57, 57, 1);
  font-weight: 600;
}

.remove-button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 16px;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.remove-button:hover {
  background-color: rgba(220, 53, 69, 0.1);
  transform: scale(1.1);
}

@media (max-width: 991px) {
  .product-card {
    flex-wrap: wrap;
  }

  .product-info {
    width: 100%;
    margin-bottom: 15px;
  }

  .quantity-controls, .price-info {
    width: 50%;
  }
  
  .quantity-controls {
    justify-content: flex-start;
  }
  
  .price-info {
    justify-content: flex-end;
  }
}

@media (max-width: 576px) {
  .product-image {
    width: 70px;
    height: 70px;
  }
  
  .product-name {
    font-size: 16px;
  }
  
  .product-description {
    font-size: 12px;
  }
}
</style>