<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/">Trang chủ</router-link> |
        <router-link to="/login" v-if="!isLoggedIn">Đăng nhập</router-link>
        <router-link to="/register" v-if="!isLoggedIn">Đăng ký</router-link>
        <a href="#" @click.prevent="logout" v-if="isLoggedIn">Đăng xuất</a>
      </nav>
    </header>
    <router-view/>
  </div>
</template>

<script>
import AuthenticationService from './services/AuthenticationService'

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    this.isLoggedIn = AuthenticationService.isLoggedIn()
  },
  methods: {
    logout() {
      AuthenticationService.logout()
      this.isLoggedIn = false
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    }
  },
  watch: {
    $route() {
      // Cập nhật trạng thái đăng nhập khi chuyển trang
      this.isLoggedIn = AuthenticationService.isLoggedIn()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>