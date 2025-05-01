<template>
    <section class="filter-card">
      <h2 class="filter-title">Danh mục</h2>

      <div v-if="loading" class="loading-message">
        <i class="fa-solid fa-spinner fa-spin"></i> Đang tải danh mục...
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <div v-else-if="categories.length === 0" class="empty-message">
        Không có danh mục nào
      </div>

      <!-- Categories list -->
      <div 
        v-else
        v-for="category in categories" 
        :key="category._id"
        class="category-item"
        :class="{ active: selectedCategories.includes(category.categoryName) }"
        @click="selectCategory(category.categoryName)"
      >
        <div class="checkbox">
          <i v-if="selectedCategories.includes(category.categoryName)" class="fa-solid fa-check"></i>
        </div>
        <p class="category-name">{{ category.categoryName }}</p>
      </div>
    </section>
  </template>
  
<script>
    import BookService from '@/services/BookService';

    export default {
        name: "CategoryFilter",
        data() {
            return {
                categories: [],
                selectedCategories: [],
                loading: true,
                error: null
            };
        },
        methods: {
            async fetchCategories() {
                this.loading = true;
                this.error = null;
                try {
                    const response = await BookService.getCategories();
                    console.log("Categories API response:", response); // Debug
                    
                    if (response.data && response.data.success) {
                        // Kiểm tra cấu trúc của response theo API thực tế
                        if (response.data.data && response.data.data.categories) {
                            // API trả về {success: true, data: {categories: [...]}}
                            this.categories = response.data.data.categories;
                        } else if (Array.isArray(response.data.data)) {
                            // API trả về {success: true, data: [...]}
                            this.categories = response.data.data;
                        } else {
                            this.error = "Định dạng dữ liệu không hợp lệ";
                            this.categories = [];
                        }
                    } else {
                        this.error = "Không thể tải danh mục sản phẩm";
                        this.categories = [];
                    }
                    
                    console.log("Categories after processing:", this.categories); // Debug
                    
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    this.error = "Đã xảy ra lỗi khi tải danh mục";
                    this.categories = [];
                } finally {
                    this.loading = false;
                }
            },
            selectCategory(category) {
                const index = this.selectedCategories.indexOf(category);
                if (index === -1) {
                    // Thêm vào nếu chưa được chọn
                    this.selectedCategories.push(category);
                } else {
                    // Xóa nếu đã được chọn
                    this.selectedCategories.splice(index, 1);
                }
                this.$emit('filter-change', { categories: this.selectedCategories });
            }
        },
        created() {
            this.fetchCategories();
        }
    };
</script>
  
<style scoped>

    /* Giữ nguyên CSS hiện tại, thêm styles cho trạng thái loading và error */
    .loading-message, .error-message, .empty-message {
        padding: 10px;
        text-align: center;
        font-family: "Montserrat", sans-serif;
        color: #666;
    }
    
    .error-message {
        color: #F44336;
    }

    .filter-card {
        background-color: #fff;
        border: 1px solid #828282;
        border-radius: 10px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        padding: 20px;
    }

    .filter-title {
        font-family: "Montserrat", sans-serif;
        font-weight: 700;
        font-size: 24px;
        color: #4d2900;
        margin-bottom: 15px;
    }

    .category-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .category-item:hover {
        background-color: rgba(77, 41, 0, 0.05);
    }

    .category-item.active {
        background-color: rgba(77, 41, 0, 0.1);
    }

    .checkbox {
        width: 18px;
        height: 18px;
        border: 1px solid #828282;
        border-radius: 3px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4d2900;
    }

    .category-name {
        flex: 1;
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        color: #333;
        margin: 0;
    }

    .category-count {
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #828282;
        min-width: 25px;
        text-align: right;
    }
</style>