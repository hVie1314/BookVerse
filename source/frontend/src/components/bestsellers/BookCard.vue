<template>
    <article class="book-card">
        <img :src="image" :alt="title" class="book-image" />
        <div class="book-info">
            <div class="price-container">
                <p class="current-price">{{ price }}</p>
                <p v-if="originalPrice" class="original-price">{{ originalPrice }}</p>
            </div>
            <h3 class="book-title">{{ title }}</h3>
            <p class="book-author">{{ author }}</p>
            <div class="footer-card-container">
                <button class="cart-button">{{ cartText }}</button>
                <i class="fa-regular fa-heart fa-2xl"></i>
            </div>
            <p class="book-sold">Đã bán {{ sold }}</p>
        </div>
    </article>
</template>

<script>

export default {
    name: "BookCard",
    props: {
        image: {
        type: String,
        required: true,
        },
        price: {
        type: String,
        required: true,
        },
        originalPrice: {
        type: String,
        default: "",
        },
        title: {
        type: String,
        required: true,
        },
        author: {
        type: String,
        required: true,
        },
        cartText: {
        type: String,
        required: true,
        },
        sold: {
        type: String,
        default: "Đã bán 0",
        },
    },
};
</script>
  
<style scoped>
.book-card {
    width: 18%;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    position: relative;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.book-image {
    padding-top: 10px;
    width: 100%;
    height: 200px;
    object-fit: contain;
    border-radius: 8px 8px 0 0;
}

.book-info {
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.price-container {
    margin-top: 0;
}

.current-price {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 18px;
    color: #4d2900;
    text-align: right;
}

.original-price {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 15px;
    color: #d70000;
    text-decoration: line-through;
    margin-top: 5px;
}

.book-title {
    font-family: "Montserrat", sans-serif;
    font-weight: 700;
    font-size: 12px;
    color: #4d2900;
    margin-top: 10px;

    /* Thiết lập chiều cao cố định 3 dòng */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Đảm bảo luôn chiếm đúng 3 dòng */
    line-height: 1.3;
    height: 46.8px; /* = 1.3 * 12px * 3 dòng */
    min-height: 46.8px;
    max-height: 46.8px;
    margin-bottom: 0;
}

.book-author {
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #4d2900;
    margin-top: 5px;

    /* Thiết lập chiều cao cố định 2 dòng */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    
    /* Đảm bảo luôn chiếm đúng 2 dòng */
    line-height: 1.3;
    height: 31.2px; /* = 1.3 * 12px * 2 dòng */
    min-height: 31.2px;
    max-height: 31.2px;
    margin-bottom: 0;
}

.cart-button {
    color: #fff;
    font-family: "Montserrat", sans-serif;
    font-weight: 900;
    font-size: 12px;
    text-transform: uppercase;
    padding: 5px 10px;
    border-radius: 5px;
    box-shadow: 0px 5px 8px rgba(225, 106, 0, 0.19);
    
    background-color: #4d2900;
    border: none;
    cursor: pointer;
    width: 80%;
}

.heart-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
}

@media (max-width: 991px) {
    .book-card {
        width: calc(50% - 20px);
    }
}

@media (max-width: 640px) {
    .book-card {
        width: 100%;
        max-width: 300px;
    }
}

.footer-card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;   
}
</style>
  