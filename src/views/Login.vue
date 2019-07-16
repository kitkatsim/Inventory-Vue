<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="create-post">
      <label for="create-post">Login</label>
      <br>
      <input v-model="username" placeholder="Username">
      <br>
      <input v-model="password" placeholder="Password">
      <br>
      <button v-on:click="login">Login</button>
    </div>
    <p class="err">{{something}}</p>
      <!-- HelloWorld msg="Welcome to Your Vue.js App"/ -->
  </div>
</template>

<script>
import ConsumeAPI from "../ConsumeAPI";

export default {
  name: "home",
  components: {},
  data() {
    return {
      username: "",
      password: "",
      something: ""
    };
  },
  methods: {
    async login() {
      var loginValidation = await ConsumeAPI.login(
        this.username,
        this.password
      );

      if (loginValidation) {
        this.$router.push({ path: `/user/${loginValidation[1]}` }) // -> /user/123
      } else {
        this.something = "username/password incorrect";
      }
    }
  }
};
</script>

<style scoped>
  p.err {
  color: red;
  padding: 10px;
  margin-bottom: 15px;
}
</style>

