<template>
    <div class="category-page">
        <Nav />
        <main class="category-content">
        <div class="category-container">
            <div class="page-header">
                <h1 class="page-title" :class="{ 'wishlist-title': $route.query.wishlist === 'true' }">
                {{ pageTitle }}
                </h1>
                <div v-if="$route.query.search" class="search-info">
                Kết quả tìm kiếm cho: <span class="search-term">"{{ $route.query.search }}"</span>
                </div>
            </div>
          
            <div class="category-layout" :class="{ 'wishlist-layout': $route.query.wishlist === 'true' }">
                <!-- Thêm v-if để ẩn filter sidebar khi ở chế độ wishlist -->
                <div class="filter-sidebar" v-if="$route.query.wishlist !== 'true'">
                    <CategoryFilter @filter-change="applyFilter" />
                <PriceFilter @price-filter-change="applyPriceFilter" />
                <RatingFilter @rating-filter-change="applyRatingFilter" />
                </div>
            
                <div class="products-container" :class="{ 'full-width': $route.query.wishlist === 'true' }">
                <BookCatalog ref="bookCatalog" />
                </div>
            </div>
        </div>
        </main>
        <Footer />
    </div>
</template>
  
<script>
    import Nav from '../navbar/Nav.vue';
    import Footer from '../footer/footer.vue';
    import CategoryFilter from './CategoryFilter.vue';
    import PriceFilter from './PriceFilter.vue';
    import RatingFilter from './RatingFilter.vue';
    import BookCatalog from './BookCatalog.vue';
  
    export default {
        name: 'CategoryPage',
        components: {
        Nav,
        Footer,
        CategoryFilter,
        PriceFilter,
        RatingFilter,
        BookCatalog
        },
        data() {
            return {
                filters: {}
            };
        },
        computed:{
            pageTitle() {
                if (this.$route.query.wishlist === 'true') {
                    return 'Danh sách yêu thích';
                } else if (this.$route.query.search) {
                    return 'Kết quả tìm kiếm';
                } else {
                    return 'Danh mục sản phẩm';
                }
            }
        },
        mounted() {
            if (this.$route.query.wishlist === 'true') {
                this.$refs.bookCatalog && this.$refs.bookCatalog.fetchWishlistBooks();
            }
        },
        watch: {
        '$route.query.wishlist'(newVal) {
                if (newVal === 'true' && this.$refs.bookCatalog) {
                    this.$refs.bookCatalog.fetchWishlistBooks();
                }
            }
        },
        methods: {
            applyFilter(filter) {
                this.filters = { ...this.filters, ...filter };
                this.$refs.bookCatalog.applyFilters(this.filters);
            },
            applyPriceFilter(priceFilter) {
                this.filters = { 
                    ...this.filters, 
                    minPrice: priceFilter.min, 
                    maxPrice: priceFilter.max 
                };
            this.$refs.bookCatalog.applyFilters(this.filters);
            },
            applyRatingFilter(ratingFilter) {
                if (ratingFilter.rating === null) {
                    delete this.filters.minRating;
                } else {
                    this.filters = { ...this.filters, minRating: ratingFilter.rating };
                }
            this.$refs.bookCatalog.applyFilters(this.filters);
            }
        }
    }
</script>

<style scoped>
    .wishlist-layout {
    /* Điều chỉnh layout khi ở chế độ wishlist */
    flex-direction: column;
}

.products-container.full-width {
    /* Chiếm toàn bộ chiều rộng khi không có filter sidebar */
    width: 100%;
    max-width: 100%;
}

/* Tùy chọn: Thêm style riêng cho tiêu đề trang wishlist */
.page-title.wishlist-title {
    color: #724e4e;
    border-bottom: 2px solid #4d2900;
    padding-bottom: 10px;
    margin-bottom: 20px;
}
    .category-page {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgb(244, 235, 225);
    }

    .category-content {
        width: 100%;
        flex: 1;
        padding: 30px 0;
        margin-top: 100px;
    }

    .category-container {
        width: 85%;
        margin: 0 auto;
        padding: 0 15px;
    }

    .page-header {
        margin-bottom: 30px;
    }

    .page-title {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 32px;
        color: #4d2900;
        margin-bottom: 10px;
    }

    .breadcrumb {
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #828282;
    }

    .breadcrumb a {
        color: #4d2900;
        text-decoration: none;
    }

    .category-layout {
        display: flex;
        gap: 30px;
    }

    .filter-sidebar {
        width: 280px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .products-container {
        flex: 1;
    }

    @media (max-width: 991px) {
        .category-layout {
            flex-direction: column;
        }

        .filter-sidebar {
            width: 100%;
        }
    }

    .search-info {
      font-family: "Montserrat", sans-serif;
      font-size: 14px;
      color: #666;
      margin-top: 10px;
    }
    
    .search-term {
      font-weight: 700;
      color: #4d2900;
    }

    
</style>