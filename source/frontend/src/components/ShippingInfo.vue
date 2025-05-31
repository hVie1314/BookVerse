<template>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap"
    />
    <section class="shipping-container">
      <h2 class="shipping-title">Vận chuyển</h2>
      <p class="shipping-description">
        Chúng tôi làm việc không kể ngày lễ và cuối tuần! Khách hàng có thể nhận
        được hàng trong ngày khi ở khu vực thành phố Hồ Chí Minh. Khách hàng ở các
        thành phố khác của Việt n có thể nhận được đơn hàng trong vòng 1-5 ngày
        tùy thuộc vào địa điểm và phương thức giao hàng đã chọn. Đơn hàng trên
        500000 đồng sẽ được giao miễn phí. Bạn có thể xem các phương thức có sẵn,
        các điều khoản và chi phí giao hàng khi thanh toán trong giỏ hàng sau khi
        chọn thành phố giao hàng.
      </p>
    </section>
  </template>
  
  <script>
  export default {
    name: "ShippingInfo",
  };
  </script>
  
<style scoped>
    .shipping-container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0 auto;
        padding: 62px 0;
        color: #4d2900;
        font-family: "Montserrat", sans-serif;
        text-align: center;
    }

    @media (max-width: 991px) {
        .shipping-container {
            max-width: 991px;
        }
    }

    @media (max-width: 640px) {
        .shipping-container {
            max-width: 640px;
        }
    }

    .shipping-title {
        font-size: 25px;
        font-weight: 900;
        line-height: 49px;
        margin-bottom: 20px;
    }

    @media (max-width: 991px) {
        .shipping-title {
            font-size: 22px;
        }
    }

    @media (max-width: 640px) {
        .shipping-title {
            font-size: 20px;
        }
    }

    .shipping-description {
        font-size: 15px;
        font-weight: 400;
        line-height: 29px;
        width: 88%;
    }

    @media (max-width: 991px) {
        .shipping-description {
            font-size: 14px;
        }
    }

    @media (max-width: 640px) {
        .shipping-description {
            font-size: 13px;
        }
    }
</style>
  