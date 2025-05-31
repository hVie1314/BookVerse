<template>
  <header class="dashboard-header">
    <h2 class="dashboard-title">
      Biểu đồ doanh thu và số lượng đơn hàng theo thời gian
    </h2>
  </header>
</template>

<script>
export default {
  name: 'DashboardHeader'
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.dashboard-title {
  font-weight: normal;
  font-size: 22px;
  margin: 0;
  color: #4a3e3e;
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 18px;
  }
}
</style>