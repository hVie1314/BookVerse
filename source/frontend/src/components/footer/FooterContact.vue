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
                <a href="https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+Khoa+h%E1%BB%8Dc+T%E1%BB%B1+nhi%C3%AAn,+%C4%90HQG-HCM,+C%C6%A1+s%E1%BB%9F+Linh+Trung./@10.8568212,106.7844932,13.92z/data=!4m10!1m2!2m1!1zVHLGsOG7nW5nIMSR4bqhaSBo4buNYyBraG9hIGjhu41jIHThu7Egbmhpw6pu!3m6!1s0x3174d8a1768e1d03:0x38d3ea53e0581ae0!8m2!3d10.8756461!4d106.7991699!15sCi1Ucsaw4budbmcgxJHhuqFpIGjhu41jIGtob2EgaOG7jWMgdOG7sSBuaGnDqm5aLyItdHLGsOG7nW5nIMSR4bqhaSBo4buNYyBraG9hIGjhu41jIHThu7Egbmhpw6pukgEKdW5pdmVyc2l0eZoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VSWE5YWmxhUzFSUlJBQqoBYgoKL20vMDJyMTI5chABMh8QASIbMrdyRH5_kZDBbztYQEootpZWrZZduD3s659DMjEQAiItdHLGsOG7nW5nIMSR4bqhaSBo4buNYyBraG9hIGjhu41jIHThu7Egbmhpw6pu4AEA-gEECAAQRA!16s%2Fg%2F1tj5hn2m?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D" 
                    target="_blank" 
                    class="address-link">
                    <div class="address-detail">Phường linh trung, thành phố thủ đức, Hồ Chí Minh</div>
                </a>
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
        align-items: flex-start;
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
    margin-top: 8px;
    font-size: 13px;
    gap: 5px;
  }
  
  .address-title {
    text-decoration: underline;
    width: 50%;
    font-weight: 600;
  }

  .address-detail {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
    color: white;
  }

  @media (max-width: 991px) {
    .contact-container {
      margin-top: 40px;
    }
  
    .phone-number {
      margin-left: 9px;
    }
  }

   /* Style cho link địa chỉ */
  .address-link {
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-left: -25px;
  }
  
  .address-link:hover {
    color: #f0f0f0;
  }
  
  .address-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: white;
    transition: width 0.3s ease;
  }
  
  .address-link:hover::after {
    width: 100%;
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
  