<template>
    <section class="filter-card">
        <h2 class="filter-title">Đánh giá</h2>
        <div class="rating-item">
            <div class="checkbox"></div>
            <div></div>
            <p class="rating-text">5 Star</p>
            <span class="rating-count">1345</span>
        </div>
        <div class="rating-item">
            <div class="checkbox"></div>
            <div></div>
            <p class="rating-text">4 Star &amp; up</p>
            <span class="rating-count">1345</span>
        </div>
        <div class="rating-item">
        <div class="checkbox"></div>
            <div></div>
            <p class="rating-text">3 Star &amp; up</p>
            <span class="rating-count">1345</span>
        </div>
        <div class="rating-item">
        <div class="checkbox"></div>
            <div></div>
            <p class="rating-text">2 Star &amp; up</p>
            <span class="rating-count">1345</span>
        </div>
        <div class="rating-item">
            <div class="checkbox"></div>
            <div></div>
         <p class="rating-text">1 Star &amp; up</p>
          <span class="rating-count">1345</span>
        </div>
    </section>
</template>
  
<script>
    export default {
    name: "RatingFilter",
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
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .checkbox {
        width: 18px;
        height: 18px;
        border: 1px solid #ced1d9;
        background-color: #fff;
    }

    .rating-text {
        font-family: "Inter", sans-serif;
        font-size: 14px;
        color: #4e5566;
        margin: 0;
        flex-grow: 1;
        margin-left: 10px;
    }

    .rating-count {
        font-family: "Inter", sans-serif;
        font-size: 12px;
        color: #828282;
    }

    @media (max-width: 640px) {
        .filter-card {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>
  