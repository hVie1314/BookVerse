<template>
    <article class="stat-item">
      <h3 class="stat-value">{{ value }}</h3>
      <p class="stat-label">{{ label }}</p>
    </article>
  </template>
  
  <script>
  export default {
    name: "StatItem",
    props: {
      value: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
<style scoped>
    .stat-item {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .stat-value {
        font-family: "Montserrat", sans-serif;
        font-size: 50px;
        font-weight: 900;
        color: #4d2900;
        margin: 0;
    }

    .stat-label {
        font-family: "Montserrat", sans-serif;
        font-size: 13px;
        font-weight: 400;
        color: #4d2900;
        margin-top: 10px;
        margin-bottom: 0;
    }

    @media (max-width: 991px) {
        .stat-item {
            margin: 10px 0;
        }
    }

    @media (max-width: 640px) {
        .stat-value {
            font-size: 40px;
        }

        .stat-label {
            font-size: 12px;
        }
    }
</style>
  