<template>
    <div class="category-item" @click="handleClick">
      <div class="category-content">
        <h2 class="category-text">{{ text }}</h2>
      </div>
    </div>
</template>
  
<script>
export default {
    name: "BookCategoryItem",
    props: {
        text: {
            type: String,
            required: true,
        },
        categoryId: {
            type: String,
            required: true
        }
    },
    methods: {
        handleClick() {
          this.$emit('category-selected', this.categoryId);
        }
    }
};
</script>

<style scoped>
.category-item {
    color: #4d2900;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    font-weight: 700;
    width: 100%;
    height: 76px;
    border-radius: 10px;
    box-shadow: 0px 4px 11px rgba(0, 0, 0, 0.25);
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease;
}

/* .category-item {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
} */

.category-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  background-color: antiquewhite;
}

.category-text {
  color: #4d2900;
  font-family: "Montserrat", sans-serif;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}
</style>