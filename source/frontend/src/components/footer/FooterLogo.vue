<template>
    <div class="logo-container">
        <div class="logo-wrapper">
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/33ea89c422e69b6c12874c11a14cb6c84e6b1d65?placeholderIfAbsent=true&apiKey=2b78bbc514eb4a2797028d873c7b815d" alt="Bookverse Logo" class="logo-image" />
            <h1 class="brand-name">BOOKVERSE</h1>
        </div>
        <div class="logo-content"></div>
    </div>
</template>
  
<script>
    export default {
        name: "FooterLogo",
    };
</script>
  
<style scoped>
    .logo-container {
        display: flex;
        width: 100%;
        align-items: center;
        box-sizing: border-box;
        gap: 40px 50px;
        flex-wrap: wrap;
    }
  
    .logo-wrapper {
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        align-items: stretch;
        gap: 5px;
        font-size: 28px;
        color: rgba(255, 255, 255, 1);
        font-weight: 900;
        white-space: nowrap;
    }
  
    .logo-image {
        aspect-ratio: 1;
        object-fit: contain;
        object-position: center;
        width: 42px;
        flex-shrink: 0;
    }
  
    .brand-name {
        margin-top: auto;
        margin-bottom: auto;
        flex-basis: auto;
        font-size: 20px;
    }
  
    .logo-content {
        display: flex;
        align-items: stretch;
        gap: 40px 46px;
        font-size: 13px;
        color: #fff;
        font-weight: 400;
        line-height: 26px;
        flex-wrap: wrap;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: auto;
    }
  
    @media (max-width: 991px) {
        .logo-wrapper {
            white-space: initial;
        }
  
        .logo-container {
            max-width: 100%;
        }
    }
</style>
  