<template>
    <div class="contact-container">
      <div class="phone-container">
        <div class="phone-label">Số điện thoại liên hệ</div>
        <div class="phone-number">&nbsp; &nbsp;+38 (071) 339-16-26</div>
      </div>
      <div class="address-container">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/aafea9a8f494688b2522dcf6523e70ba6931f7fc?placeholderIfAbsent=true&apiKey=2b78bbc514eb4a2797028d873c7b815d" alt="Location icon" class="location-icon" />
        <div class="address-text">
          <div class="address-title">Địa chỉ: </div>
          <div class="address-detail">Phường linh trung, thành phố thủ đức, Hồ Chí Minh</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FooterContact",
  };
  </script>
  
  <style scoped>
  .phone-container {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  
  .phone-label {
    border: 1px solid rgba(230, 140, 35, 1);
    padding: 6px 9px;
    font-size: 14px;
    color: rgba(230, 140, 35, 1);
    font-weight: 500;
  }
  
  .phone-number {
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    font-weight: 900;
    margin-top: 10px;
  }

  .address-container {
    margin-top: 15px;
    display: flex;
    color: #fff;
  }
  
  .location-icon {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 14px;
    align-self: flex-start;
    margin-top: 8px;
    margin-right: 5px;
    flex-shrink: 0;
  }
  
  .address-text {
    display: flex;
    margin-top: 5px;
    font-size: 13px;
  }
  
  .address-title {
    text-decoration: underline;
    font-weight: 600;
    margin-right: 5px;
  }

  @media (max-width: 991px) {
    .contact-container {
      margin-top: 40px;
    }
  
    .phone-number {
      margin-left: 9px;
    }
  }
  </style>
  