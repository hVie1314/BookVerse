<template>
    <div class="nav-item">
      <img
        :src="iconSrc"
        class="nav-item-icon"
        :alt="text + ' icon'"
      />
      <p class="nav-item-text">{{ text }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NavUserItem',
    props: {
      iconSrc: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      isLogout: {
        type: Boolean,
        default: false
      }
    }
  }
  </script>
  
  <style scoped>
  .nav-item {
    display: flex;
    align-items: stretch;
    gap: 36px;
  }
  
  .nav-item-icon {
    aspect-ratio: 1.02;
    object-fit: contain;
    object-position: center;
    width: 45px;
    flex-shrink: 0;
  }
  
  .nav-item-text {
    margin-top: auto;
    margin-bottom: auto;
    flex-basis: auto;
    font-size: 20px;
    color: rgba(137, 123, 123, 1);
    font-weight: 900;
    text-align: center;
  }
  
  /* Specific styling for logout item */
  .nav-item.logout .nav-item-text {
    align-self: start;
    margin-top: 14px;
  }
  
  .nav-item.logout .nav-item-icon {
    aspect-ratio: 1.07;
  }
  </style>
  