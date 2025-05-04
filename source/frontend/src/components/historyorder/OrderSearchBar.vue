<template>
    <section class="order-history-search">
      <div class="search-group">
        <img src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/4aa1ba0c641c654f3bebdb67ddd39e9ee7950d8f?placeholderIfAbsent=true" alt="Search icon" class="search-icon" />
        <input 
          type="text"
          class="search-input"
          placeholder="Bạn có thể tìm kiếm theo mã đơn hàng"
          v-model="searchQuery"
          @input="onSearch"
        />
      </div>
    </section>
</template>
  
<script>
    export default {
        name: 'OrderSearchBar',
        data() {
            return {
            searchQuery: ''
            }
        },
        methods: {
            onSearch() {
            this.$emit('search', this.searchQuery);
            }
        },
    }
</script>
  
<style scoped>
    .order-history-search {
        background-color: #e3dada;
        display: flex;
        margin-top: 15px; /* Giảm từ 31px */
        padding: 15px 25px; /* Giảm từ 22px 32px */
        flex-direction: column;
        overflow: visible;
        align-items: start;
        font-size: 16px; /* Giảm từ 22px */
        color: #7e7777;
    }

    .search-group {
        display: flex;
        align-items: center; /* Thay đổi từ stretch để căn giữa */
        gap: 20px; /* Giảm từ 40px 42px */
        justify-content: start;
        flex-wrap: nowrap; /* Thay đổi từ wrap thành nowrap */
        width: 100%;
    }

    .search-icon {
        width: 22px; /* Giảm từ 31px */
    }

    .search-placeholder {
        margin: auto 0;
    }

    /* Thêm CSS cho input */
    .search-input {
        flex: 1;
        background: transparent;
        border: none;
        font-size: 16px;
        color: #4d2900;
        outline: none;
        padding: 5px 0;
        font-family: inherit;
        min-width: 250px; /* Thêm chiều rộng tối thiểu */
        white-space: nowrap; /* Ngăn text xuống dòng */
        text-overflow: ellipsis; 
    }
    
    .search-input::placeholder {
        color: #7e7777;
    }

    @media (max-width: 991px) {
        .order-history-search {
            max-width: 100%;
            margin-right: 7px;
            padding: 22px 20px;
        }

        .search-placeholder {
            max-width: 100%;
        }
    }
</style>