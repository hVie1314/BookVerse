<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap"
  />
  <section class="categories-container">
    <h1 class="categories-title">THỂ LOẠI SÁCH HOT</h1>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <i class="fa-solid fa-spinner fa-spin"></i> Đang tải...
    </div>
    
    <!-- Error message -->
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    
    <!-- Categories grid -->
    <div v-else class="categories-grid" role="list" aria-label="Hot book categories">
      <BookCategoryItem 
        v-for="category in categories" 
        :key="category.id" 
        :text="category.categoryName" 
        @click="navigateToCategory(category.id)"
      />
    </div>
  </section>
</template>

<script>
import BookCategoryItem from "./TopCategoriesItem.vue";
import BookService from '@/services/BookService';

export default {
name: "TopCategories",
components: {
  BookCategoryItem,
},
data() {
  return {
    categories: [],
    loading: true,
    error: null,
  }
},
methods: {
  async fetchCategories() {
    this.loading = true;
    try {
      const response = await BookService.getCategories();
      console.log("Categories response:", response);
      
      // Xử lý response linh hoạt dựa trên cấu trúc có thể có
      if (response.data && response.data.success && response.data.data && response.data.data.categories) {
        // Nếu API trả về dạng { success: true, data: { categories: [...] } }
        this.categories = response.data.data.categories;
      } else if (response.data && response.data.categories) {
        // Nếu API trả về dạng { categories: [...] }
        this.categories = response.data.categories;
      } else if (Array.isArray(response.data)) {
        // Nếu API trả về trực tiếp mảng danh mục
        this.categories = response.data;
      } else {
        throw new Error("Định dạng dữ liệu không hợp lệ");
      }
      
      this.loading = false;
    } catch (error) {
      console.error("Error fetching categories:", error);
      this.error = "Không thể tải danh sách danh mục sách. Vui lòng thử lại sau.";
      this.loading = false;
    }
  },
  
  // Phương thức điều hướng đến trang danh sách sách theo danh mục
  navigateToCategory(categoryId) {
    this.$router.push({ 
      path: '/search',
      query: { category: categoryId }
    });
  }
},
mounted() {
  this.fetchCategories();
}
};
</script>

<style scoped>
.categories-container {
  max-width: 798px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.categories-title {
  color: #4d2900;
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Loading indicator và Error message */
.loading-container, .error-message {
  text-align: center;
  padding: 20px;
  width: 100%;
  font-family: "Montserrat", sans-serif;
}

.error-message {
  color: #ff3333;
}

@media (max-width: 991px) {
  .categories-container {
      max-width: 991px;
  }

  .categories-grid {
      grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .categories-container {
      max-width: 640px;
  }

  .categories-title {
      font-size: 20px;
  }

  .categories-grid {
      grid-template-columns: 1fr;
  }
}
</style>