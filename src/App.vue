<template>
  <div id="app">
    <!-- div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">Register</router-link>
    </div-->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">SEO</a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          <router-link class="nav-item nav-link" to="/about">Register</router-link>
          <router-link class="nav-item nav-link" to="/inventory">Inventory</router-link>
        </div>
      </div>
    </nav>
    <router-view />
    <div class="footer-copyright text-center py-3">&copy; Sim</div>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
