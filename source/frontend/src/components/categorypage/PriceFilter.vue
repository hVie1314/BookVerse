<template>
    <section class="filter-card">
      <h2 class="filter-title">Giá thành</h2>
      
      <!-- Danh sách các mức giá với checkbox -->
      <div 
        v-for="(range, index) in priceRanges" 
        :key="index"
        class="price-item"
        :class="{ active: selectedRanges.includes(index) }"
        @click="selectPriceRange(index)"
      >
        <div class="checkbox">
          <i v-if="selectedRanges.includes(index)" class="fa-solid fa-check"></i>
        </div>
        <p class="price-range-text">{{ range.label }}</p>
      </div>
    </section>
</template>
    
<script>
    export default {
        name: "PriceFilter",
        data() {
            return {
            selectedRanges: [],
            priceRanges: [
                { 
                label: '0đ - 150,000đ', 
                min: 0, 
                max: 150000 
                },
                { 
                label: '150,000đ - 300,000đ', 
                min: 150000, 
                max: 300000 
                },
                { 
                label: '300,000đ - 500,000đ', 
                min: 300000, 
                max: 500000 
                },
                { 
                label: '500,000đ - 700,000đ', 
                min: 500000, 
                max: 700000 
                },
                { 
                label: '700,000đ - Trở lên', 
                min: 700000, 
                max: Number.MAX_SAFE_INTEGER 
                }
            ]
            };
        },
        methods: {
            selectPriceRange(index) {
            const rangeIndex = this.selectedRanges.indexOf(index);
            
            if (rangeIndex === -1) {
                // Thêm vào nếu chưa được chọn
                this.selectedRanges.push(index);
            } else {
                // Xóa nếu đã được chọn
                this.selectedRanges.splice(rangeIndex, 1);
            }
            
            // Tính toán giá min/max từ các khoảng đã chọn
            let minPrice = this.selectedRanges.length > 0 ? Number.MAX_SAFE_INTEGER : undefined;
            let maxPrice = this.selectedRanges.length > 0 ? 0 : undefined;
            
            this.selectedRanges.forEach(rangeIndex => {
                const range = this.priceRanges[rangeIndex];
                minPrice = Math.min(minPrice, range.min);
                maxPrice = Math.max(maxPrice, range.max);
                
                // Nếu khoảng giá cao nhất được chọn, maxPrice sẽ là undefined
                if (range.max === Number.MAX_SAFE_INTEGER) {
                maxPrice = undefined;
                }
            });
            
            // Emit event với các giá trị đã tính toán
            this.$emit('price-filter-change', { 
                selectedRanges: this.selectedRanges,
                min: minPrice, 
                max: maxPrice
            });
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
        margin-bottom: 15px;
    }

    .price-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .price-item:hover {
        background-color: rgba(77, 41, 0, 0.05);
    }

    .price-item.active {
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

    .price-range-text {
        flex: 1;
        font-family: "Montserrat", sans-serif;
        font-size: 16px;
        color: #333;
        margin: 0;
    }

    @media (max-width: 640px) {
        .filter-card {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>