<template>
    <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-main-section">
              <div class="footer-wrapper">
                <div class="footer-columns">
                  <div class="footer-column-wrapper">
                    <FooterLogo />
                  </div>
                  <div class="footer-column-wrapper">
                    <FooterColumn title="Tài khoản">
                      <p>
                        <span class="text-white">Đăng nhập/ Tạo mới tài khoản</span>
                      </p>
                      <p>
                        <span class="text-white">Thay đổi địa chỉ khách hàng</span>
                      </p>
                      <p>
                        <span class="text-white">Lịch sử mua hàng</span>
                      </p>
                    </FooterColumn>
                  </div>
                  <div class="footer-column-wrapper">
                    <FooterColumn title="Dịch vụ">
                      <p>
                        <span class="text-white">Mua bán trực tuyến</span>
                      </p>
                      <p>
                        <span class="text-white">Chính sách bảo mật thanh toán</span>
                      </p>
                      <p>
                        <span class="text-white">Hệ thống trung tâm nhà sách</span>
                      </p>
                    </FooterColumn>
                  </div>
                  <div class="footer-column-wrapper">
                    <FooterColumn title="Hỗ trợ">
                      <p>
                        <span class="text-white">Chính sách đổi - trả - hoàn tiền</span>
                      </p>
                      <p>
                        <span class="text-white">Chính sách vận chuyển</span>
                      </p>
                      <p>
                        <span class="text-white">Chính sách bảo hành</span>
                      </p>
                    </FooterColumn>
                  </div>
                </div>
              </div>
              <p class="policy-text">
                Điều khoản sử dụng | Chính sách bảo mật
              </p>
            </div>
            <section class="footer-contact-section">
              <FooterContact />
            </section>
          </div>
        </div>
    </footer>
  </template>
  
  <script>
  import FooterColumn from './FooterColumn.vue';
  import FooterLogo from './FooterLogo.vue';
  import FooterContact from './FooterContact.vue';
  
  export default {
    name: 'Footer-form',
    components: {
      FooterColumn,
      FooterLogo,
      FooterContact
    }
  };
  </script>
  
  <style scoped>

  .footer{
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    background-color: rgba(57, 31, 0, 1);
  }
  
  .footer-container {
    width: 100%;
    display: flex;  
    padding: 20px;
  }
  
  .footer-content {
    gap: 20px;
    display: flex;
    justify-content: center;
  }
  
  .footer-main-section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    line-height: normal;
    width: 77%;
    margin-left: 0;
  }
  
  .footer-wrapper {
    width: 100%;
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;

  }
  
  .footer-columns {
    display: flex;
    gap: 50px;
    /* flex-direction: column; */
  }
  
  .footer-column-wrapper {
    display: flex;
    /* flex-direction: column; */
    justify-content: center;
    /* line-height: normal; */
    width: 25%;
    /* margin-left: 0; */
  }
  
  /* .footer-column-wrapper:not(:first-child) {
    margin-left: 20px;
  } */
  
  .policy-text {
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    font-weight: 400;
    line-height: 2;
    /* align-self: flex-end; */
    /* margin-top: 71px; */
    /* margin-right: 187px; */
  }
  
  .footer-contact-section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    line-height: normal;
    width: 23%;
    /* margin-left: 20px; */
  }
  
  .text-white {
    color: rgb(255, 255, 255);
  }
  
  @media (max-width: 991px) {
    .footer-background {
      max-width: 100%;
      padding: 47px 20px;
    }
  
    .footer-container {
      max-width: 100%;
    }
  
    .footer-content {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }
  
    .footer-main-section {
      width: 100%;
    }
  
    .footer-columns {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }
  
    .footer-column-wrapper {
      width: 100%;
      margin-left: 0 !important;
    }
  
    .footer-wrapper {
      max-width: 100%;
      margin-top: 40px;
    }
  
    .policy-text {
      margin-right: 10px;
      margin-top: 40px;
    }
  
    .footer-contact-section {
      width: 100%;
      margin-top: 40px;
    }
  }
  </style>
  