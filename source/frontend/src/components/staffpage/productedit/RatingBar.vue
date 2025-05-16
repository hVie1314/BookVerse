<template>
  <div class="rating-bar">
    <span class="star-number">{{ stars }}</span>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressWidth }"></div>
    </div>
    <span class="count-number">{{ count }}</span>
  </div>
</template>

<script>
export default {
  name: 'RatingBar',
  props: {
    stars: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: true
    },
    maxCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    progressWidth() {
      if (this.maxCount === 0) return '0px';
      return `${(this.count / this.maxCount) * 100}%`;
    }
  }
}
</script>

<style scoped>
.rating-bar {
  display: flex;
  align-items: center;
  gap: 27px;
}

.star-number {
  color: #d9d9d9;
  font-family: Raleway, sans-serif;
  font-size: 20px;
  font-weight: 600;
  width: 10px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 18px;
  background-color: #f2f0ea;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #ffc727;
  border-radius: 5px;
}

.count-number {
  color: #2e2e2e;
  font-family: Raleway, sans-serif;
  font-size: 20px;
  font-weight: 700;
  width: 30px;
  text-align: right;
}
</style>
