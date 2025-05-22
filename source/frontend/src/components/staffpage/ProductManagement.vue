<template>
  <div class="product-management">
    <h1 class="page-title">Quản lý sản phẩm</h1>

    <div class="toolbar">
      <!-- HÀNG 1: Bộ lọc, thanh tìm kiếm và nút thêm sản phẩm -->
      <div class="top-row">
        <div class="filter-group">
          <!-- Dropdown lọc theo danh mục -->
          <div class="filter-card category-filter">
            <div class="dropdown-container">
              <button class="dropdown-button" @click="toggleDropdown">
                <span
                  >Danh mục:
                  {{
                    selectedCategory === null ? "Tất cả" : selectedCategory
                  }}</span
                >
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="dropdown-content" v-if="showDropdown">
                <div class="category-item" @click="selectCategory(null)">
                  <div class="checkbox">
                    <i
                      v-if="selectedCategory === null"
                      class="fa-solid fa-check"
                    ></i>
                  </div>
                  <p class="category-name">Tất cả</p>
                </div>
                <div
                  v-for="category in categories"
                  :key="category"
                  class="category-item"
                  :class="{ active: selectedCategory === category }"
                  @click="selectCategory(category)"
                >
                  <div class="checkbox">
                    <i
                      v-if="selectedCategory === category"
                      class="fa-solid fa-check"
                    ></i>
                  </div>
                  <p class="category-name">{{ category }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dropdown lọc theo thứ tự -->
          <div class="filter-card sort-filter">
            <div class="dropdown-container">
              <button class="dropdown-button" @click="toggleSortDropdown">
                <span>Sắp xếp: {{ getSortLabel() }}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="dropdown-content" v-if="showSortDropdown">
                <div
                  v-for="option in sortOptions"
                  :key="option.value"
                  class="sort-item"
                  :class="{ active: sortOption === option.value }"
                  @click="selectSortOption(option.value)"
                >
                  <div class="checkbox">
                    <i
                      v-if="sortOption === option.value"
                      class="fa-solid fa-check"
                    ></i>
                  </div>
                  <p class="sort-name">{{ option.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Box tìm kiếm -->
        <div class="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sách hoặc tên tác giả..."
            v-model="searchQuery"
            @input="debouncedSearch"
          />
          <button class="search-btn">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <!-- Nút thêm sách mới -->
        <button class="add-product-btn" @click="openAddBookForm">
          <i class="fas fa-plus"></i> Thêm sách mới
        </button>
      </div>

      <!-- HÀNG 2: Các nút còn lại -->
      <div class="bottom-row">
        <!-- Nút lọc sản phẩm mới nhập -->
        <button
          class="filter-btn"
          :class="{ active: showRecentlyAdded }"
          @click="toggleRecentlyAdded"
        >
          <i class="fas fa-calendar-alt"></i> Sản phẩm mới nhập
        </button>

        <!-- Nút làm mới bộ lọc -->
        <button class="refresh-btn" @click="resetFilters">
          <i class="fas fa-sync-alt"></i> Làm mới bộ lọc
        </button>
      </div>
    </div>

    <!-- Phần còn lại giữ nguyên -->
    <div class="active-filters" v-if="hasActiveFilters">
      <span class="filter-label">Bộ lọc đang áp dụng:</span>
      <div class="filter-tags">
        <div class="filter-tag" v-if="selectedCategory">
          Danh mục: {{ selectedCategory }}
          <i class="fas fa-times" @click="selectCategory(null)"></i>
        </div>
        <div class="filter-tag" v-if="sortOption !== 'default'">
          Sắp xếp: {{ getSortLabel() }}
          <i class="fas fa-times" @click="selectSortOption('default')"></i>
        </div>
        <div class="filter-tag" v-if="searchQuery">
          Tìm kiếm: {{ searchQuery }}
          <i class="fas fa-times" @click="clearSearch"></i>
        </div>
        <div class="filter-tag" v-if="showRecentlyAdded">
          Sản phẩm mới nhập
          <i class="fas fa-times" @click="toggleRecentlyAdded"></i>
        </div>
      </div>
    </div>

    <!-- Thêm dòng hiển thị số sản phẩm -->
    <div class="product-count">{{ totalBooks }} sản phẩm</div>

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
          @book-deleted="fetchBooks"
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

    <!-- Modal đã có giữ nguyên -->
    <div
      v-if="showProductForm && !editMode"
      class="modal-overlay"
      @click.self="closeProductForm"
    >
      <div class="create-modal">
        <ProductCreate
          @close="closeProductForm"
          @book-created="handleBookCreated"
        />
      </div>
    </div>

    <!-- Modal overlay cho ProductEditPage -->
    <div
      v-if="showProductForm && editMode"
      class="modal-overlay"
      @click.self="closeProductForm"
    >
      <div class="edit-modal">
        <ProductEditPage
          @close="closeProductForm"
          @book-updated="handleBookUpdated"
          :book="currentBook"
        />
      </div>
    </div>

    <div
        v-if="showDeleteConfirm"
        class="modal-overlay"
        @click.self="cancelDelete"
      >
        <div class="modal-container confirm-delete">
          <h2>Xác nhận xóa</h2>
          <p>
            Bạn có chắc chắn muốn xóa sách "{{ bookToDelete?.title }}" không?
          </p>
          <div class="modal-actions">
            <button class="cancel-btn" @click="cancelDelete">Hủy</button>
            <button class="confirm-btn" @click="deleteBook">Xóa</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import BookService from "@/services/BookService";
import Pagination from "@/components/categorypage/Pagination.vue";
import ProductCard from "./ProductCard.vue";
import ProductCreate from "./ProductCreate.vue";
import eventBus from "@/eventBus.js";
import ProductEditPage from "./productedit/ProductEditPage.vue";

export default {
  name: "ProductManagement",
  components: {
    Pagination,
    ProductCard,
    ProductCreate,
    ProductEditPage,
  },
  data() {
    return {
      searchQuery: "",
      searchTimeout: null,
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
      showSortDropdown: false,
      sortOption: "default",
      sortOptions: [
        { value: "default", label: "Mặc định" },
        { value: "price-asc", label: "Giá: Thấp đến cao" },
        { value: "price-desc", label: "Giá: Cao đến thấp" },
        { value: "bestseller", label: "Bán chạy nhất" },
        { value: "newest", label: "Mới nhất" },
      ],
      showRecentlyAdded: false, // Trạng thái lọc sản phẩm mới nhập
      recentDaysThreshold: 7, // Số ngày để xác định sản phẩm mới (7 ngày)
      showProductForm: false,
      editMode: false,
      currentBook: null,
      showDeleteConfirm: false,
      bookToDelete: null,
    };
  },
  computed: {
    hasActiveFilters() {
      return (
        this.selectedCategory !== null ||
        this.sortOption !== "default" ||
        this.searchQuery.trim() !== "" ||
        this.showRecentlyAdded
      );
    },
  },
  created() {
    this.fetchCategories();
    this.fetchBooks();

    // Đóng dropdown khi click ngoài
    document.addEventListener("click", this.closeDropdownOutside);
  },
  beforeUnmount() {
    // Dọn dẹp event listener khi component bị hủy
    document.removeEventListener("click", this.closeDropdownOutside);
  },
  methods: {
    // Thêm vào phần methods

    handleBookUpdated() {
      eventBus.emit("show-alert", {
        show: true,
        type: "success",
        title: "Thành công",
        message: "Sách đã được cập nhật thành công",
        autoClose: true,
      });

      // Đóng form và làm mới danh sách
      this.closeProductForm();
      this.fetchBooks();
    },
    debouncedSearch() {
      // Xóa timeout cũ nếu người dùng tiếp tục gõ
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Thiết lập timeout mới để trì hoãn tìm kiếm
      this.searchTimeout = setTimeout(() => {
        this.searchBooks();
      }, 500); // Đợi 500ms sau khi người dùng ngừng gõ
    },
    // Lấy tên hiển thị của tùy chọn sắp xếp
    getSortLabel() {
      const option = this.sortOptions.find(
        (opt) => opt.value === this.sortOption
      );
      return option ? option.label : "Mặc định";
    },

    // Lấy danh mục từ API - giữ nguyên
    async fetchCategories() {
      try {
        const response = await BookService.getCategories();

        if (response.data && response.data.success) {
          // Kiểm tra cấu trúc dữ liệu và trích xuất danh mục
          if (Array.isArray(response.data.data)) {
            this.categories = response.data.data;
          } else if (
            response.data.data &&
            Array.isArray(response.data.data.categories)
          ) {
            this.categories = response.data.data.categories;
          } else {
            this.categories =
              response.data.categories ||
              (response.data.data && response.data.data.categories) ||
              [];
          }

          // Chuyển đổi dữ liệu danh mục thành mảng chuỗi đơn giản
          this.categories = this.categories.map((cat) => {
            if (typeof cat === "string") return cat;
            return cat.categoryName || cat.name || "Danh mục không xác định";
          });
        } else {
          console.error("API không trả về dữ liệu danh mục hợp lệ");
          this.categories = [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        this.categories = [];
      }
    },

    async fetchRecentlyAddedBooks() {
      this.loading = true;
      try {
        // Giống như trong NewBooks.vue - sử dụng getRecentlyAddedBooks
        const response = await BookService.getRecentlyAddedBooks(
          this.itemsPerPage * 5
        ); // Lấy đủ số sách để phân trang

        // Xử lý linh hoạt với nhiều cấu trúc có thể có từ response
        let books = [];

        if (
          response.data &&
          response.data.success &&
          response.data.data &&
          response.data.data.books
        ) {
          // Cấu trúc từ responseFormatterMiddleware
          books = response.data.data.books;
        } else if (response.data && response.data.books) {
          // Cấu trúc trả về trực tiếp từ controller
          books = response.data.books;
        } else if (Array.isArray(response.data)) {
          // Mảng sách trực tiếp
          books = response.data;
        } else {
          throw new Error("Định dạng dữ liệu không hợp lệ từ API");
        }

        console.log("Sách mới nhập:", books);

        // Cập nhật danh sách sách
        this.books = books;

        // Cập nhật thông tin phân trang
        this.totalBooks = books.length;
        this.totalPages = Math.ceil(this.totalBooks / this.itemsPerPage);

        // Thực hiện phân trang ngay nếu có nhiều sách
        if (this.totalBooks > this.itemsPerPage) {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = startIndex + this.itemsPerPage;
          this.books = books.slice(startIndex, endIndex);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sách mới nhập:", error);
        this.error = "Không thể tải danh sách sách mới. Vui lòng thử lại sau.";
        this.books = [];
        this.totalBooks = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },
    // Lấy sách từ API - cập nhật để hỗ trợ các tùy chọn lọc mới
    async fetchBooks() {
      // Nếu đang lọc sản phẩm mới nhập, gọi phương thức riêng
      if (this.showRecentlyAdded) {
        await this.fetchRecentlyAddedBooks();
        return;
      }

      this.loading = true;

      try {
        // Chuẩn bị các tham số tìm kiếm
        const searchParams = {
          page: this.currentPage,
          limit: this.itemsPerPage,
        };

        // Thêm bộ lọc tìm kiếm nếu có từ khóa
        if (this.searchQuery && this.searchQuery.trim()) {
          searchParams.keyword = this.searchQuery.trim();
        }

        // Thêm bộ lọc danh mục nếu đã chọn
        if (this.selectedCategory) {
          searchParams.categories = this.selectedCategory;
        }

        // Chuyển đổi sortOption sang định dạng backend yêu cầu
        switch (this.sortOption) {
          case "price-asc":
            searchParams.sortBy = "price_asc";
            break;
          case "price-desc":
            searchParams.sortBy = "price_desc";
            break;
          case "bestseller":
            searchParams.sortBy = "bestseller";
            break;
          case "newest":
            searchParams.sortBy = "newest";
            break;
          default:
            searchParams.sortBy = "default";
        }

        console.log("Tìm kiếm sách với tham số:", searchParams);

        // Gọi API searchBooks
        const response = await BookService.searchBooks(searchParams);

        if (response.data && response.data.success) {
          // Cập nhật dữ liệu từ API response
          const responseData = response.data.data;

          // Cập nhật danh sách sách
          this.books = responseData.books || [];

          // Cập nhật thông tin phân trang từ API
          if (responseData.pagination) {
            const pagination = responseData.pagination;
            this.totalPages = pagination.totalPages || 1;
            this.totalBooks = pagination.totalBooks || 0;
            this.currentPage = pagination.currentPage || 1;
          } else {
            this.totalBooks = this.books.length;
            this.totalPages = 1;
          }
        } else {
          console.error(
            "Cấu trúc dữ liệu API không như mong đợi:",
            response.data
          );
          this.books = [];
          this.totalBooks = 0.0;
          this.totalPages = 0;
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
        this.error = "Không thể lấy dữ liệu sách. Vui lòng thử lại sau.";
        this.books = [];
        this.totalBooks = 0;
        this.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    // Cập nhật phương thức applyFilters giống BookCatalog
    applyFilters() {
      this.currentPage = 1; // Reset về trang đầu tiên khi áp dụng bộ lọc
      this.fetchBooks();
    },

    // Reset tất cả bộ lọc
    resetFilters() {
      this.selectedCategory = null;
      this.sortOption = "default";
      this.searchQuery = "";
      this.showRecentlyAdded = false;
      this.currentPage = 1;
      this.fetchBooks();
    },

    // Xóa tìm kiếm
    clearSearch() {
      this.searchQuery = "";
      this.currentPage = 1;
      this.fetchBooks();
    },

    // Tìm kiếm sách theo từ khóa nhập vào
    searchBooks() {
      this.currentPage = 1;
      this.fetchBooks();
    },

    // Bật/tắt lọc sản phẩm mới nhập
    toggleRecentlyAdded() {
      this.showRecentlyAdded = !this.showRecentlyAdded;
      this.currentPage = 1;

      // Nếu các bộ lọc khác đang được áp dụng, reset chúng khi bật lọc sản phẩm mới
      if (this.showRecentlyAdded) {
        // Giữ trạng thái showRecentlyAdded nhưng reset các bộ lọc khác
        this.selectedCategory = null;
        this.searchQuery = "";
      }

      this.fetchBooks();
    },

    // Xử lý khi chọn danh mục từ dropdown
    selectCategory(category) {
      this.selectedCategory = category;
      this.showDropdown = false;
      this.currentPage = 1;
      this.fetchBooks();
    },

    // Xử lý khi chọn tùy chọn sắp xếp
    selectSortOption(option) {
      if (this.sortOption === option) return;

      this.sortOption = option;
      this.showSortDropdown = false;
      this.currentPage = 1;
      this.fetchBooks();
    },

    // Mở/đóng dropdown danh mục
    toggleDropdown(event) {
      if (event) event.stopPropagation();
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) this.showSortDropdown = false;
    },

    // Mở/đóng dropdown sắp xếp
    toggleSortDropdown(event) {
      if (event) event.stopPropagation();
      this.showSortDropdown = !this.showSortDropdown;
      if (this.showSortDropdown) this.showDropdown = false;
    },

    // Đóng dropdown khi click bên ngoài
    closeDropdownOutside(event) {
      const categoryDropdown = document.querySelector(
        ".category-filter .dropdown-container"
      );
      const sortDropdown = document.querySelector(
        ".sort-filter .dropdown-container"
      );

      if (categoryDropdown && !categoryDropdown.contains(event.target)) {
        this.showDropdown = false;
      }

      if (sortDropdown && !sortDropdown.contains(event.target)) {
        this.showSortDropdown = false;
      }
    },

    // Xử lý khi chuyển trang - giữ nguyên
    changePage(page) {
      if (this.currentPage !== page) {
        this.currentPage = page;

        // Nếu đang lọc sản phẩm mới nhập và đã có dữ liệu, chỉ cần phân trang lại
        if (this.showRecentlyAdded && this.totalBooks > this.itemsPerPage) {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = startIndex + this.itemsPerPage;

          // books đầy đủ được lưu trữ tạm thời trong biến allBooks
          if (this._allNewBooks && this._allNewBooks.length > 0) {
            this.books = this._allNewBooks.slice(startIndex, endIndex);
          } else {
            // Nếu chưa có dữ liệu lưu trữ, fetch lại
            this.fetchBooks();
          }
        } else {
          // Trường hợp bình thường, gọi API để lấy trang mới
          this.fetchBooks();
        }
      }
    },

    // Các phương thức khác giữ nguyên
    openAddBookForm() {
      this.editMode = false;
      this.currentBook = null;
      this.showProductForm = true;
    },

    editBook(book) {
      this.editMode = true;
      this.currentBook = { ...book };
      this.showProductForm = true;
    },

    closeProductForm() {
      this.showProductForm = false;
      this.editMode = false;
      this.currentBook = null;
    },

    confirmDeleteBook(book) {
      this.bookToDelete = book;
      this.showDeleteConfirm = true;
    },

    cancelDelete() {
      this.showDeleteConfirm = false;
      this.bookToDelete = null;
    },

    async deleteBook() {
      if (!this.bookToDelete || !this.bookToDelete._id) return;

      try {
        await BookService.deleteBook(this.bookToDelete._id);

        eventBus.emit("show-alert", {
          show: true,
          type: "success",
          title: "Xóa thành công",
          message: `Sách "${this.bookToDelete.title}" đã được xóa`,
          autoClose: true,
        });

        this.fetchBooks();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);

        eventBus.emit("show-alert", {
          show: true,
          type: "error",
          title: "Lỗi",
          message: "Không thể xóa sách. Vui lòng thử lại sau.",
          autoClose: true,
        });
      } finally {
        this.showDeleteConfirm = false;
        this.bookToDelete = null;
      }
    },

    handleBookCreated() {
      eventBus.emit("show-alert", {
        show: true,
        type: "success",
        title: "Thành công",
        message: "Sách đã được thêm thành công",
        autoClose: true,
      });

      // Đóng form và làm mới danh sách, tự động bật chế độ hiển thị sản phẩm mới nhập
      this.closeProductForm();
      this.showRecentlyAdded = true;
      this.fetchBooks();
    },
  },
};
</script>

<style scoped>
/* Thêm vào phần <style scoped> */
.edit-modal {
  background-color: white;
  border-radius: 10px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.product-management {
  padding: 30px;
  width: 100%;
  font-family: "Montserrat", sans-serif;
}

.page-title {
  color: #4d2900;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
  font-family: "Montserrat", sans-serif;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}

/* Hàng đầu tiên - chứa bộ lọc, thanh tìm kiếm và nút thêm */
.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* Hàng thứ hai - chứa các nút còn lại */
.bottom-row {
  display: flex;
  gap: 15px;
  width: 100%;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

/* Style cho filter card giống CategoryFilter */
.filter-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  width: 250px; /* Chiều dài cố định đủ cho option dài nhất */
  min-width: 250px;
  position: relative;
}

.dropdown-container {
  position: relative;
  width: 100%;
  font-family: "Montserrat", sans-serif;
}

.dropdown-button {
  background-color: transparent;
  border: none;
  padding: 3px 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.dropdown-button {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 220px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 10;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
}

.dropdown-content {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
}

.category-item,
.sort-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-item:hover,
.sort-item:hover {
  background-color: #f5f5f5;
}

.category-item.active,
.sort-item.active {
  background-color: rgba(77, 41, 0, 0.1);
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 1.5px solid #4d2900;
  border-radius: 4px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4d2900;
}

.category-name,
.sort-name {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  margin: 0;
}

.search-container {
  display: flex;
  flex-grow: 1;
  min-width: 250px;
}

.search-container input {
  font-family: "Montserrat", sans-serif;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px 0 0 8px;
  flex-grow: 1;
  min-width: 200px;
  font-size: 14px;
}

.search-btn {
  background-color: #4d2900;
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.add-product-btn,
.refresh-btn,
.filter-btn {
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-product-btn {
  background-color: #4d2900;
  color: white;
}

.add-product-btn:hover {
  background-color: #392000;
}

.refresh-btn {
  background-color: #f5f5f5;
  color: #4d2900;
  border: 1px solid #4d2900;
}

.refresh-btn:hover {
  background-color: #e8e8e8;
}

.filter-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.filter-btn:hover,
.filter-btn.active {
  background-color: #4d2900;
  color: white;
  border-color: #4d2900;
}

.filter-tag {
  background-color: #f0f0f0;
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Montserrat", sans-serif;
}

.filter-tag i {
  cursor: pointer;
  color: #666;
}

.filter-tag i:hover {
  color: #e53935;
}

.product-count {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  font-family: "Montserrat", sans-serif;
}

.loading,
.no-books {
  text-align: center;
  padding: 40px;
  color: #4d2900;
  font-size: 16px;
  font-family: "Montserrat", sans-serif;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  margin-top: 20px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
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

.cancel-btn,
.confirm-btn {
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
