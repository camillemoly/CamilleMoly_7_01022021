<template>
  <div id="app">
    <!-- <div id="nav" v-if="['Home', 'About'].indexOf($route.name) > - 1"> PLACE NAVIAGTION HERE -->
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>