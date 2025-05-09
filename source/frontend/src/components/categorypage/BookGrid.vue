<template>
    <div class="book-grid">
        <BookCard
            v-for="book in books" 
            :key="book._id || book.id"
            :bookId="book._id || book.id"
            :title="book.title"
            :author="book.author || 'Chưa rõ tác giả'"
            :image="extractFirstImageUrl(book.image)"
            :price="formatPrice(book.price)"
            :originalPrice="book.originalPrice ? formatPrice(book.originalPrice) : ''"
            :sold="book.sold || 0"
            cartText="Thêm vào giỏ"
        />
    </div>
</template>
  
<script>
    import BookCard from "@/components/bestsellers/BookCard.vue";
    // import CartService from '@/services/CartService';

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

    /* BookCard sẽ tự động có kích thước bằng nhau vì grid-template-columns */
    .book-grid :deep(.book-card) {
        width: 100%;
        margin-bottom: 10px;
    }

    /* Media queries để responsive */
    @media (max-width: 1200px) {
        .book-grid {
            grid-template-columns: repeat(4, 1fr);
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
        
        .book-grid :deep(.book-card) {
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
        }
    }
</style>