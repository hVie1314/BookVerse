<template>
  <div class="chart-legend">
    <div class="legend-item">
      <span class="legend-indicator revenue-indicator"></span>
      <span class="legend-text">Tổng doanh thu</span>
    </div>
    <div class="legend-item-orders">
      <span class="legend-indicator orders-indicator"></span>
      <span class="legend-text">Tổng số lượng đơn hàng</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartLegend'
};
</script>

<style scoped>
.chart-legend {
  display: flex;
  margin-top: 20px;
  align-items: center;
  gap: 30px;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  color: rgba(131, 115, 115, 1);
  font-weight: 500;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-indicator {
  border-radius: 50%;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.revenue-indicator {
  background-color: rgba(185, 127, 60, 1);
}

.legend-text {
  flex-basis: auto;
}

.legend-item-orders {
  display: flex;
  align-items: center;
  gap: 10px;
}

.orders-indicator {
  background-color: rgba(0, 0, 0, 1);
}

@media (max-width: 768px) {
  .chart-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
