<template>
    <section class="recommended-section">
        <div v-if="loading" class="loading-message">
            <i class="fa-solid fa-spinner fa-spin"></i> Đang tải...
        </div>
    
        <div v-else-if="error" class="error-message">
            {{ error }}
        </div>
    
        <div v-else class="recommended-container">
            <!-- Navigation Arrow Left - Trực tiếp thay vì dùng component -->
            <button 
                v-if="books.length > booksPerPage && currentPage > 1"
                @click="previousPage" 
                class="carousel-control-prev"
                type="button"
            >
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
      
            <div class="best-seller-content">
                <h2 class="carousel-title">TOP SÁCH BÁN CHẠY</h2>
        
                <div class="book-grid">
                    <BookCard
                        v-for="book in currentPageBooks"
                        :key="book.id"
                        :bookId="book.id"
                        :image="book.image"
                        :price="`${book.price.toLocaleString('vi-VN')} đ`"
                        :originalPrice="book.originalPrice ? `${book.originalPrice.toLocaleString('vi-VN')} đ` : ''"
                        :title="book.title"
                        :author="book.author"
                        :cartText="'Thêm vào giỏ hàng'"
                        :sold="String(book.sold)"
                        :rating="book.rating || 0"
                        :showProgressBar="true"
                    />
                </div>
            </div>
      
            <!-- Navigation Arrow Right - Trực tiếp thay vì dùng component -->
            <button 
                v-if="books.length > booksPerPage && currentPage < totalPages"
                @click="nextPage" 
                class="carousel-control-next"
                type="button"
            >
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    
        <!-- Pagination Indicators -->
        <div v-if="books.length > 0" class="pagination-dots">
            <span 
                v-for="page in totalPages" 
                :key="page"
                :class="['pagination-dot', { active: currentPage === page }]"
                @click="currentPage = page"
            ></span>
        </div>
    </section>
</template>

<script>
import BookCard from "./BookCard.vue";
import BookService from '@/services/BookService';
import CartService from '@/services/CartService';
import eventBus from '@/eventBus.js';

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
        // Các phương thức giữ nguyên như trước
        async fetchTopSellingBooks() {
            this.loading = true;
            try {
                const response = await BookService.getTopSellingBooks(this.totalBooks);
            
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
                console.error("Error fetching top selling books:", error);
                this.error = "Không thể tải danh sách sách bán chạy. Vui lòng thử lại sau.";
                this.loading = false;
            }
        },

        formatBookData(book) {
            // Xử lý ảnh từ chuỗi mảng thành URL đầu tiên
            let imageUrl = '/images/default-book-cover.jpg';
        
            if (book.image) {
                try {
                    // Kiểm tra nếu image là chuỗi mảng
                    if (book.image.startsWith('[') && book.image.endsWith(']')) {
                        // Parse chuỗi thành mảng
                        const imageArray = JSON.parse(book.image.replace(/'/g, '"'));
                        // Lấy URL đầu tiên nếu có
                        if (imageArray && imageArray.length > 0) {
                            imageUrl = imageArray[0];
                        }
                    } else {
                        // Nếu image không phải chuỗi mảng, sử dụng trực tiếp
                        imageUrl = book.image;
                    }
                } catch (error) {
                    console.error("Lỗi xử lý URL hình ảnh:", error);
                }
            }
      
            return {
                id: book._id,
                image: imageUrl,
                price: book.price,
                originalPrice: book.originalPrice > book.price ? book.originalPrice : null,
                title: book.title,
                author: book.author,
                sold: String(book.sold || 0),
                rating: book.rating || 0
            };
        },
    
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
    
        async addToCart(bookId) {
            try {
                await CartService.addToCart({ bookId, quantity: 1 });
                this.$toast.success("Đã thêm sách vào giỏ hàng");

                eventBus.emit("cart-updated"); // Phát sự kiện để cập nhật giỏ hàng
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
/* CSS tương tự như trong RecommendedProducts */
.recommended-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 0 20px;
}

.recommended-container {
    width: 88%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0;
    margin: 30px 0;
}

/* Thêm style cho phần nội dung chính */
.best-seller-content {
    width: 100%;
    display: flex;
    flex-direction: column;
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
    align-items: stretch;
    gap: 0;
    width: 100%;
    justify-content: space-between;
    flex-wrap: nowrap;
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

.loading-message, .error-message {
    width: 100%;
    text-align: center;
    padding: 20px 0;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
    color: #4d2900;
}

.error-message {
    color: #e74c3c;
}

/* Style cho nút điều khiển - giống hệt RecommendedProducts */
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

.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-color: #000;
    width: 18px;
    height: 18px;
    filter: invert(1);
    opacity: 0.7;
}

@media (max-width: 991px) {
    .book-grid {
        justify-content: center;
    }
}

@media (max-width: 640px) {
    .carousel-title {
        font-size: 20px;
    }
}
</style>