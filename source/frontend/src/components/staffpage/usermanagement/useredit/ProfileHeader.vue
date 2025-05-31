<template>
  <header class="profile-header">
    <img
      :src="profileImage"
      :alt="name + '\'s profile'"
      class="profile-image"
    />
    <p class="email-text">{{ email }}</p>
    <h1 class="name-text">{{ name }}</h1>
  </header>
</template>

<script>
export default {
  name: 'ProfileHeader',
  props: {
    profileImage: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.profile-header {
  padding: 40px 36px 20px;
  position: relative;
  background-color: #ececec;
}

.profile-image {
  width: 147px;
  height: 135px;
  border-radius: 50px;
  border: 5px solid #fff;
  object-fit: cover;
}

.email-text {
  color: #897b7b;
  font-family: Montserrat, sans-serif;
  font-size: 15px;
  text-decoration: underline;
  margin: 10px 0;
}

.name-text {
  color: #4d2900;
  font-family: Montserrat, sans-serif;
  font-size: 25px;
  font-weight: 900;
  margin: 0;
}
</style>
