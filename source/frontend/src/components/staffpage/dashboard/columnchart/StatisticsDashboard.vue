<template>
  <section class="frame-statistic">
    <div class="dashboard-grid-container">
      <div class="y-axis-area">
        <YAxisScale />
      </div>
      <div class="chart-header-area">
        <DashboardHeader />
        <hr class="divider" />
        <ChartLegend />
      </div>
      <div class="chart-area">
        <BarChart />
      </div>
    </div>
  </section>
</template>

<script>
import YAxisScale from './YAxisScale.vue';
import DashboardHeader from './DashboardHeader.vue';
import ChartLegend from './ChartLegend.vue';
import BarChart from './BarChart.vue';

export default {
  name: 'StatisticsDashboard',
  components: {
    YAxisScale,
    DashboardHeader,
    ChartLegend,
    BarChart
  }
};
</script>

<style scoped>
.frame-statistic {
  background-color: rgba(255, 255, 255, 1);
  border-color: rgba(168, 154, 154, 1);
  border-style: solid;
  border-width: 1px;
  padding: 38px 30px 70px 20px;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}

.dashboard-grid-container {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    "y-axis chart-header"
    "y-axis chart";
  position: relative;
}

.y-axis-area {
  grid-area: y-axis;
  position: relative;
}

.chart-header-area {
  grid-area: chart-header;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.chart-area {
  grid-area: chart;
  position: relative;
}

.divider {
  border-color: rgba(113, 106, 106, 1);
  border-style: solid;
  border-width: 1px;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: 1px;
}

@media (max-width: 991px) {
  .frame-statistic {
    padding: 20px 15px 50px 15px;
  }
  
  .dashboard-grid-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "chart-header"
      "y-axis"
      "chart";
  }
}
</style>