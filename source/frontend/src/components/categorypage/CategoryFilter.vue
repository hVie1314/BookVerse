<template>
    <section class="filter-card">
      <h2 class="filter-title">Danh mục</h2>
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="category-item"
        :class="{ active: selectedCategory === category.name }"
        @click="selectCategory(category.name)"
      >
        <div class="checkbox">
          <i v-if="selectedCategory === category.name" class="fa-solid fa-check"></i>
        </div>
        <p class="category-name">{{ category.name }}</p>
        <span class="category-count">{{ category.count }}</span>
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
            selectedCategory: null
            };
    },
    methods: {
        async fetchCategories() {
        try {
            const response = await BookService.getCategories();
            if (response.data && response.data.success) {
            this.categories = response.data.data;
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
        },
        selectCategory(category) {
        this.selectedCategory = this.selectedCategory === category ? null : category;
        this.$emit('filter-change', { category: this.selectedCategory });
        }
    },
    created() {
        this.fetchCategories();
    }
};
</script>
  
<style scoped>
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