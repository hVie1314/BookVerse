<template>
    <article class="category-item" role="listitem" @click="$emit('click')">
      {{ text }}
    </article>
</template>
  
<script>
export default {
    name: "BookCategoryItem",
    props: {
        text: {
            type: String,
            required: true,
        },
    },
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

.category-item:hover {
    transform: translateY(-3px);
    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
    background-color: #f9f3ea;
}
</style>