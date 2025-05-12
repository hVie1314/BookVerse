<template>
  <aside class="dashboard-navigation">
    <nav class="nav-item">
      <div class="nav-item-indicator"></div>
      <div class="nav-item-content">
        <div class="nav-item-icon">
          <svg
            width="39"
            height="35"
            viewBox="0 0 39 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.5 0L0 13.125V17.5H2.4375V32.8125H9.75V21.875H17.0625V32.8125H36.5625V17.5H39V13.125L34.125 9.84375V2.1875H26.8125V4.92188L19.5 0ZM21.9375 21.875H29.25V28.4375H21.9375V21.875Z"
              fill="#4D2900"
            ></path>
          </svg>
        </div>
        <h2 class="nav-item-title">Trang tổng quan</h2>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'OverviewButton'
}
</script>

<style scoped>
/* Từ file DashboardNavigation.vue */
.dashboard-navigation {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* Từ file DashboardNavItem.vue */
.nav-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  width: 370px;
  height: 51px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-item:hover {
  background-color: #f5f0e8;
}

.nav-item-indicator {
  width: 7px;
  height: 51px;
  background-color: #4d2900;
}

.nav-item-content {
  display: flex;
  align-items: center;
  padding-left: 26px;
  gap: 40px;
}

.nav-item-title {
  font-family: Montserrat;
  font-size: 20px;
  color: #4d2900;
  margin: 0;
  font-weight: normal;
}
</style>