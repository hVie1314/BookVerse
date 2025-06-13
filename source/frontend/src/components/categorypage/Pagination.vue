<template>
    <div class="pagination">
        <button 
            class="pagination-button" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            >
            <i class="fa-solid fa-chevron-left"></i>
        </button>
      
        <div class="page-numbers">
        <button 
            v-for="page in displayedPages" 
            :key="page"
            class="page-number"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
            >
            {{ page }}
        </button>
        </div>
      
        <button 
            class="pagination-button" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
            >
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    </div>
</template>
  
<script>
    export default {
        name: 'PaginationForm',
        props: {
            currentPage: {
            type: Number,
            required: true
            },
            totalPages: {
            type: Number,
            required: true
            }
        },
        computed: {
            displayedPages() {
            // Hiển thị tối đa 5 số trang
            if (this.totalPages <= 5) {
                return Array.from({ length: this.totalPages }, (_, i) => i + 1);
            }
            
            // Luôn hiển thị trang hiện tại và 2 trang trước/sau nếu có
            let startPage = Math.max(1, this.currentPage - 2);
            let endPage = Math.min(this.totalPages, startPage + 4);
            
            // Điều chỉnh startPage nếu endPage đã ở cuối
            if (endPage === this.totalPages) {
                startPage = Math.max(1, endPage - 4);
            }
            
            return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
            }
        },
        methods: {
            changePage(page) {
            if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
                this.$emit('page-change', page);
            }
            }
        }
    };
</script>
  
<style scoped>
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        margin-bottom: 20px;
    }

    .pagination-button {
        background: none;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 8px 12px;
        cursor: pointer;
        color: #4d2900;
        transition: all 0.3s ease;
    }

    .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .pagination-button:not(:disabled):hover {
        background-color: #f0f0f0;
        border-color: #4d2900;
    }

    .page-numbers {
        display: flex;
        margin: 0 10px;
    }

    .page-number {
        background: none;
        border: none;
        margin: 0 5px;
        padding: 8px 12px;
        cursor: pointer;
        border-radius: 5px;
        color: #333;
        transition: all 0.3s ease;
    }

    .page-number:hover {
        background-color: #f0f0f0;
        color: #4d2900;
    }

    .page-number.active {
        background-color: #4d2900;
        color: white;
    }
</style>