<template>
  <section class="top-books">
    <h2 class="section-title">Top 10 sách bán chạy nhất</h2>
    <div class="books-list">
      <BookItem
        title="Đắc nhân tâm"
        author="Thanh duy"
        price="200.000 đ"
        sales="999 đã bán"
        image="https://cdn.builder.io/api/v1/image/assets/TEMP/d53ed5fea1666588f9febaeb6301cf051e941b49"
      />
      <BookItem
        title="Đắc nhân tâm"
        author="Thanh duy"
        price="200.000 đ"
        sales="999 đã bán"
        image="https://cdn.builder.io/api/v1/image/assets/TEMP/d53ed5fea1666588f9febaeb6301cf051e941b49"
      />
    </div>
  </section>
</template>

<script>
import BookItem from './BookItem.vue';

export default {
  name: 'TopBooks',
  components: {
    BookItem
  }
}
</script>

<style scoped>
.top-books {
  border: 1px solid #968a8a;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: #fff;
}

.section-title {
  color: #837373;
  font-family: Montserrat, sans-serif;
  font-size: 25px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #716a6a;
  font-weight: normal;
}

.books-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
