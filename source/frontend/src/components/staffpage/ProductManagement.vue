<template>
  <div class="product-management">
    <h1 class="page-title">Quản lý sản phẩm</h1>
    
    <div class="toolbar">
      <div class="filter-section">
        <div class="dropdown-container">
          <button class="dropdown-button" @click="toggleDropdown">
            {{ selectedCategory === null ? 'Tất cả' : selectedCategory }}
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="dropdown-content" v-if="showDropdown">
            <a @click="selectCategory(null)">Tất cả</a>
            <a v-for="category in categories" :key="category" 
               @click="selectCategory(category)">
              {{ category }}
            </a>
          </div>
        </div>
        
        <div class="search-container">
          <input type="text" placeholder="Tìm kiếm theo tên sách hoặc tên tác giả..." v-model="searchQuery" @keyup.enter="searchBooks" />
          <button class="search-btn" @click="searchBooks">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <div class="action-buttons">
        <button class="refresh-btn" @click="fetchBooks">
          <i class="fas fa-sync-alt"></i> Làm mới
        </button>
        <button class="add-product-btn" @click="openAddBookForm">
          <i class="fas fa-plus"></i> Thêm sách mới
        </button>
      </div>
    </div>
    
    <!-- Thêm dòng hiển thị số sản phẩm -->
    <div class="product-count">
      {{ totalBooks }} sản phẩm
    </div>
    
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
    </div>
    
    <div v-else-if="books.length === 0" class="no-books">
      <p>Không tìm thấy sách nào</p>
    </div>
    
    <div v-else class="product-list">
      <div v-for="book in books" :key="book._id" class="product-item">
        <ProductCard 
          :book="book" 
          @edit-book="editBook" 
          @delete-book="confirmDeleteBook"
        />
      </div>
    </div>
    
    <Pagination 
      v-if="totalPages > 0"
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @page-change="changePage" 
    />

    <!-- Overlay cho form thêm sách mới -->
    <div v-if="showProductForm" class="modal-overlay" @click.self="closeProductForm">
      <div class="create-modal">
        <ProductCreate 
          @close="closeProductForm"
          @book-created="handleBookCreated" 
        />
      </div>
    </div>
    
    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-container confirm-delete">
        <h2>Xác nhận xóa</h2>
        <p>Bạn có chắc chắn muốn xóa sách "{{ bookToDelete?.title }}" không?</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelDelete">Hủy</button>
          <button class="confirm-btn" @click="deleteBook">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookService from '@/services/BookService';
import Pagination from '@/components/categorypage/Pagination.vue';
import ProductCard from './ProductCard.vue';
import ProductCreate from './ProductCreate.vue';
import eventBus from '@/eventBus.js';

export default {
  name: "ProductManagement",
  components: {
    Pagination,
    ProductCard,
    ProductCreate
  },
  data() {
    return {
      searchQuery: "",
      books: [],
      loading: true,
      error: null,
      currentPage: 1,
      totalPages: 0,
      totalBooks: 0,
      itemsPerPage: 10,
      categories: [],
      selectedCategory: null,
      showDropdown: false,
      showProductForm: false,
      editMode: false,
      currentBook: null,
      showDeleteConfirm: false,
      bookToDelete: null
    };
  },
  created() {
    this.fetchCategories();
    this.fetchBooks();
    
    // Đóng dropdown khi click ngoài
    document.addEventListener('click', this.closeDropdownOutside);
  },
  beforeUnmount() {
    // Dọn dẹp event listener khi component bị hủy
    document.removeEventListener('click', this.closeDropdownOutside);
  },
  methods: {
    // Lấy danh mục từ API
    async fetchCategories() {
      try {
        const response = await BookService.getCategories();
        
        if (response.data && response.data.success) {
          // Kiểm tra cấu trúc dữ liệu và trích xuất danh mục
          if (Array.isArray(response.data.data)) {
            // Trường hợp API trả về mảng danh mục trực tiếp
            this.categories = response.data.data;
          } else if (response.data.data && Array.isArray(response.data.data.categories)) {
            // Trường hợp API trả về đối tượng có thuộc tính categories là mảng
            this.categories = response.data.data.categories;
          } else {
            // Thử trích xuất từ các cấu trúc dữ liệu khác nhau
            this.categories = response.data.categories || 
                             (response.data.data && response.data.data.categories) || 
                             [];
          }
          
          // Chuyển đổi dữ liệu danh mục thành mảng chuỗi đơn giản
          this.categories = this.categories.map(cat => {
            if (typeof cat === 'string') return cat;
            return cat.categoryName || cat.name || 'Danh mục không xác định';
          });
          
          console.log('Danh sách danh mục:', this.categories);
        } else {
          console.error('API không trả về dữ liệu danh mục hợp lệ');
          this.categories = [];
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        this.categories = [];
      }
    },
    
    // Lấy sách từ API với các bộ lọc
    async fetchBooks() {
      this.loading = true;
      
      try {
        // Xây dựng bộ lọc từ selectedCategory và searchQuery
        const filters = {};
        
        // Thêm bộ lọc danh mục nếu đã chọn
        if (this.selectedCategory) {
          filters.categories = [this.selectedCategory];
        }
        
        // Thêm bộ lọc tìm kiếm nếu có từ khóa
        if (this.searchQuery && this.searchQuery.trim()) {
          filters.searchQuery = this.searchQuery.trim();
        }
        
        console.log('Đang tìm sách với bộ lọc:', filters);
        
        // Gọi API với tham số trang và bộ lọc
        const response = await BookService.getAllBooks(
          this.currentPage,
          this.itemsPerPage,
          filters
        );
        
        // Xử lý dữ liệu phản hồi
        if (response.data && response.data.data) {
          const data = response.data.data;
          
          // Cập nhật danh sách sách
          this.books = data.books || [];
          
          // Cập nhật thông tin phân trang
          if (data.pagination) {
            this.totalBooks = data.pagination.totalBooks || 0;
            this.totalPages = data.pagination.totalPages || 0;
          } else {
            this.totalBooks = this.books.length;
            this.totalPages = 1;
          }
          
          console.log(`Tìm thấy ${this.totalBooks} sách, ${this.totalPages} trang`);
        } else {
          console.error('Cấu trúc dữ liệu API không như mong đợi:', response.data);
          this.books = [];
          this.totalBooks = 0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sách:', error);
        this.error = 'Không thể lấy dữ liệu sách. Vui lòng thử lại sau.';
        this.books = [];
        this.totalBooks = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },
    
    // Tìm kiếm sách theo từ khóa nhập vào
    searchBooks() {
      // Đặt lại trang về 1 khi thực hiện tìm kiếm mới
      this.currentPage = 1;
      this.fetchBooks();
    },
    
    // Xử lý khi chọn danh mục từ dropdown
    selectCategory(category) {
      // Nếu đang chọn danh mục hiện tại, không làm gì
      if (this.selectedCategory === category) return;
      
      // Cập nhật danh mục đã chọn
      this.selectedCategory = category;
      
      // Đóng dropdown
      this.showDropdown = false;
      
      // Đặt lại trang về 1 và thực hiện tìm kiếm mới
      this.currentPage = 1;
      this.fetchBooks();
    },
    
    // Mở/đóng dropdown
    toggleDropdown(event) {
      if (event) event.stopPropagation();
      this.showDropdown = !this.showDropdown;
    },
    
    // Đóng dropdown khi click bên ngoài
    closeDropdownOutside(event) {
      const dropdown = document.querySelector('.dropdown-container');
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    },
    
    // Xử lý khi chuyển trang
    changePage(page) {
      if (this.currentPage !== page) {
        this.currentPage = page;
        this.fetchBooks();
      }
    },
    
    // Mở form thêm sách mới
    openAddBookForm() {
      this.editMode = false;
      this.currentBook = null;
      this.showProductForm = true;
    },
    
    // Mở form sửa sách
    editBook(book) {
      this.editMode = true;
      this.currentBook = { ...book };
      this.showProductForm = true;
    },
    
    // Đóng form thêm/sửa sách
    closeProductForm() {
      this.showProductForm = false;
      this.editMode = false;
      this.currentBook = null;
    },
    
    // Xác nhận xóa sách
    confirmDeleteBook(book) {
      this.bookToDelete = book;
      this.showDeleteConfirm = true;
    },
    
    // Hủy xóa sách
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.bookToDelete = null;
    },
    
    // Xóa sách
    async deleteBook() {
      if (!this.bookToDelete || !this.bookToDelete._id) return;
      
      try {
        await BookService.deleteBook(this.bookToDelete._id);
        
        eventBus.emit('show-alert', {
          show: true,
          type: 'success',
          title: 'Xóa thành công',
          message: `Sách "${this.bookToDelete.title}" đã được xóa`,
          autoClose: true
        });
        
        // Cập nhật lại danh sách sách
        this.fetchBooks();
      } catch (error) {
        console.error('Lỗi khi xóa sách:', error);
        
        eventBus.emit('show-alert', {
          show: true,
          type: 'error',
          title: 'Lỗi',
          message: 'Không thể xóa sách. Vui lòng thử lại sau.',
          autoClose: true
        });
      } finally {
        this.showDeleteConfirm = false;
        this.bookToDelete = null;
      }
    },
    
    // Lấy URL hình ảnh của sách
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
    handleImageError(event, book) {
      event.target.src = `https://via.placeholder.com/150x200?text=${encodeURIComponent(book.title)}`;
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
    },
    
    // Xử lý khi sách được tạo mới thành công
    handleBookCreated() {
      eventBus.emit('show-alert', {
        show: true,
        type: 'success',
        title: 'Thành công',
        message: 'Sách đã được thêm thành công',
        autoClose: true
      });
      
      // Đóng form và làm mới danh sách sách
      this.closeProductForm();
      this.fetchBooks();
    }
  }
};
</script>

<style scoped>
.product-management {
  padding: 30px;
  width: 100%;
}

.page-title {
  color: #4d2900;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-grow: 1;
  max-width: 800px;
}

.dropdown-container {
  position: relative;
  min-width: 120px;
}

.dropdown-button {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.search-container {
  display: flex;
  flex-grow: 1;
}

.search-container input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  flex-grow: 1;
  min-width: 200px;
}

.search-btn {
  background-color: #4d2900;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.add-product-btn, .refresh-btn {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-product-btn {
  background-color: #4d2900;
  color: white;
}

.refresh-btn {
  background-color: #f5f5f5;
  color: #4d2900;
  border: 1px solid #4d2900;
}

.product-count {
  font-size: 16px;
  color: #333;
  margin: 0 0 20px 0;
}

.loading, .no-books {
  text-align: center;
  padding: 40px;
  color: #4d2900;
  font-size: 18px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 30px;
  width: 100%;
}

.product-item {
  width: 100%;
  margin-bottom: 0;
}

:deep(.product-card) {
  width: 100%;
  padding: 10px 15px;
}

.product-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
}

.product-title {
  font-size: 18px;
  margin: 0 0 8px 0;
  font-weight: 700;
  color: #4d2900;
  line-height: 1.3;
}

.product-author {
  font-size: 14px;
  color: #666;
  margin: 0 0 10px 0;
  font-style: italic;
}

.product-description {
  font-size: 14px;
  color: #333;
  margin: 0 0 20px 0;
  line-height: 1.5;
  flex-grow: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #4d2900;
  margin: 0;
}

.product-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.edit {
  color: #4d2900;
}

.delete {
  color: #e53935;
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  min-width: 400px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.create-modal {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.confirm-delete {
  text-align: center;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.confirm-btn {
  background-color: #e53935;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}
</style>