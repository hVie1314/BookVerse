<template>
    <div class="book-grid">
      <BookCard 
        v-for="book in books" 
        :key="book._id"
        :image="book.image"
        :price="formatPrice(book.price)"
        :title="book.title"
        :author="book.author"
        :cartText="'Thêm vào giỏ hàng'"
        :sold="book.sold || 0"
        class="book-card-grid"
      />
    </div>
  </template>
  
<script>
    import BookCard from "@/components/bestsellers/BookCard.vue";

    export default {
        name: "BookGrid",
        components: {
            BookCard,
        },
        props: {
            books: {
            type: Array,
            required: true
            }
        },
        methods: {
            formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
            }
        }
    };
</script>
  
<style scoped>
    .book-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 30px;
    }

    .book-card-grid {
        width: 100%;
    }

    :deep(.book-card-grid .cart-button) {
        /* CSS tùy chỉnh cho cart-button trong grid */
        font-size: 8.5px; /* Tăng kích thước font */
    }

    @media (max-width: 1200px) {
        .book-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 991px) {
        .book-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .book-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 480px) {
        .book-grid {
            grid-template-columns: 1fr;
        }
    }
</style>