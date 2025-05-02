<template>
    <div class="book-catalog">
      <div class="catalog-header">
        <div class="results-count">Hiển thị {{ filteredBooks.length }} sản phẩm</div>
        <div class="sorting-options">
          <select v-model="sortOption" class="sort-select">
            <option value="default">Sắp xếp theo</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="bestseller">Bán chạy nhất</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>
  
      <BookGrid :books="paginatedBooks" />
  
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </template>
  
<script>
    import BookGrid from './BookGrid.vue';
    import Pagination from './Pagination.vue';
    import BookService from '@/services/BookService';

    export default {
        name: 'BookCatalog',
        components: {
            BookGrid,
            Pagination
        },
        data() {
            return {
                books: [],
                currentPage: 1,
                booksPerPage: 16, // 5 sách mỗi hàng x 4 hàng
                loading: false,
                error: null,
                sortOption: 'default',
                filters: {},
                searchQuery: ''
            };
        },
        computed: {
            filteredBooks() {
                if (!this.books || !Array.isArray(this.books)) {
                    return [];
                }
                let result = [...this.books];
                
                // Áp dụng tìm kiếm nếu có
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    result = result.filter(book => 
                    (book.title && book.title.toLowerCase().includes(query)) || 
                    (book.author && book.author.toLowerCase().includes(query))
                    );
                }

                // Áp dụng bộ lọc nếu có
                if (this.filters.categories && this.filters.categories.length > 0) {
                    result = result.filter(book => this.filters.categories.includes(book.category));
                }
                
                if (this.filters.minPrice) {
                    result = result.filter(book => book.price >= this.filters.minPrice);
                }
                
                if (this.filters.maxPrice) {
                    result = result.filter(book => book.price <= this.filters.maxPrice);
                }
                
                // Áp dụng sắp xếp
                switch (this.sortOption) {
                    case 'price-asc':
                    result.sort((a, b) => a.price - b.price);
                    break;
                    case 'price-desc':
                    result.sort((a, b) => b.price - a.price);
                    break;
                    case 'bestseller':
                    result.sort((a, b) => b.sold - a.sold);
                    break;
                    case 'newest':
                    // Giả sử sách được thêm vào theo thứ tự _id
                    result.sort((a, b) => b._id?.localeCompare(a._id));
                    break;
                }
                
                return result;
            },
            paginatedBooks() {
                const startIndex = (this.currentPage - 1) * this.booksPerPage;
                return this.filteredBooks.slice(startIndex, startIndex + this.booksPerPage);
            },
            totalPages() {
                return Math.ceil(this.filteredBooks.length / this.booksPerPage);
            }
        },
        methods: {
            async fetchBooks() {
                this.loading = true;
                this.error = null;
                
                try {
                    const response = await BookService.getAllBooks();
                    console.log("API response:", response); // Log để kiểm tra response
                    
                    if (response.data && response.data.success) {
                        // Kiểm tra và đảm bảo dữ liệu là mảng
                        if (Array.isArray(response.data.data)) {
                            this.books = response.data.data;
                        } else if (response.data.data && response.data.data.books && Array.isArray(response.data.data.books)) {
                            // Trường hợp API trả về { success: true, data: { books: [...] } }
                            this.books = response.data.data.books;
                        } else {
                            // Nếu không phải mảng, ghi log và gán mảng rỗng
                            console.error('Books data is not an array:', response.data.data);
                            this.books = [];
                            this.error = 'Định dạng dữ liệu không hợp lệ';
                        }
                    } else {
                        this.books = [];
                        this.error = 'Không thể tải danh sách sách';
                    }
                } catch (error) {
                    console.error('Error fetching books:', error);
                    this.books = [];
                    this.error = 'Đã xảy ra lỗi khi tải danh sách sách';
                } finally {
                    this.loading = false;
                }
            },
            handlePageChange(page) {
                this.currentPage = page;
                // Cuộn lên đầu danh sách sản phẩm
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            applyFilters(filters) {
                this.filters = { ...filters };
                
                // Lấy searchQuery từ URL query params nếu có
                if (this.$route.query.search) {
                    this.searchQuery = this.$route.query.search;
                }
                
                this.currentPage = 1; // Reset về trang đầu tiên khi áp dụng bộ lọc
            }
        },
        created() {
            this.fetchBooks();

            if (this.$route.query.search) {
                this.searchQuery = this.$route.query.search;
            }
        },
        watch: {
            sortOption() {
                this.currentPage = 1; // Reset về trang đầu tiên khi thay đổi sắp xếp
            },

            '$route.query.search'(newValue) {
                this.searchQuery = newValue || '';
                this.currentPage = 1; // Reset về trang đầu khi tìm kiếm thay đổi
            }
        }
    };
</script>
  
<style scoped>
    .book-catalog {
        width: 100%;
    }

    .catalog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .results-count {
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #666;
    }

    .sort-select {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #333;
        background-color: #fff;
    }

    .sort-select:focus {
        outline: none;
        border-color: #4d2900;
    }
</style>