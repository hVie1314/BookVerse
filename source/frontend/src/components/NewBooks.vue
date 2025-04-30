<template>
    <section class="carousel-container">
      <!-- Navigation Arrow Left -->
      <NavigationArrow 
        v-if="!loading && !error"
        direction="left" 
        @click="previousPage" 
        :disabled="currentPage === 1"
        class="nav-arrow-left"
      />
      
      <div class="new-books-container">
        <h2 class="carousel-title">SÁCH MỚI NHẬP VỀ</h2>
        
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
            :sold="String(book.sold)"
            @add-to-cart="addToCart(book.id)"
          />
        </div>
      </div>
      
      <!-- Navigation Arrow Right -->
        <NavigationArrow 
        v-if="!loading && !error"
        direction="right" 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="nav-arrow-right"
        />
    </section>
</template>
  
<script>
import BookCard from "./bestsellers/BookCard.vue"; // Sử dụng lại BookCard từ bestsellers
import BookService from '@/services/BookService';
import CartService from '@/services/CartService';
import NavigationArrow from "./bestsellers/NavigationArrow.vue"; // Sử dụng lại NavigationArrow

export default {
name: "NewBooks",
components: {
    BookCard,
    NavigationArrow
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
    // Lấy danh sách sách mới nhập về từ API
    async fetchRecentlyAddedBooks() {
    this.loading = true;
    try {
        const response = await BookService.getRecentlyAddedBooks(this.totalBooks);
        console.log("API response:", response);
        
        // Xử lý linh hoạt với nhiều cấu trúc có thể có từ response
        if (response.data && response.data.success && response.data.data && response.data.data.books) {
        // Cấu trúc từ responseFormatterMiddleware
        this.books = response.data.data.books.map(book => this.formatBookData(book));
        } else if (response.data && response.data.books) {
        // Cấu trúc trả về trực tiếp từ controller
        this.books = response.data.books.map(book => this.formatBookData(book));
        } else if (Array.isArray(response.data)) {
        // Mảng sách trực tiếp
        this.books = response.data.map(book => this.formatBookData(book));
        } else {
        throw new Error("Định dạng dữ liệu không hợp lệ từ API");
        }
        
        this.loading = false;
    } catch (error) {
        console.error("Error fetching recently added books:", error);
        this.error = "Không thể tải danh sách sách mới. Vui lòng thử lại sau.";
        this.loading = false;
    }
    },

    // Hàm tiện ích để định dạng dữ liệu sách
    formatBookData(book) {
    return {
        id: book.id || book._id,
        image: book.image || book.coverImage || '/images/default-book-cover.jpg',
        price: book.price,
        originalPrice: book.originalPrice > book.price ? book.originalPrice : null,
        title: book.title,
        author: book.author,
        sold: String(book.sold || 0)
    };
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
    this.fetchRecentlyAddedBooks();
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
    align-items: center;
}

.new-books-container {
    width: 88%;
}

.carousel-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 900;
    font-size: 22px; /* Giảm từ 25px cho gọn hơn */
    color: #4d2900;
    margin-bottom: 15px;
}

.book-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: space-between;
}

.nav-arrow-left {
    position: absolute;
    left: 1.5%;
    z-index: 5;
    transform: scale(0.8);
}

.nav-arrow-right {
    position: absolute;
    right: 1.5%;
    z-index: 5;
    transform: scale(0.8);
}

.loading-container, .error-message {
    width: 100%;
    padding: 20px;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
}

.error-message {
    color: #ff3333; 
}

@media (max-width: 991px) {
    .carousel-container {
        padding: 10px;
    }

    .book-grid {
        justify-content: center;
        gap: 10px;
    }
    }

    @media (max-width: 640px) {
    .carousel-title {
        font-size: 18px;
    }
}
</style>