<template>
  <article class="product-card">
    <div class="product-card-content">
      <!-- Book Cover -->
      <div class="book-cover-container">
        <img
          :src="getImageSrc(book)"
          :alt="book.title"
          class="book-cover"
          @error="handleImageError"
        />
      </div>
      
      <!-- Book Info -->
      <section class="book-info">
        <h2 class="book-title">{{ limitText(book.title, 50) }}</h2>
        <p class="book-description">{{ limitText(book.description, 120) }}</p>
        <p class="book-author">{{ book.author }}</p>
      </section>
      
      <!-- Book Actions -->
      <div class="book-actions">
        <p class="book-price">{{ formatPrice(book.price) }}</p>
        <div class="action-buttons">
          <button class="edit-button" aria-label="Edit book" @click.stop="$emit('edit-book', book)">
            <div v-html="editIcon"></div>
          </button>
          <button class="delete-button" aria-label="Delete book" @click.stop="$emit('delete-book', book)">
            <div v-html="deleteIcon"></div>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editIcon: `<svg id="573:203" layer-name="edit-3_svgrepo.com" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[19px] h-[18px]">
        <path d="M16.8471 5.3001L9.29458 12.4551C8.54249 13.1676 6.30997 13.4976 5.81122 13.0251C5.31247 12.5526 5.65289 10.4376 6.40497 9.72506L13.9654 2.56258C14.1518 2.36987 14.3776 2.21497 14.629 2.10719C14.8803 1.99942 15.1522 1.94099 15.4281 1.93549C15.7039 1.92999 15.9781 1.97749 16.2341 2.07515C16.49 2.17281 16.7225 2.31861 16.9173 2.50371C17.1121 2.68881 17.2654 2.90938 17.3678 3.15213C17.4701 3.39488 17.5196 3.65476 17.513 3.91609C17.5065 4.17743 17.444 4.43482 17.3296 4.67269C17.2151 4.91055 17.051 5.12399 16.8471 5.3001Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M8.70898 3.5H4.75065C3.9108 3.5 3.10539 3.81606 2.51152 4.37868C1.91766 4.94129 1.58398 5.70435 1.58398 6.5V14C1.58398 14.7957 1.91766 15.5587 2.51152 16.1213C3.10539 16.6839 3.9108 17 4.75065 17H13.459C15.2086 17 15.834 15.65 15.834 14V10.25" stroke="black" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
      deleteIcon: `<svg id="573:207" layer-name="delete_button" width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[40px] h-[24px] cursor-pointer">
        <rect y="0.5" width="40" height="24" rx="8" fill="#4D2900"></rect>
        <path d="M27.5375 8.25552L26.5914 17.7546C26.5086 18.5866 26.4672 19.0026 26.1988 19.318C25.9624 19.5957 25.6059 19.8189 25.1763 19.9583C24.6883 20.1166 24.0655 20.1166 22.8198 20.1166H18.0801C16.8345 20.1166 16.2117 20.1166 15.7237 19.9583C15.294 19.8189 14.9376 19.5957 14.7012 19.318C14.4328 19.0026 14.3914 18.5866 14.3085 17.7546L13.3625 8.25552M11 8.25552H29.9M25.175 8.25552L24.8554 7.6135C24.5455 6.99133 24.3905 6.68024 24.1033 6.45025C23.8495 6.24714 23.5237 6.08994 23.1557 5.99304C22.7388 5.8833 22.249 5.8833 21.2693 5.8833H19.6307C18.651 5.8833 18.1612 5.8833 17.7444 5.99304C17.3763 6.08994 17.0505 6.24714 16.7967 6.45025C16.5094 6.68024 16.3545 6.99133 16.0447 7.6135L15.725 8.25552M22.8125 11.4185V16.9537M18.0875 11.4185V16.9537" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`
    };
  },
  methods: {
    // Xử lý hiển thị ảnh sách
    getImageSrc(book) {
      if (!book.image) return 'https://via.placeholder.com/150x200?text=No+Image';
      
      // Xử lý trường hợp image là chuỗi JSON
      if (typeof book.image === 'string' && book.image.startsWith('[') && book.image.endsWith(']')) {
        try {
          const images = JSON.parse(book.image);
          return Array.isArray(images) && images.length > 0 ? images[0] : 'https://via.placeholder.com/150x200?text=No+Image';
        } catch (e) {
          return book.image;
        }
      }
      
      return book.image;
    },
    
    // Xử lý lỗi khi tải hình ảnh
    handleImageError(event) {
      event.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(this.book.title || 'Book')}`;
    },
    
    // Giới hạn độ dài văn bản
    limitText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    
    // Định dạng giá tiền
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price).replace('₫', 'đ');
    }
  }
}
</script>

<style scoped>
/* Styles cho product card chính */
.product-card {
  display: flex;
  width: 100%;
  padding: 17px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: 1px solid #d9c7c7;
  background-color: #fffdfc;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.15);
}

.product-card-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

/* Styles cho phần cover */
.book-cover-container {
  flex-shrink: 0;
}

.book-cover {
  width: 90px;
  height: 135px;
  border-radius: 8px;
  object-fit: cover;
}

/* Styles cho phần thông tin sách */
.book-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
}

.book-title {
  width: 100%;
  color: #000;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.book-description {
  width: 100%;
  color: #333;
  font-family: "Hind Siliguri", sans-serif;
  font-size: 14px;
  font-weight: 400;
  margin: 0 0 10px 0;
  line-height: 1.5;
}

.book-author {
  width: 100%;
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  font-weight: 700;
  font-style: italic;
  margin: 0;
}

/* Styles cho phần actions */
.book-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
}

.book-price {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 7px;
  align-items: center;
}

.edit-button {
  display: flex;
  width: 40px;
  height: 24px;
  padding: 3px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  background-color: #d4d2d2;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.edit-button:hover {
  background-color: #bdbdbd;
}

.delete-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.delete-button:hover {
  transform: scale(1.05);
}

/* Responsive styles */
@media (max-width: 991px) {
  .product-card {
    padding: 15px 20px;
  }

  .product-card-content {
    gap: 20px;
  }
  
  .book-title {
    font-size: 16px;
  }
  
  .book-description {
    font-size: 13px;
  }
  
  .book-author {
    font-size: 13px;
  }
  
  .book-price {
    font-size: 16px;
  }
}

@media (max-width: 640px) {
  .product-card {
    padding: 12px 15px;
  }

  .product-card-content {
    gap: 15px;
    flex-direction: column;
    align-items: center;
  }
  
  .book-info {
    align-items: center;
    text-align: center;
  }
  
  .book-actions {
    align-items: center;
    width: 100%;
  }
  
  .book-cover {
    width: 70px;
    height: 105px;
  }
  
  .book-title {
    font-size: 14px;
  }
  
  .book-description {
    font-size: 12px;
  }
  
  .book-author {
    font-size: 12px;
  }
  
  .book-price {
    font-size: 14px;
  }
}
</style>