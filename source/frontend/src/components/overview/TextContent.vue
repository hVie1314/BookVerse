<template>
  <article class="text-content">
    <h1 class="heading">Kho tàng sách lớn</h1>
    <p class="description">
      Trong cửa hàng của chúng tôi, bạn có thể tìm thấy cuốn sách phù hợp với
      mọi sở thích với giá tốt và thủ tục gọn gàng.
    </p>
    <button class="cta-button">DANH MỤC SẢN PHẨM</button>
  </article>
</template>
  
<script>
export default {
  name: "TextContent",
};
</script>
  
<style scoped>
.text-content {
  margin-top: auto;
  margin-bottom: auto;
  align-self: stretch;
  font-family:
    Montserrat,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  color: #4d2900;
  font-weight: 900;
  line-height: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

@media (max-width: 991px) {
  .text-content {
    margin-top: 40px;
  }
}

.heading {
  font-size: 50px;
}

.description {
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  max-width: 500px;
  margin-top: 8px;
  margin-right: 24px;
}

@media (max-width: 991px) {
  .description {
    margin-right: 10px;
  }
}

.cta-button {
  background-color: #4d2900;
  margin-top: 50px;
  width: 270px;
  max-width: 100%;
  padding: 14px 31px;
  font-size: 15px;
  color: rgba(255, 255, 255, 1);
  border: none;
  cursor: pointer;
  font-weight: 900;
  font-family: inherit;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

@media (max-width: 991px) {
  .cta-button {
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 40px;
  }
}

.cta-button:hover {
    background-color: #724e4e;
    transform: translateY(-3px);
}
</style>
  