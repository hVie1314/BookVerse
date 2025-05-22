<template>
    <section class="filter-card">
        <h2 class="filter-title">Đánh giá</h2>
        
        <div 
            v-for="rating in ratingOptions" 
            :key="rating.value"
            class="rating-item"
            :class="{ active: selectedRating === rating.value }"
            @click="selectRating(rating.value)"
        >
            <div class="checkbox">
                <i v-if="selectedRating === rating.value" class="fa-solid fa-check"></i>
            </div>
            
            <div class="star-display">
                <i v-for="index in 5" :key="index" 
                   :class="[
                       index <= rating.value ? 'fas fa-star filled-star' : 'far fa-star empty-star'
                   ]"
                ></i>
            </div>
            
            <p class="rating-text">{{ rating.label }}</p>
        </div>
        
    </section>
</template>
  
<script>
    export default {
        name: "RatingFilter",
        data() {
            return {
                selectedRating: null,
                ratingOptions: [
                    { value: 5, label: '5 Sao' },
                    { value: 4, label: '4 Sao trở lên' },
                    { value: 3, label: '3 Sao trở lên' },
                    { value: 2, label: '2 Sao trở lên' },
                    { value: 1, label: '1 Sao trở lên' }
                ]
            };
        },
        methods: {
            selectRating(rating) {
                // Nếu đã chọn rating này, hủy chọn (toggle)
                if (this.selectedRating === rating) {
                    this.selectedRating = null;
                    this.$emit('rating-filter-change', { rating: null });
                } else {
                    this.selectedRating = rating;
                    this.$emit('rating-filter-change', { rating: rating });
                }
            },
            clearFilter() {
                this.selectedRating = null;
                this.$emit('rating-filter-change', { rating: null });
            }
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
        text-transform: uppercase;
        margin-bottom: 10px;
    }

    .rating-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .rating-item:hover {
        background-color: rgba(77, 41, 0, 0.05);
    }

    .rating-item.active {
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

    .star-display {
        display: flex;
        gap: 2px;
        margin-right: 10px;
    }

    .filled-star {
        color: #FFD700; /* Màu vàng */
        font-size: 14px;
    }

    .empty-star {
        color: #D3D3D3; /* Màu xám nhạt */
        font-size: 14px;
    }

    .rating-text {
        font-family: "Montserrat", sans-serif;
        font-size: 14px;
        color: #333;
        margin: 0;
        flex-grow: 1;
    }

    .clear-filter {
        color: #4d2900;
        font-size: 14px;
        margin-top: 15px;
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
    }

    .clear-filter:hover {
        color: #7c4500;
    }

    @media (max-width: 640px) {
        .filter-card {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>
