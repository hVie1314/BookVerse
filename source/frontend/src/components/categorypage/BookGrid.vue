<template>
    <div class="book-grid">
        <div v-for="book in books" :key="book._id || book.id" class="book-card" :data-id="book._id || book.id">
    <router-link :to="'/product/' + (book._id || book.id)">
      <img 
        :src="extractFirstImageUrl(book.image)" 
        :alt="book.title"
        class="book-image"
        @error="handleImageError"
      />
      <div class="book-info">
        <h3 class="book-title">{{ book.title }}</h3>
        <p class="book-author">{{ book.author }}</p>
        <p class="book-price">{{ new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(book.price) }}</p>
      </div>
    </router-link>
    <button class="add-to-cart" @click="addToCart(book)">
      <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
    </button>
  </div>
    </div>
  </template>
  
<script>
    // import BookCard from "@/components/bestsellers/BookCard.vue";

    export default {
        name: "BookGrid",
        components: {
            // BookCard,
        },
        props: {
            books: {
            type: Array,
            required: true
            }
        },
        methods: {
            handleImageError(e) {
                const imgElement = e.target;
                const bookId = imgElement.closest('.book-card')?.getAttribute('data-id') || 'default';
                imgElement.src = `https://picsum.photos/seed/${bookId}/300/400`;
            },
            formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(price);
            },

            extractFirstImageUrl(imageString) {
        if (!imageString) {
            return 'https://picsum.photos/seed/noimage/300/400'; // Ảnh mặc định
        }
        
        try {
            if (typeof imageString === 'string' && 
                imageString.startsWith('[') && 
                imageString.endsWith(']')) {
                // Thay thế dấu nháy đơn bằng dấu nháy kép và parse JSON
                const imageArray = JSON.parse(imageString.replace(/'/g, '"'));
                if (imageArray && imageArray.length > 0) {
                    return imageArray[0];
                }
            }
            // Nếu không phải chuỗi mảng, trả về nguyên gốc
            return imageString;
        } catch (error) {
            console.error('Lỗi khi xử lý chuỗi hình ảnh:', error);
            return 'https://picsum.photos/seed/error/300/400'; // Ảnh dự phòng khi lỗi
        }
        },
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