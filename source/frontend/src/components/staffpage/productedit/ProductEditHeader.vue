<template>
  <header class="product-header">
    <h1 class="title">{{ title }}</h1>
    <button class="close-button" @click="$emit('close')">
      <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#D4D2D2"></rect>
        <path d="M26.6673 13.3333L13.334 26.6666M13.334 13.3333L26.6673 26.6666" stroke="white" stroke-width="3.75" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </button>
  </header>
</template>

<script>
export default {
  name: 'ProductEditHeader',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  emits: ['close']
}
</script>

<style scoped>
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.title {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 30px;
  font-weight: 900;
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>