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
                v-if="recommendedBooks.length > booksPerPage && currentPage > 1"
                @click="previousPage" 
                :disabled="currentPage === 1"
                class="carousel-control-prev"
                type="button"
            >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
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
                v-if="recommendedBooks.length > booksPerPage && currentPage < totalPages"
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="carousel-control-next"
                type="button"
            >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
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
    .recommended-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative; /* Thêm position relative để định vị các nút control */
        padding: 0 20px; /* Tạo không gian cho các nút control nằm một nửa bên ngoài */
    }

    .recommended-container {
        width: 88%; /* Điều chỉnh từ 90% lên 100% */
        display: flex;
        align-items: center;
        justify-content: center; /* Căn giữa nội dung */
        position: relative;
        padding: 0; /* Bỏ padding và để các nút nằm ngoài container */
        margin: 30px 0; /* Thêm margin thay vì dùng padding */
    }
    
    .recommended-products {
        width: 100%;
        display: flex;
        align-items: stretch;
        gap: 0; /* Bỏ gap và dùng space-between để các card cách đều nhau */
        font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
        font-size: 12px;
        color: #4d2900;
        font-weight: 700;
        line-height: 2;
        justify-content: space-between; /* Thay đổi từ center sang space-between */
        flex-wrap: nowrap; /* Không cho phép xuống dòng để các card cách đều nhau */
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

    .carousel-control-prev,
    .carousel-control-next {
        width: 35px;
        height: 35px;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.8;
        transition: all 0.3s ease;
        position: absolute;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .carousel-control-prev {
        left: 0;
        transform: translateX(-50%) translateY(-50%);
    }

    .carousel-control-next {
        right: 0;
        transform: translateX(50%) translateY(-50%);
    }

    .carousel-control-prev:hover,
    .carousel-control-next:hover {
        background-color: rgba(255, 255, 255, 0.95);
        opacity: 1;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    .carousel-control-prev:hover {
        transform: translateX(-50%) translateY(-50%) scale(1.15);
    }

    .carousel-control-next:hover {
        transform: translateX(50%) translateY(-50%) scale(1.15);
    }

    .carousel-control-prev:disabled,
    .carousel-control-next:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        box-shadow: none;
        transform: translateX(-50%) translateY(-50%) scale(1) !important;
    }

    .carousel-control-next:disabled {
        transform: translateX(50%) translateY(-50%) scale(1) !important;
    }

    .carousel-control-prev-icon,
    .carousel-control-next-icon {
        background-color: #000;
        width: 18px;
        height: 18px;
        filter: invert(1); /* Làm cho icon màu đen */
        opacity: 0.7;
    }
</style>