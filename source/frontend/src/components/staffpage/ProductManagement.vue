<template>
  <div class="product-management">
    <h1 class="page-title">Quản lý sản phẩm</h1>
    
    <div class="toolbar">
      <button class="add-product-btn">
        <i class="fas fa-plus"></i> Thêm sản phẩm mới
      </button>
      <div class="search-container">
        <input type="text" placeholder="Tìm kiếm sản phẩm..." v-model="searchQuery" />
        <button class="search-btn">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
    
    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Tác giả</th>
            <th>Giá</th>
            <th>Kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td>BOOK{{ i }}</td>
            <td><img src="https://picsum.photos/50/70" alt="Book cover" /></td>
            <td>Sách mẫu {{ i }}</td>
            <td>Tác giả {{ i }}</td>
            <td>{{ (150000 + i * 10000).toLocaleString() }} đ</td>
            <td>{{ 10 + i * 5 }}</td>
            <td>
              <button class="action-btn edit"><i class="fas fa-edit"></i></button>
              <button class="action-btn delete"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button class="pagination-btn"><i class="fas fa-angle-left"></i></button>
      <span class="pagination-info">Trang 1 / 5</span>
      <button class="pagination-btn"><i class="fas fa-angle-right"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductManagement",
  data() {
    return {
      searchQuery: ""
    };
  }
};
</script>

<style scoped>
.product-management {
  padding: 30px;
  width: 100%;
}

.page-title {
  color: #4d2900;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-product-btn {
  background-color: #4d2900;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
}

.search-container {
  display: flex;
}

.search-container input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  width: 300px;
}

.search-btn {
  background-color: #4d2900;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.products-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: rgba(77, 41, 0, 0.1);
  font-weight: 700;
  color: #4d2900;
}

tr:hover {
  background-color: rgba(77, 41, 0, 0.05);
}

.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 10px;
  font-size: 16px;
}

.edit {
  color: #4d2900;
}

.delete {
  color: #e53935;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  align-items: center;
}

.pagination-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 8px 15px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
}

.pagination-info {
  margin: 0 15px;
}
</style>