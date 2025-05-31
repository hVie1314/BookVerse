<template>
  <section class="top-books">
    <h2 class="section-title">Top 10 sách bán chạy nhất mọi thời đại</h2>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <div v-else class="books-list">
      <BookItem
        v-for="(book, index) in topBooks"
        :key="book._id"
        :title="book.title"
        :author="book.author"
        :price="formatCurrency(book.price)"
        :rank="formatRank(index + 1)"
        :salesCount="`${book.sold} đã bán`"
        :image="getFirstImage(book.image)"
      />
      
      <div v-if="topBooks.length === 0" class="no-data">
        Không có dữ liệu sách bán chạy
      </div>
    </div>
  </section>
</template>

<script>
import BookItem from './BookItem.vue';
import BookService from '@/services/BookService';

export default {
  name: 'TopBooks',
  components: {
    BookItem
  },
  data() {
    return {
      topBooks: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchTopBooks();
  },
  methods: {
    formatRank(rank) {
      if (rank === 1) return '🥇';
      if (rank === 2) return '🥈';
      if (rank === 3) return '🥉';
      return `#${rank}`;
    },
    
    formatSalesBadge(rank, sold) {
      return `${this.formatRank(rank)}\n${sold} đã bán`;
    },
    
    async fetchTopBooks() {
      try {
        this.loading = true;
        this.error = null;
        
        // Gọi API để lấy top 10 sách bán chạy nhất
        const response = await BookService.getTopSellingBooks(10);
        
        // Kiểm tra cấu trúc dữ liệu và xử lý dữ liệu
        if (response && response.data && response.data.success) {
          this.topBooks = response.data.data.books || [];
          console.log('Top books data:', this.topBooks);
        } else {
          throw new Error('Dữ liệu không hợp lệ');
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sách bán chạy:', error);
        this.error = 'Không thể tải danh sách sách bán chạy. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    
    formatCurrency(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      }).format(price);
    },
    
    getFirstImage(imageStr) {
      try {
        // Trường hợp image là chuỗi mảng
        if (typeof imageStr === 'string' && imageStr.startsWith('[') && imageStr.endsWith(']')) {
          // Chuyển đổi chuỗi thành mảng
          const imageArray = JSON.parse(imageStr.replace(/'/g, '"'));
          return imageArray[0]; // Trả về ảnh đầu tiên
        }
        // Trường hợp image là URL đơn
        return imageStr;
      } catch (error) {
        console.error('Lỗi khi xử lý URL hình ảnh:', error);
        // Trả về hình ảnh mặc định nếu có lỗi
        return 'https://cdn1.fahasa.com/skin/frontend/ma_vanese/fahasa/images/no-image.jpg';
      }
    }
  }
}
</script>

<style scoped>
.top-books {
  border: 1px solid #968a8a;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  margin-top: 30px;
}

.section-title {
  color: #837373;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #716a6a;
  font-weight: normal;
}

.books-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4d2900;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  text-align: center;
  padding: 20px;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-style: italic;
}
</style>