<template>
  <div class="user-table">
    <div class="table-header">
      <div class="header-name-column">
        <h2 class="column-title">Thông tin người dùng</h2>
      </div>
      <div class="header-role-column">
        <h2 class="column-title">Vai trò</h2>
      </div>
      <div class="header-date-column">
        <h2 class="column-title">Ngày tham gia</h2>
      </div>
      <div class="header-actions-column">
        <h2 class="column-title">Thao tác</h2>
      </div>
    </div>

    <UserItem
      v-for="user in users"
      :key="user.id"
      :user="user"
      @edit="$emit('edit-user', user)"
      @delete="$emit('delete-user', user)"
    />
  </div>
</template>

<script>
import UserItem from './UserItem.vue';

export default {
  name: 'UserTable',
  components: {
    UserItem
  },
  props: {
    users: {
      type: Array,
      default: () => []
    }
  },
  emits: ['edit-user', 'delete-user']
};
</script>

<style scoped>
.user-table {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  background-color: #4d2900;
  color: white;
  display: flex;
  padding: 16px 24px;
  align-items: center;
  font-size: 18px;
}

.header-name-column {
  flex: 3;
  padding-right: 10px;
}

.header-role-column {
  width: 120px;
  text-align: center;
}

.header-date-column {
  flex: 2;
  text-align: center;
}

.header-actions-column {
  width: 100px;
  text-align: center;
}

.column-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

@media (max-width: 991px) {
  .table-header {
    padding: 16px;
  }
  
  .column-title {
    font-size: 16px;
  }
  
  .header-date-column {
    display: none;
  }
  
  .header-role-column {
    width: 100px;
  }
  
  .header-actions-column {
    width: 80px;
  }
}

@media (max-width: 768px) {
  .header-role-column {
    width: 80px;
  }
  
  .header-actions-column {
    width: 70px;
  }
}
</style>