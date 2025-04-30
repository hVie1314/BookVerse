<template>
    <section class="contact-section">
        <h2 class="contact-title">LIÊN LẠC VỚI CHÚNG TÔI</h2>
        <div class="icon-contact-container">
            <i class="fa-brands fa-facebook icon-contact fa-2xl"></i>
            <i class="fa-regular fa-envelope icon-contact fa-2xl"></i>
            <i class="fa-solid fa-phone-rotary icon-contact fa-2xl"></i>
            <i class="fa-brands fa-instagram icon-contact fa-2xl"></i>
        </div>
    </section>
  </template>
  
<script>

export default {
    name: "ContactSection",
};
</script>

<style scoped>
    .contact-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        padding: 20px;
        width: 50%;
        margin-bottom: 40px;
    }

    .contact-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 24px;
        color: #4d2900;
        margin-bottom: 20px;
        font-weight: 900;
        width: 57%;
        text-align: center;
    }

    @media (max-width: 991px) {
        .contact-title {
            font-size: 20px;
        }
    }

    @media (max-width: 640px) {
        .contact-title {
            font-size: 18px;
        }
    }

    .icon-contact-container {
        margin-top: 30px;
        width: 57%;
        display: flex;
        justify-content: center;
        gap: 20px;
        font-size: 27px;
    }

    .icon-contact{
        color:#4d2900;
        
    }
</style>
  