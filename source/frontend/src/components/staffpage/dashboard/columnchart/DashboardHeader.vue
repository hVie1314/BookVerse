<template>
  <header class="dashboard-header">
    <h1 class="dashboard-title">
      Doanh thu và số lượng đơn hàng trong 7 ngày
    </h1>
    <div class="date-selector">
      <label class="date-label">Ngày bắt đầu</label>
      <div class="calendar-group">
        <span class="date-value">15/01/2025</span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/ff3206db0ce44bea881af38d023ef911/5855611df0e44a3d198ae7b33fb89378691b6b0e?placeholderIfAbsent=true"
          class="calendar-icon"
          alt="Calendar icon"
        />
      </div>
    </div>
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
  gap: 20px;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 20px;
  color: rgba(131, 115, 115, 1);
  font-weight: 500;
  flex-wrap: wrap;
  justify-content: space-between;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 600;
  color: #4d2900;
  margin: 0;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.date-label {
  flex-grow: 0;
}

.calendar-group {
  border-color: rgba(175, 163, 163, 1);
  border-style: solid;
  border-width: 1px;
  display: flex;
  padding: 8px 10px;
  border-radius: 6px;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
  background-color: #F8F4EE;
}

.date-value {
  margin: 0;
}

.calendar-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-selector {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
