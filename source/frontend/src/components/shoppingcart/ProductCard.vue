<!-- filepath: d:\Prj\BookVerse\source\frontend\src\components\shoppingcart\ProductCard.vue -->
<template>
  <article class="product-card">
    <div class="product-info">
      <!-- Thêm router-link cho hình ảnh sản phẩm -->
      <router-link :to="{ name: 'product-detail', params: { id: getProductId() }}" class="product-image-link">
        <img 
          :src="getImageSrc()" 
          :alt="product.title || product.name" 
          class="product-image"
          @error="handleImageError"
        />
      </router-link>
      
      <div class="product-details">
        <!-- Thêm router-link cho thông tin sản phẩm -->
        <router-link :to="{ name: 'product-detail', params: { id: getProductId() }}" class="product-text-link">
          <h3 class="product-name">{{ getTitle() }}</h3>
          <p class="product-description">{{ getAuthor() }}</p>
        </router-link>
      </div>
    </div>
    <div class="quantity-controls">
      <button class="quantity-btn" @click="decreaseQuantity">-</button>
      <span class="quantity-value">{{ product.quantity }}</span>
      <button class="quantity-btn" @click="increaseQuantity">+</button>
    </div>
    <div class="price-info">
      <span class="price-value">{{ formatPrice(getPrice()) }}</span>
      <button class="remove-button" @click="removeItem">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  </article>
</template>

<script>
import eventBus from '@/eventBus.js';// Đảm bảo bạn đã tạo eventBus
export default {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getImageSrc() {
      try {
        // Đầu tiên kiểm tra trong product.book nếu có
        if (this.product.book) {
          const bookImage = this.product.book.image;
          
          // Nếu image là URL trực tiếp
          if (typeof bookImage === 'string') {
            if (bookImage.startsWith('http') || bookImage.startsWith('/')) {
              return bookImage;
            }
            
            // Nếu image là chuỗi JSON
            if (bookImage.includes('[') && bookImage.includes(']')) {
              const jsonStr = bookImage.replace(/'/g, '"');
              const images = JSON.parse(jsonStr);
              return Array.isArray(images) && images.length > 0 ? images[0] : '/images/top-week.jpeg';
            }
          }
        }
        
        // Kiểm tra trong product trực tiếp
        if (this.product.image) {
          const productImage = this.product.image;
          
          // Xử lý tương tự như trên
          if (typeof productImage === 'string') {
            if (productImage.startsWith('http') || productImage.startsWith('/')) {
              return productImage;
            }
            
            if (productImage.includes('[') && productImage.includes(']')) {
              const jsonStr = productImage.replace(/'/g, '"');
              const images = JSON.parse(jsonStr);
              return Array.isArray(images) && images.length > 0 ? images[0] : '/images/top-week.jpeg';
            }
          }
        }
        
        // Trường hợp mặc định
        return this.product.rawImage || '/images/top-week.jpeg';
      } catch (err) {
        console.error('Lỗi xử lý ảnh:', err);
        return '/images/top-week.jpeg';
      }
    },
    getTitle() {
      return this.product.book?.title || this.product.title || 'Không có tên sách';
    },
    getAuthor() {
      return this.product.book?.author || this.product.author || 'Không có tên tác giả';
    },
    getPrice() {
      return this.product.book?.price || this.product.price || 0;
    },
    handleImageError(e) {
      this.imgError = true;
      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
    },
    increaseQuantity() {
      this.$emit('update-quantity', this.product.cartItemId || this.product._id, this.product.quantity + 1);
    },
    decreaseQuantity() {
      if (this.product.quantity > 1) {
        this.$emit('update-quantity', this.product.cartItemId || this.product._id, this.product.quantity - 1);
      }
    },
    removeItem() {
      const productId = this.product.cartItemId || this.product._id;
      const productName = this.getTitle();
      
      // Đơn giản hóa bằng cách sử dụng confirm của browser
      // if (window.confirm(`Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`)) {
      //   console.log("Xóa sản phẩm với ID:", productId);
      //   this.$emit('remove', productId);
      // }
      // Đăng ký lắng nghe sự kiện trước khi hiển thị alert
      const handleConfirm = () => {
        console.log("ProductCard: Confirm xóa sản phẩm", productId);
        this.$emit('remove', productId);
        // Hủy đăng ký sau khi xử lý
        eventBus.off('confirm', handleConfirm);
        eventBus.off('cancel', handleCancel);
      };
      
      const handleCancel = () => {
        console.log("ProductCard: Cancel xóa sản phẩm");
        // Chỉ cần hủy đăng ký
        eventBus.off('confirm', handleConfirm);
        eventBus.off('cancel', handleCancel);
      };
      
      // Đăng ký lắng nghe sự kiện
      eventBus.on('confirm', handleConfirm);
      eventBus.on('cancel', handleCancel);
      
      // Hiển thị alert
      eventBus.emit('show-alert', {
        show: true,
        type: 'error',
        title: 'Xác nhận xóa sản phẩm',
        message: `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`,
        autoClose: false,
        showChoices: true,
        confirmText: 'Xóa',
        cancelText: 'Hủy'
      });
    },
    formatPrice(price) {
      // Đảm bảo price là một số
      const validPrice = isNaN(price) ? 0 : Number(price);
      
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(validPrice);
    },
    getProductId() {
      return this.product.book?._id || "Không có mã sản phẩm";
    },
  }
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
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
}

.product-info {
  width: 60%; /* Tương ứng với product-label */
  display: flex;
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
  width: 20%; /* Tương ứng với quantity-label */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Căn trái */
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
  width: 20%; /* Tương ứng với price-label */
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Căn phải */
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
/* Thêm vào <style scoped> */
.product-image-link {
  display: block;
  text-decoration: none;
  cursor: pointer;
}

.product-text-link {
  text-decoration: none;
  color: inherit;
  display: block;
  cursor: pointer;
  transition: color 0.2s ease;
}

.product-text-link:hover .product-name {
  color: #4D2900;
  text-decoration: underline;
}

/* Đảm bảo hình ảnh có hiệu ứng khi hover */
.product-image-link:hover .product-image {
  transform: scale(1.05);
  transition: transform 0.2s ease;
}

.product-image {
  transition: transform 0.2s ease;
}
</style>