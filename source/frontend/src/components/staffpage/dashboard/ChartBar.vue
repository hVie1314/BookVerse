<template>
  <div class="chart-bar">
    <div class="revenue-bar" :style="{ height: heightPercentage + '%' }">{{ revenue }}</div>
    <div class="orders-value">{{ orders }}</div>
    <div class="date-label">{{ date }}</div>
  </div>
</template>

<script>
export default {
  name: 'ChartBar',
  props: {
    revenue: {
      type: String,
      required: true
    },
    orders: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    heightPercentage: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
}

.revenue-bar {
  position: relative;
  top: -25px;
  left: 0;
  color: #b97f3c;
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  width: 100%;
  transition: height 0.3s;
  background-color: #b97f3c;
}

.orders-value {
  color: #000;
  font-family: Montserrat, sans-serif;
  font-size: 20px;
  margin: 10px 0;
}

.date-label {
  color: #100f0f;
  font-family: Montserrat, sans-serif;
  font-size: 25px;
}
</style>