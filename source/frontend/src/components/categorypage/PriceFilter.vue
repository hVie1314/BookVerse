<template>
    <section class="filter-card">
      <h2 class="filter-title">Giá thành</h2>
      <div class="price-range">
        <label class="price-label">Từ</label>
        <input type="text" class="price-input" />
      </div>
      <div class="price-range">
        <label class="price-label">Đến</label>
        <input type="text" class="price-input" />
      </div>
    </section>
</template>
  
<script>
    export default {
        name: "PriceFilter",
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

    .price-range {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
    }

    .price-label {
        font-family: "Montserrat", sans-serif;
        font-size: 20px;
        color: #4d2900;
    }

    .price-input {
        width: 193px;
        height: 39px;
        border: 1px solid #828282;
        border-radius: 5px;
        background-color: #fff;
    }

    @media (max-width: 640px) {
        .filter-card {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>
  