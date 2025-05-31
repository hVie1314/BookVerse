<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-content-header">
              <div class="footer-main-section">
                <div class="footer-wrapper">
                  <div class="footer-columns">
                    <div class="footer-column-wrapper">
                      <FooterLogo />
                    </div>
                    <div class="footer-column-wrapper">
                      <FooterColumn title="TÀI KHOẢN">
                        <div>
                         <router-link to="/login" class="footer-link">Đăng nhập/ Tạo mới tài khoản</router-link>
                        </div>
                        <div>
                          <router-link to="/profile" class="footer-link">Thay đổi địa chỉ khách hàng</router-link>
                        </div>
                        <div>
                           <router-link to="/my-orders" class="footer-link">Lịch sử mua hàng</router-link>
                        </div>
                      </FooterColumn>
                    </div>
                    <div class="footer-column-wrapper">
                      <FooterColumn title="DỊCH VỤ">
                        <div>
                          <router-link to="/category" class="footer-link">Mua bán trực tuyến</router-link>
                        </div>
                        <div>
                          <span class="text-white">Chính sách bảo mật thanh toán</span>
                        </div>
                        <div>
                          <span class="text-white">Hệ thống trung tâm nhà sách</span>
                        </div>
                      </FooterColumn>
                    </div>
                    <div class="footer-column-wrapper">
                      <FooterColumn title="HỖ TRỢ">
                        <div>
                          <span class="text-white">Chính sách đổi - trả - hoàn tiền</span>
                        </div>
                        <div>
                          <span class="text-white">Chính sách vận chuyển</span>
                        </div>
                        <div>
                          <span class="text-white">Chính sách bảo hành</span>
                        </div>
                      </FooterColumn>
                    </div>
                  </div>
                </div>
                
              </div>
              <section class="footer-contact-section">
                <FooterContact />
              </section>
            </div>
            <div class="footer-content-footer">
              <p class="policy-text">
                  Điều khoản sử dụng | Chính sách bảo mật
                </p>
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
    justify-content: center;
    background-color: rgba(57, 31, 0, 1);
  }
  
  .footer-container { 
    width: 90%; 
    display: flex;
    flex-direction: column;
    align-items: space-between;  
    box-sizing: border-box;
    padding: 50px;
    padding-bottom: 20px;
  }

  .footer-content-header{
    display: flex;
    justify-content: space-between;
  }
  
  .footer-main-section {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    line-height: normal;
    width: 70%;
    margin-left: 0;
  }
  
  .footer-wrapper {
    /* width: 100%; */
    display: flex;
    /* align-items: center; */
    font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;

  }
  
  .footer-columns {
    display: flex;
    align-items: center;
    /* justify-content: center; */
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
    font-size: 11px;
    font-weight: 400;
    line-height: 2;
    text-align: center;
    /* align-self: flex-end; */
    /* margin-top: 71px; */
    /* margin-right: 187px; */
  }

  .policy-text {
    text-align: center;
    color: white;
    margin-top: 20px;
  }
  
  .footer-contact-section {
    display: flex;
    flex-direction: column;
    width: 23%;
    /* margin-left: 20px; */
  }
  
  .text-white {
    color: rgb(255, 255, 255);
  }

  .footer-content-footer {
    margin-top: 50px;
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

  .footer-link {
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .footer-link:hover {
    color: #f0f0f0;
  }

  .footer-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: white;
    transition: width 0.3s ease;
  }

  .footer-link:hover::after {
    width: 100%;
  }

  .footer-link-inline {
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;
    cursor: pointer;
  }

  .footer-link-inline:hover {
    color: #f0f0f0;
    text-decoration: underline;
  }

  :deep(.text-white) {
    padding: 5px 0;
    transition: all 0.3s ease;
  }
  </style>
  