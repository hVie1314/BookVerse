<template>
  <div class="chart-container">
    <div class="chart-content">
      <div class="chart-column-dates">
        <div class="dates-container">
          <!-- Biểu đồ cột -->
          <div class="chart-bars-container">
            <!-- Trục OX riêng biệt thay vì dùng border-bottom -->
            <div class="x-axis"></div>
            
            <div 
              v-for="(item, index) in chartData" 
              :key="index"
              class="chart-bar-item"
            >
              <div 
                class="bar-column-item"
                :style="{ height: calculateHeight(item.value) }"
              >
                <span class="dot-indicator-item"></span>
              </div>
              <!-- Giá trị hiển thị ở dưới trục OX -->
              <div class="bar-value-bottom">{{ formatValue(item.value) }}</div>
            </div>
          </div>
          
          <!-- Hàng hiển thị ngày -->
          <div class="dates-row">
            <span 
              v-for="(item, index) in chartData" 
              :key="'date-'+index" 
              class="date"
            >
              {{ item.date }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BarChart',
  data() {
    return {
      chartData: [
        { date: '15/01', value: 2900000, orders: 20 },
        { date: '16/01', value: 15000000, orders: 25 },
        { date: '17/01', value: 18000000, orders: 30 },
        { date: '18/01', value: 25000000, orders: 42 },
        { date: '19/01', value: 22000000, orders: 35 },
        { date: '20/01', value: 20000000, orders: 32 },
        { date: '21/01', value: 28000000, orders: 48 }
      ],
      maxValue: 30000000,
      yScaleHeight: 210 
    };
  },
  methods: {
    formatValue(value) {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toString();
    },
    calculateHeight(value) {
      const ratio = value / this.maxValue;
      return Math.max(5, ratio * this.yScaleHeight) + 'px';
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  overflow: hidden;
  margin-top: 200px;
}

.chart-content {
  display: flex;
}

.chart-column-dates {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  line-height: normal;
  width: 100%;
}

/* Styles cho biểu đồ cột */
.chart-bars-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 210px;
  margin-bottom: 0px;
  position: relative;
  border-bottom: none; /* Bỏ border-bottom cũ */
}

/* Trục OX độc lập để căn chỉnh với mốc 0M */
.x-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 4;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% / 7);
  position: relative;
}

.bar-column-item {
  background-color: rgba(185, 127, 60, 1);
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 5px;
  border-radius: 3px 3px 0 0;
  transition: height 0.5s ease;
  position: relative;
  z-index: 3;
  transform-origin: bottom;
  margin-bottom: 0; /* Đảm bảo cột nằm sát trục OX */
}

.dot-indicator-item {
  background-color: rgba(0, 0, 0, 1);
  border-radius: 50%;
  width: 8px;
  height: 8px;
  display: block;
}

/* Giá trị hiển thị ở dưới cột, dưới trục OX */
.bar-value-bottom {
  position: absolute;
  bottom: -35px;
  color: rgba(185, 127, 60, 1);
  font-size: 14px;
  font-weight: 500;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
}

.dates-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  color: rgba(16, 15, 15, 1);
  font-weight: 500;
}

.dates-row {
  display: flex;
  margin-top: 40px;
  width: 100%;
  justify-content: space-between;
  position: relative;
  z-index: 3;
  padding-top: 10px;
}

.date {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  width: calc(100% / 7);
}

/* Responsive */
@media (max-width: 991px) {
  .chart-bars-container {
    height: 180px;
  }

  .bar-column-item {
    width: 20px;
  }

  .dates-row {
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 35px;
  }
  
  .date {
    font-size: 12px;
  }
  
  .bar-value-bottom {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .chart-bars-container {
    height: 150px;
  }
  
  .bar-column-item {
    width: 15px;
  }
}
</style>