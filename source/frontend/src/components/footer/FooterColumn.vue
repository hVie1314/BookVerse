<template>
    <article class="footer-column">
      <header>
        <h2 class="column-title">
          <strong>{{ title }}</strong>
        </h2>
      </header>
      <div class="column-content">
        <slot></slot>
      </div>
    </article>
  </template>
  
  <script>
  export default {
    name: 'FooterColumn',
    props: {
      title: {
        type: String,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .footer-column {
    display: flex;
    flex-direction: column;
    gap: 0;
    align-items: start;
    width: 100%;
  }
  
  .column-title {
    font-size: 20px;
    color: rgb(255, 255, 255);
    /* margin-bottom: 1rem; */
  }
  
  .column-content {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 10px;
    font-size: 13px;
    color: #fff;
    font-weight: 400;
    /* line-height: 26px; */
  }
  
  @media (max-width: 991px) {
    .footer-column {
      margin-top: 20px;
    }
  }
  </style>
  