<template>
    <div class="contact-container">
      <div class="phone-label">Số điện thoại liên hệ</div>
      <div class="phone-number">&nbsp; &nbsp;+38 (071) 339-16-26</div>
      <div class="address-container">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/aafea9a8f494688b2522dcf6523e70ba6931f7fc?placeholderIfAbsent=true&apiKey=2b78bbc514eb4a2797028d873c7b815d" alt="Location icon" class="location-icon" />
        <address class="address-text">
          <a
            href="https://www.google.com/search?sca_esv=9b97cf5dfe314dde&sxsrf=AHTn8zqmxSwE_FbfMFC_KLzTSt_PNpSfJw:1744387777487&q=tr%C6%B0%E1%BB%9Dng+%C4%91%E1%BA%A1i+h%E1%BB%8Dc+khoa+h%E1%BB%8Dc+t%E1%BB%B1+nhi%C3%AAn,+c%C6%A1+s%E1%BB%9F+linh+trung+%C4%91%E1%BB%8Ba+ch%E1%BB%89&ludocid=4094874132176968416&sa=X&ved=2ahUKEwi4nc_urtCMAxWNS2wGHe15OngQ6BN6BAghEAI"
            class="address-link"
            target="_blank"
            >Địa chỉ</a
          >: Phường Linh Trung, Thành Phố Thủ Đức, Hồ Chí Minh
        </address>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FooterContact",
  };
  </script>
  
  <style scoped>
  .contact-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    font-family:
      Montserrat,
      -apple-system,
      Roboto,
      Helvetica,
      sans-serif;
    line-height: 2;
    margin-right: 32px;
    padding-left: 24px;
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
    align-self: stretch;
    display: flex;
    margin-top: 19px;
    align-items: stretch;
    gap: 7px;
    font-size: 13px;
    color: #fff;
    font-weight: 400;
    line-height: 26px;
  }
  
  .location-icon {
    aspect-ratio: 1;
    object-fit: contain;
    object-position: center;
    width: 14px;
    align-self: flex-start;
    margin-top: 8px;
    flex-shrink: 0;
  }
  
  .address-text {
    text-decoration-skip-ink: none;
    flex-grow: 1;
    flex-shrink: 1;
    width: 265px;
    flex-basis: auto;
    /* display: flex; */
    /* flex-wrap: wrap; */
    font-style: normal;
  }
  
  .address-link {
    font-weight: 700;
    text-decoration: underline;
    color: inherit;
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
  