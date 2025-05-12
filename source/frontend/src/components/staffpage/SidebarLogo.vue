<template>
    <section class="logo-container">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/dc7748ff506aa449de5f700d7cbfd67bce8aa1fe?placeholderIfAbsent=true&apiKey=2b78bbc514eb4a2797028d873c7b815d"
        class="logo-image"
        alt="Bookverse Logo"
      />
      <h1 class="logo-text">BOOKVERSE</h1>
    </section>
  </template>
  
  <script>
  export default {
    name: 'Nav_Logo'
  }
  </script>
  
  <style scoped>
  .logo-container {
    display: flex;
    margin-left: 11px;
    min-height: 165px;
    flex-direction: column;
    align-items: center;
    font-size: 30px;
    color: #4d2900;
    white-space: nowrap;
    justify-content: end;
  }
  
  .logo-image {
    aspect-ratio: 1.37;
    object-fit: contain;
    object-position: center;
    width: 157px;
    fill: #4d2900;
    max-width: 100%;
  }
  
  .logo-text {
    color: #4d2900;
    margin-top: 15px;
    font-size: 30px;
    font-weight: 900;
  }
  </style>
  