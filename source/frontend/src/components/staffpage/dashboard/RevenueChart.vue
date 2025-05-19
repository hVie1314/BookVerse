<template>
  <section class="revenue-chart">
    <StatisticsDashboard />
  </section>
</template>

<script>
import StatisticsDashboard from './columnchart/StatisticsDashboard.vue';

export default {
  name: 'RevenueChart',
  components: {
    StatisticsDashboard
  }
};
</script>

<style scoped>
.revenue-chart {
  margin-top: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>