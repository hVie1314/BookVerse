<template>
  <section class="carousel-container">
    <div class="best-seller-container">
      <h2 class="carousel-title">TOP SÁCH BÁN CHẠY</h2>
      
      <!-- Loading indicator -->
      <div v-if="loading" class="loading-container">
        <i class="fa-solid fa-spinner fa-spin"></i> Đang tải...
      </div>
      
      <!-- Error message -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- Books display -->
      <div v-else class="book-grid">
        <BookCard
          v-for="book in currentPageBooks"
          :key="book.id"
          :image="book.image"
          :price="`${book.price.toLocaleString('vi-VN')} đ`"
          :originalPrice="book.originalPrice ? `${book.originalPrice.toLocaleString('vi-VN')} đ` : ''"
          :title="book.title"
          :author="book.author"
          :cartText="'Thêm vào giỏ'"
          :sold="book.sold"
          @add-to-cart="addToCart(book.id)"
        />
      </div>
      
      <!-- Pagination -->
      <div class="pagination-container" v-if="totalPages > 1">
        <button 
          class="pagination-button" 
          @click="previousPage" 
          :disabled="currentPage === 1"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        
        <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
        
        <button 
          class="pagination-button" 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import BookCard from "./BookCard.vue";
import BookService from '@/services/BookService';
import CartService from '@/services/CartService';

export default {
  name: "BestSeller",
  components: {
    BookCard
  },
  data() {
    return {
      books: [],
      loading: true,
      error: null,
      currentPage: 1,
      booksPerPage: 5,
      totalBooks: 20 // Giới hạn tổng số sách cần lấy
    };
  },
  computed: {
    // Tính số trang dựa trên số sách và số sách mỗi trang
    totalPages() {
      return Math.ceil(this.books.length / this.booksPerPage);
    },
    // Lấy sách cho trang hiện tại
    currentPageBooks() {
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      const endIndex = startIndex + this.booksPerPage;
      return this.books.slice(startIndex, endIndex);
    }
  },
  methods: {
    // Lấy danh sách sách bán chạy từ API
    async fetchTopSellingBooks() {
      this.loading = true;
      try {
        const response = await BookService.getTopSellingBooks(this.totalBooks);
        console.log("API response:", response); // Log dữ liệu trả về từ API
        this.books = response.data.data.books.map(book => ({
          id: book.id,
          image: book.image || '/images/default-book-cover.jpg',
          price: book.price,
          originalPrice: book.originalPrice > book.price ? book.originalPrice : null,
          title: book.title,
          author: book.author,
          sold: book.sold || "Đã bán 0"
        }));
        this.loading = false;
      } catch (error) {
        console.error("Error fetching top selling books:", error);
        this.error = "Không thể tải danh sách sách bán chạy. Vui lòng thử lại sau.";
        this.loading = false;
      }
    },
    
    // Phương thức phân trang
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    // Thêm sách vào giỏ hàng
    async addToCart(bookId) {
      try {
        await CartService.addToCart({ bookId, quantity: 1 });
        this.$toast.success("Đã thêm sách vào giỏ hàng");
      } catch (error) {
        console.error("Error adding book to cart:", error);
        this.$toast.error("Không thể thêm sách vào giỏ hàng.");
      }
    }
  },
  mounted() {
    this.fetchTopSellingBooks();
  }
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.best-seller-container {
  width: 85%;
}

.carousel-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 900;
  font-size: 25px;
  color: #4d2900;
  margin-bottom: 20px;
}

.book-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

/* Loading và Error styles */
.loading-container, .error-message {
  width: 100%;
  padding: 30px;
  text-align: center;
  font-family: "Montserrat", sans-serif;
}

.error-message {
  color: #ff3333;
}

/* Pagination styles */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

.pagination-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #4d2900;
  color: white;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-family: "Montserrat", sans-serif;
  font-size: 16px;
  color: #4d2900;
}

@media (max-width: 991px) {
  .carousel-container {
    max-width: 991px;
  }

  .book-grid {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .carousel-container {
    max-width: 640px;
  }

  .carousel-title {
    font-size: 20px;
  }
}
</style>