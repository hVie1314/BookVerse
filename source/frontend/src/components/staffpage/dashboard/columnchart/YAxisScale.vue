<template>
  <aside class="y-axis-scale">
    <div class="y-axis-vertical-line"></div>
    <div class="y-scale-item">
      <span class="scale-label">30M</span>
      <div class="scale-line"></div>
    </div>
    <div class="y-scale-item scale-value">
      <span class="scale-label">25M</span>
      <div class="scale-line"></div>
    </div>
    <div class="y-scale-item scale-value-2">
      <span class="scale-label">20M</span>
      <div class="scale-line"></div>
    </div>
    <div class="y-scale-item scale-value-3">
      <span class="scale-label">15M</span>
      <div class="scale-line"></div>
    </div>
    <div class="y-scale-item scale-value-4">
      <span class="scale-label">10M</span>
      <div class="scale-line"></div>
    </div>
    <div class="y-scale-item scale-value-5">
      <span class="scale-label">5M</span>
      <div class="scale-line"></div>
    </div>
    <!-- Thêm mốc 0M -->
    <div class="y-scale-item scale-value-6">
      <span class="scale-label">0M</span>
      <div class="scale-line scale-line-origin"></div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'YAxisScale',
  data() {
    return {
      scaleValues: [
        { label: '30M', value: 30000000 },
        { label: '25M', value: 25000000 },
        { label: '20M', value: 20000000 },
        { label: '15M', value: 15000000 },
        { label: '10M', value: 10000000 },
        { label: '5M', value: 5000000 },
        { label: '0M', value: 0 }
      ]
    };
  }
};
</script>

<style scoped>
.y-axis-scale {
  display: flex;
  margin-top: 176px;
  flex-direction: column;
  align-items: stretch;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  color: rgba(131, 115, 115, 1);
  font-weight: 500;
  white-space: nowrap;
  min-width: 40px;
  position: relative;
  z-index: 1;
  padding-right: 10px;
}

/* Đường kẻ dọc */
.y-axis-vertical-line {
  position: absolute;
  top: -40px;
  bottom: 25px; /* Điều chỉnh để kéo dài đến mốc 0M */
  width: 1px;
  background-color: rgba(180, 180, 180, 1);
  right: 0;
  z-index: 2;
}

.y-scale-item {
  display: flex;
  align-items: center;
  position: relative;
}

.scale-label {
  position: relative;
  z-index: 2;
  background-color: white;
  padding-right: 5px;
}

.scale-line {
  position: absolute;
  height: 1px;
  background-color: rgba(230, 230, 230, 1);
  width: calc(100vw - 100px);
  left: 30px;
  z-index: 1;
}

/* Đường kẻ gốc tọa độ đậm hơn */
.scale-line-origin {
  background-color: rgba(0, 0, 0, 0.8);
  height: 2px;
}

.scale-value {
  margin-top: 27px;
}

.scale-value-2 {
  margin-top: 27px;
}

.scale-value-3 {
  margin-top: 39px;
}

.scale-value-4 {
  margin-top: 25px;
}

.scale-value-5 {
  margin-top: 46px;
}

.scale-value-6 {
  margin-top: 46px;
  position: relative;
}

.scale-line-origin {
  background-color: rgba(0, 0, 0, 0.8);
  height: 2px;
  z-index: 5; /* Tăng z-index để đảm bảo hiển thị đè lên các phần tử khác */
}

@media (max-width: 991px) {
  .y-axis-scale {
    margin-top: 40px;
    margin-bottom: 10px;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding-right: 0;
  }
  
  .y-axis-vertical-line {
    display: none;
  }
  
  .y-scale-item {
    flex-direction: column;
  }
  
  .scale-value, .scale-value-2, .scale-value-3, .scale-value-4, .scale-value-5, .scale-value-6 {
    margin-top: 0;
  }
  
  .scale-line {
    display: none;
  }
  
  .scale-label {
    padding-right: 0;
    font-size: 12px;
  }
}
</style>