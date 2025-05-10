<template>
    <div class="book-catalog">
        <div id="bannerCarousel" v-if="!isWishlistPage" class="carousel slide mb-4" data-bs-ride="carousel">
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
        <div v-if="!isWishlistPage" class="catalog-header">
            <div class="results-count">Hiển thị {{ totalBooks }} sản phẩm</div>
            <div class="sorting-options">
                <select v-model="sortOption" class="sort-select" @change="fetchBooks">
                    <option value="default">Sắp xếp theo</option>
                    <option value="price-asc">Giá: Thấp đến cao</option>
                    <option value="price-desc">Giá: Cao đến thấp</option>
                    <option value="bestseller">Bán chạy nhất</option>
                    <option value="newest">Mới nhất</option>
                </select>
            </div>
        </div>

        <div v-if="isWishlistPage" class="wishlist-header">
            <div class="results-count">{{ totalBooks }} sản phẩm yêu thích</div>
        </div>
    
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Đang tải sách...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else-if="isWishlistPage && books.length === 0" class="empty-wishlist">
        <i class="fa-regular fa-heart fa-3x"></i>
        <p>Danh sách yêu thích của bạn đang trống</p>
        <router-link to="/category" class="browse-books-btn">Khám phá sách</router-link>
    </div>
    <div v-else>
      <BookGrid :books="books" :isWishlistPage="isWishlistPage"  @remove-from-wishlist="handleRemoveFromWishlist"/>
    
      <Pagination
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="handlePageChange"
      />
    </div>
  </div>
  </template>
  
<script>
    import BookGrid from './BookGrid.vue';
    import Pagination from './Pagination.vue';
    import BookService from '@/services/BookService';
    // import AuthenticationService from '@/services/AuthenticationService';
    import WishlistService from '@/services/WishlistService';
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
                totalPages: 1,
                totalBooks: 0,
                booksPerPage: 16,
                wishlistBooksPerPage: 25,
                loading: false,
                error: null,
                sortOption: 'default',
                filters: {},
                searchQuery: '',    
                isWishlistPage: false,
                wishlistAllBooks: []
            };
        },
        
        mounted() {
            // Chỉ khởi tạo carousel khi không phải trang wishlist
            if (!this.isWishlistPage) {
                this.initCarousel();
            }
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
                return this.books; // Trả về books trực tiếp vì đã phân trang từ server
            }
            // totalPages() {
            //     return Math.ceil(this.filteredBooks.length / this.booksPerPage);
            // }
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
                    // Chuẩn bị các tham số tìm kiếm
                    const searchParams = {
                    page: this.currentPage,
                    limit: this.booksPerPage
                    };
                    
                    // Thêm các tham số lọc
                    if (this.searchQuery) {
                    searchParams.keyword = this.searchQuery;
                    }
                    
                    if (this.filters.categories && this.filters.categories.length > 0) {
                        // Gửi tất cả danh mục đã chọn thay vì chỉ lấy danh mục đầu tiên
                        searchParams.categories = this.filters.categories.join(',');
                    }
                    
                    if (this.filters.minPrice) {
                    searchParams.minPrice = this.filters.minPrice;
                    }
                    
                    if (this.filters.maxPrice) {
                    searchParams.maxPrice = this.filters.maxPrice;
                    }
                    
                    if (this.filters.minRating) {
                    searchParams.rating = this.filters.minRating;
                    }
                    
                    // Chuyển đổi sortOption sang định dạng backend yêu cầu
                    switch (this.sortOption) {
                    case 'price-asc':
                        searchParams.sortBy = 'price_asc';
                        break;
                    case 'price-desc':
                        searchParams.sortBy = 'price_desc';
                        break;
                    case 'bestseller':
                        searchParams.sortBy = 'bestseller';
                        break;
                    case 'newest':
                        searchParams.sortBy = 'newest';
                        break;
                    }
                    
                    console.log('Tìm kiếm sách với tham số:', searchParams);
                    
                    // Gọi API search thay vì getAllBooks
                    const response = await BookService.searchBooks(searchParams);
                    
                    if (response.data && response.data.success) {
                    // Cập nhật dữ liệu từ API response
                    this.books = response.data.data.books || [];
                    
                    // Cập nhật thông tin phân trang từ API
                    if (response.data.data.pagination) {
                        const pagination = response.data.data.pagination;
                        this.totalPages = pagination.totalPages || 1;
                        this.totalBooks = pagination.totalBooks || 0;
                        this.currentPage = pagination.currentPage || 1;
                    }
                    
                    console.log(`Đã tải ${this.books.length} sách, trang ${this.currentPage}/${this.totalPages}`);
                    } else {
                    this.error = 'Không thể tải danh sách sách';
                    console.error('API error:', response.data);
                    }
                } catch (error) {
                    this.error = 'Đã xảy ra lỗi khi tải danh sách sách';
                    console.error('Error fetching books:', error);
                } finally {
                    this.loading = false;
                }
            },
            handlePageChange(page) {
                this.currentPage = page;
                // Cuộn lên đầu danh sách sản phẩm
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Logic phân trang riêng cho danh sách yêu thích
                if (this.isWishlistPage) {
                    this.paginateWishlistBooks();
                } else {
                    // Gọi fetchBooks để tải dữ liệu mới cho trang category thông thường
                    this.fetchBooks();
                }
            },
            applyFilters(newFilters) {
                this.filters = { ...newFilters };
                this.currentPage = 1; // Reset về trang đầu tiên khi áp dụng bộ lọc
                this.fetchBooks();
            },
            async fetchWishlistBooks() {
                this.loading = true;
                this.error = null;
                
                try {
                    // Sử dụng phương thức getWishlist() mới
                    const response = await WishlistService.getWishlist();
                    console.log('Wishlist response:', response.data);
                    
                    if (response.data && response.data.success && response.data.data) {
                        // Xử lý đúng cấu trúc dữ liệu API
                        const wishlistData = response.data.data.wishlist || response.data.data;
                        let products = [];
                        
                        // Lấy mảng products từ đúng đường dẫn
                        if (wishlistData && wishlistData.products && Array.isArray(wishlistData.products)) {
                            products = wishlistData.products;
                        }
                        
                        console.log('Số sản phẩm yêu thích tìm thấy:', products.length);
                        
                        // Chuyển đổi dữ liệu cho hiển thị
                        this.wishlistAllBooks = products.map(item => {
                            if (item.productId && typeof item.productId === 'object') {
                                // Xử lý hình ảnh sách
                                let image = item.productId.image;
                                if (typeof image === 'string' && image.startsWith('[') && image.endsWith(']')) {
                                    try {
                                        const images = JSON.parse(image.replace(/'/g, '"'));
                                        image = images[0];
                                    } catch (e) {
                                        console.error('Lỗi xử lý ảnh:', e);
                                    }
                                }
                                
                                // Trả về đối tượng book đã định dạng
                                return {
                                    _id: item.productId._id,
                                    id: item.productId._id,
                                    title: item.productId.title,
                                    author: item.productId.author,
                                    price: item.productId.price,
                                    image: image,
                                };
                            }
                            return null;
                        }).filter(book => book !== null);
                        
                        // Cập nhật thông tin phân trang
                        this.totalBooks = this.wishlistAllBooks.length;
                        this.totalPages = Math.ceil(this.totalBooks / this.wishlistBooksPerPage);
                        
                        // Thực hiện phân trang thủ công
                        this.paginateWishlistBooks();
                        
                        this.isWishlistPage = true;
                        
                    } else {
                        this.error = 'Không thể tải danh sách yêu thích';
                        this.books = [];
                    }
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                    this.error = 'Đã xảy ra lỗi khi tải danh sách yêu thích';
                    this.books = [];
                } finally {
                    this.loading = false;
                }
            },

            paginateWishlistBooks() {
                const startIndex = (this.currentPage - 1) * this.wishlistBooksPerPage;
                const endIndex = startIndex + this.wishlistBooksPerPage;
                
                // Lấy phần dữ liệu cần hiển thị cho trang hiện tại
                this.books = this.wishlistAllBooks.slice(startIndex, endIndex);
                
                console.log(`Phân trang wishlist: ${startIndex}-${endIndex} / ${this.wishlistAllBooks.length}`);
            },

            handleRemoveFromWishlist(bookId) {
                // Xóa sách từ danh sách hiển thị trên giao diện
                this.books = this.books.filter(book => (book.id || book._id) !== bookId);
                
                // Nếu đang hiển thị danh sách yêu thích, cập nhật lại wishlistAllBooks
                if (this.isWishlistPage) { 
                    this.wishlistAllBooks = this.wishlistAllBooks.filter(book => (book.id || book._id) !== bookId);
                    
                    // Cập nhật lại thông tin phân trang
                    this.totalBooks = this.wishlistAllBooks.length;
                    this.totalPages = Math.ceil(this.totalBooks / this.wishlistBooksPerPage);
                    
                    // Kiểm tra nếu trang hiện tại không còn sách thì quay lại trang trước
                    if (this.books.length === 0 && this.currentPage > 1) {
                        this.currentPage--;
                        this.paginateWishlistBooks();
                    }
                }
            }
        },
        created() {
            this.isWishlistPage = this.$route.query.wishlist === 'true';

            if (this.isWishlistPage) {
                this.fetchWishlistBooks();
            } else {
                if (this.$route.query.search) {
                    this.searchQuery = this.$route.query.search;
                }
                
                // Cài đặt category từ route nếu có
                if (this.$route.params.category) {
                    this.filters.categories = [this.$route.params.category];
                }
                this.fetchBooks();
            }
        },
        watch: {
            '$route.query.wishlist'(newVal) {
                if (newVal === 'true') {
                    this.isWishlistPage = true;
                    this.fetchWishlistBooks();
                } else {
                    this.isWishlistPage = false;
                    this.fetchBooks();
                }
            },
            '$route.query.search'(newValue) {
                this.searchQuery = newValue || '';
                this.currentPage = 1; // Reset về trang đầu khi tìm kiếm thay đổi
                this.fetchBooks();
            },
        
            '$route.params.category'(newValue) {
            if (newValue) {
                this.filters.categories = [newValue];
            } else {
                delete this.filters.categories;
            }
                this.currentPage = 1;
                this.fetchBooks();
            },
            
            sortOption() {
                this.currentPage = 1; // Reset về trang đầu tiên khi thay đổi sắp xếp
                this.fetchBooks();
            }
        }
    };
</script>
  
<style scoped>
.wishlist-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.wishlist-header .results-count {
    font-family: "Montserrat", sans-serif;
    font-size: 16px;
    color: #4d2900;
    font-weight: 600;
}
.empty-wishlist {
  text-align: center;
  padding: 40px;
  color: #4d2900;
  background-color: rgba(244, 235, 225, 0.5);
  border-radius: 8px;
  margin: 20px 0;
}

.empty-wishlist i {
  color: #724e4e;
  margin-bottom: 15px;
}

.empty-wishlist p {
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  margin-bottom: 20px;
}

.browse-books-btn {
  display: inline-block;
  background-color: #4d2900;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-books-btn:hover {
  background-color: #724e4e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
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