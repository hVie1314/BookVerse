<template>
    <div class="book-catalog">
        <div id="bannerCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
            <!-- Indicators -->
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            
            <!-- Slides -->
            <div class="carousel-inner rounded-4 shadow">
                <div class="carousel-item active" data-bs-interval="5000">
                <img src="https://cdn1.fahasa.com/media/magentothem/banner7/QuaTangMocKhoa_840x320.png" class="d-block w-100 banner" alt="Banner 1">
                </div>
                <div class="carousel-item" data-bs-interval="5000">
                <img src="https://cdn1.fahasa.com/media/magentothem/banner7/NgoaiVanT5_Resize0505_840x320.png" class="d-block w-100 banner" alt="Banner 2">
                </div>
                <div class="carousel-item" data-bs-interval="5000">
                <img src="https://cdn1.fahasa.com/media/magentothem/banner7/muasamkhongtienmat_840x320T525.png" class="d-block w-100 banner" alt="Banner 3">
                </div>
                <div class="carousel-item" data-bs-interval="5000">
                <img src="https://cdn1.fahasa.com/media/magentothem/banner7/CTT5_Resize_840x320.png" class="d-block w-100 banner" alt="Banner 4">
                </div>
            </div>
            
            <!-- Controls -->
            <button class="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
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
        mounted() {
            this.initCarousel();
        },
        beforeUnmount() {
            if (this.carouselInterval) {
                clearInterval(this.carouselInterval);
            }
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
            // Thêm phương thức mới
            initCarousel() {
                if (typeof window.bootstrap !== 'undefined') {
                    const carouselElement = document.getElementById('bannerCarousel');
                    const carousel = new window.bootstrap.Carousel(carouselElement, {
                        interval: 5000,
                        wrap: true,
                        touch: true
                    });
                    
                    // Tự động chuyển slide nếu muốn
                    this.carouselInterval = setInterval(() => {
                        carousel.next();
                    }, 5000);
                } else {
                    console.warn('Bootstrap không được tìm thấy. Hãy chắc chắn bạn đã import Bootstrap JS.');
                }
            },
            async fetchBooks() {
                this.loading = true;
                this.error = null;
                
                try {
                    const response = await BookService.getAllBooks();
                    // console.log("API response:", response); // Log để kiểm tra response
                    
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
    
    .carousel {
            width: 100%;
            border-radius: 16px;
            overflow: visible;
            background-color: transparent;
            margin-bottom: 30px;
    }

    .carousel-inner {
    background-color: transparent; 
    overflow: hidden;
    border-radius: 8px;
    }

    .banner {
    height: auto;
    width: 100%;
    object-fit: cover;
    margin: 0;
    border-radius: 0; /* Ghi đè border-radius từ class .banner cũ */
    }

    .carousel-control-prev,
    .carousel-control-next {
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.8;
        transition: all 0.3s ease;
        position: absolute;
        z-index: 10;
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
        width: 18px; /* Giảm từ kích thước mặc định 20px */
        height: 18px; /* Giảm từ kích thước mặc định 20px */
        filter: invert(1); /* Làm cho icon màu đen thay vì màu trắng mặc định */
        opacity: 0.7;
    }

    /* Tùy chọn: Thêm hiệu ứng opacity khi hover */
    .carousel-control-prev:hover .carousel-control-prev-icon,
    .carousel-control-next:hover .carousel-control-next-icon {
        opacity: 1;
    }

    /* Giảm kích thước của nút điều khiển */
    .carousel-control-prev,
    .carousel-control-next {
        width: 35px; /* Giảm từ 40px */
        height: 35px; /* Giảm từ 40px */
    }

    .carousel-indicators {
    margin-bottom: 1rem;
    }

    .carousel-indicators [data-bs-target] {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(77, 41, 0, 0.5);
    margin: 0 5px;
    }

    .carousel-indicators .active {
    background-color: #4d2900;
    transform: scale(1.2);
    }

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