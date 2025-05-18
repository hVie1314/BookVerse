<template>
  <div class="search-filter-container">
    <div class="search-container">
      <i class="fas fa-search search-icon"></i>
      <input 
        type="text" 
        class="search-input" 
        placeholder="Tìm kiếm theo tên người dùng hoặc email..."
        v-model="searchQuery"
        @input="emitSearch"
      />
    </div>

    <div class="filter-container">
      <select class="filter-select" v-model="selectedFilter" @change="emitFilterChange">
        <option value="all">Tất cả</option>
        <option value="khách hàng">Khách hàng</option>
        <option value="nhân viên">Nhân viên</option>
        <option value="admin">Admin</option>
      </select>
      <i class="fas fa-filter filter-icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter',
  data() {
    return {
      searchQuery: '',
      selectedFilter: 'all'
    }
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchQuery);
    },
    emitFilterChange() {
      this.$emit('filter-change', this.selectedFilter);
    }
  }
}
</script>

<style scoped>
.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 24px;
  gap: 20px;
}

.search-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 1px solid rgba(175, 164, 164, 0.7);
  padding: 0 16px;
}

.search-icon {
  color: #897B7B;
  font-size: 18px;
  margin-right: 10px;
}

.search-input {
  border: none;
  padding: 12px 0;
  outline: none;
  width: 100%;
  font-size: 16px;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  color: #333;
}

.filter-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 1px solid rgba(175, 164, 164, 0.7);
  width: 200px;
}

.filter-select {
  appearance: none;
  background: transparent;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  font-family: Montserrat, -apple-system, Roboto, Helvetica, sans-serif;
  width: 100%;
  cursor: pointer;
  outline: none;
  color: #4d2900;
}

.filter-icon {
  position: absolute;
  right: 16px;
  color: #897B7B;
  pointer-events: none;
}

@media (max-width: 768px) {
  .search-filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-container {
    width: 100%;
  }
}
</style>