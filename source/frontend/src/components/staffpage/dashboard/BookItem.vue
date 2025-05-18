<template>
  <article class="book-item">
    <img :src="image" :alt="title + ' cover'" class="book-cover" />
    <div class="book-details">
      <h3 class="book-title">{{ title }}</h3>
      <p class="book-author">{{ author }}</p>
      <p class="book-price">{{ price }}</p>
    </div>
    <p class="book-sales">{{ sales }}</p>
  </article>
</template>

<script>
export default {
  name: 'BookItem',
  props: {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    sales: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.book-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.book-cover {
  width: 90px;
  height: 135px;
  border-radius: 8px;
  margin-right: 30px;
}

.book-details {
  flex: 1;
}

.book-title {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 35px;
  margin-bottom: 10px;
  font-weight: normal;
}

.book-author {
  color: #a58866;
  font-family: Montserrat, sans-serif;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 10px;
}

.book-price {
  color: #c8775b;
  font-family: Montserrat, sans-serif;
  font-size: 25px;
  font-weight: 700;
}

.book-sales {
  color: #3e3838;
  font-family: Montserrat, sans-serif;
  font-size: 25px;
}

@media (max-width: 640px) {
  .book-item {
    flex-direction: column;
    text-align: center;
  }

  .book-cover {
    margin: 0 0 20px 0;
  }

  .book-sales {
    margin-top: 10px;
  }
}
</style>
