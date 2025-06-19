<template>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap"
    />
    <section class="about-us-container">
        <h2 class="about-us-title">Về chúng tôi</h2>
        <div class="stats-grid">
            <StatItem value="35" label="thể loại sách" />
            <StatItem value="1567" label="đầu sách" />
            <StatItem value="1000+" label="lượt mua" />
            <StatItem value="200+" label="lượt ưa thích" />
        </div>
    </section>
</template>
  
<script>
    import StatItem from "./StatItem.vue";
  
    export default {
        name: "AboutUsStats",
        components: {
            StatItem,
        },
    };
</script>
  
<style scoped>
    .about-us-container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background-color: transparent;
        margin-top: 30px;
    }

    .about-us-title {
        font-family: "Montserrat", sans-serif;
        font-size: 25px;
        font-weight: 900;
        color: #4d2900;
        margin-bottom: 20px;
        margin-top: 0;
    }

    .stats-grid {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        width: 88%;
    }

    @media (max-width: 991px) {
        .about-us-container {
            max-width: 991px;
        }

        .stats-grid {
            flex-direction: column;
            align-items: center;
        }
    }

    @media (max-width: 640px) {
        .about-us-container {
            max-width: 640px;
        }

        .about-us-title {
            font-size: 20px;
        }
    }
</style>
  