<template>
    <section class="recommended-section">
        <div v-if="loading" class="loading-message">
            <i class="fa-solid fa-spinner fa-spin"></i> Đang tải...
        </div>
        
        <div v-else-if="error" class="error-message">
            {{ error }}
        </div>
        
        <div v-else-if="recommendedBooks.length === 0" class="empty-message">
            Không có sách gợi ý
        </div>
        
        <div v-else class="recommended-container">
            <!-- Navigation Arrow Left -->
            <button 
                v-if="recommendedBooks.length > booksPerPage"
                @click="previousPage" 
                :disabled="currentPage === 1"
                class="nav-arrow"
            >
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/7d3414458ba61b581b3e9422963d7885"
                    class="arrow-icon"
                    alt="Previous"
                />
            </button>
            
            <div class="recommended-products">
                <BookCard
                  v-for="book in currentPageBooks"
                  :key="book._id || book.id"
                  :bookId="book._id || book.id"
                  :image="book.image"
                  :price="formatPrice(book.price)"
                  :title="book.title"
                  :author="book.author"
                  :cartText="'Thêm vào giỏ hàng'"
                  :sold="book.sold || 0"
                />
            </div>
            
            <!-- Navigation Arrow Right -->
            <button 
                v-if="recommendedBooks.length > booksPerPage"
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="nav-arrow"
            >
                <img
                    src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/6e58d6e8b23fe01ad1f34ac70cd7e2c8"
                    class="arrow-icon"
                    alt="Next"
                />
            </button>
        </div>
        
        <!-- Pagination Indicators -->
        <div v-if="recommendedBooks.length > 0" class="pagination-dots">
            <span 
                v-for="page in totalPages" 
                :key="page"
                :class="['pagination-dot', { active: currentPage === page }]"
                @click="goToPage(page)"
            ></span>
        </div>
    </section>
</template>
  
<script>
    import BookCard from '../bestsellers/BookCard.vue';
    import BookService from '@/services/BookService';
    
    export default {
        name: 'RecommendedProducts',
        components: {
            BookCard
        },
        props: {
            currentBookId: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                recommendedBooks: [],
                loading: true,
                error: null,
                currentPage: 1,
                booksPerPage: 5,
                totalLimit: 20 // Tổng số sách cần lấy
            }
        },
        computed: {
            // Tính số trang dựa trên số sách và số sách mỗi trang
            totalPages() {
                return Math.ceil(this.recommendedBooks.length / this.booksPerPage);
            },
            // Lấy sách cho trang hiện tại
            currentPageBooks() {
                const startIndex = (this.currentPage - 1) * this.booksPerPage;
                const endIndex = startIndex + this.booksPerPage;
                return this.recommendedBooks.slice(startIndex, endIndex);
            }
        },
        methods: {
            async fetchRecommendedBooks() {
                if (!this.currentBookId) {
                    this.recommendedBooks = [];
                    this.loading = false;
                    return;
                }
                
                this.loading = true;
                this.error = null;
                
                try {
                    // Sửa lại cách gọi API, chỉ truyền bookId và limit
                    const response = await BookService.getRelatedBooks(this.currentBookId, this.totalLimit);
    
                    if (response.data && response.data.books) {
                        // API trả về cấu trúc { books: [...] }
                        this.recommendedBooks = response.data.books.filter(book => book._id !== this.currentBookId);
                    } else if (response.data && response.data.success && response.data.data && response.data.data.books) {
                        // API với middleware trả về { success: true, data: { books: [...] } }
                        this.recommendedBooks = response.data.data.books.filter(book => book._id !== this.currentBookId);
                    } else {
                        this.error = 'Không thể tải danh sách sách gợi ý';
                        this.recommendedBooks = [];
                    }
                } catch (error) {
                    console.error('Error fetching recommended books:', error);
                    this.error = 'Đã xảy ra lỗi khi tải danh sách sách gợi ý';
                    this.recommendedBooks = [];
                } finally {
                    this.loading = false;
                }
            },
            formatPrice(price) {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(price).replace('₫', 'đ');
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
            goToPage(page) {
                this.currentPage = page;
            }
        },
        watch: {
            currentBookId() {
                this.fetchRecommendedBooks();
                this.currentPage = 1; // Reset về trang đầu khi thay đổi sách
            }
        },
        mounted() {
            this.fetchRecommendedBooks();
        }
    };
</script>
  
<style scoped>
    .recommended-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .recommended-products {
        width: 90%;
        display: flex;
        margin-top: 30px;
        align-items: stretch;
        gap: 15px;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 12px;
        color: #4d2900;
        font-weight: 700;
        line-height: 2;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .nav-arrow {
        background: none;
        border: none;
        padding: 10px;
        cursor: pointer;
        margin: 0 10px;
    }
    
    .nav-arrow:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    
    .arrow-icon {
        aspect-ratio: 0.54;
        object-fit: contain;
        object-position: center;
        width: 22px;
        stroke-width: 1px;
        stroke: #4d2900;
        margin: auto 0;
        flex-shrink: 0;
    }
    
    .pagination-dots {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        gap: 8px;
    }
    
    .pagination-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #e0e0e0;
        cursor: pointer;
    }
    
    .pagination-dot.active {
        background-color: #4d2900;
    }
    
    .loading-message, .error-message, .empty-message {
        width: 100%;
        text-align: center;
        padding: 20px 0;
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        color: #4d2900;
    }
    
    .error-message {
        color: #e74c3c;
    }
    
    @media (max-width: 991px) {
        .recommended-products {
            margin-top: 20px;
            gap: 10px;
        }
        
        .nav-arrow {
            padding: 5px;
        }
    }
</style>