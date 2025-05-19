<template>
  <div class="book-item">
    <div class="book-content">
      <div class="book-image">
        <img :src="image" :alt="title" />
      </div>
      <div class="book-info">
        <h3 class="book-title">{{ title }}</h3>
        <p class="book-author">{{ author }}</p>
        <p class="book-price">{{ price }}</p>
      </div>
      <div class="sales-container">
        <div class="rank-badge">{{ rank }}</div>
        <div class="sales-text">{{ salesCount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookItem',
  props: {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    rank: {
      type: String,
      required: true
    },
    salesCount: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.book-item {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 15px;
  margin-bottom: 15px;
  position: relative;
}

.book-content {
  display: flex;
  width: 100%;
  color: inherit;
  position: relative;
}

.book-image {
  width: 80px;
  height: 120px;
  margin-right: 15px;
  flex-shrink: 0;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

/* Container cho rank và sales */
.sales-container {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

/* Badge cho rank */
.rank-badge {
  background-color: #4D2900;
  color: white;
  font-size: 20px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
}

/* Text cho số lượng bán */
.sales-text {
  color: #4D2900;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 100px; /* Tạo không gian cho badge */
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #4d2900;
  margin: 0 0 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin: 0 0 5px 0;
}

.book-price {
  font-size: 15px;
  font-weight: 700;
  color: #ca401a;
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .book-info {
    padding-right: 70px;
  }
  
  .rank-badge {
    font-size: 16px;
    width: 32px;
    height: 32px;
  }
  
  .sales-text {
    font-size: 11px;
  }
}
</style>