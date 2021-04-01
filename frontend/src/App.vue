<template>
  <div id="app">
    <router-view/>
    <go-top style="height:60px;width:60px;border-radius:10%;background-color:#c71d78;"></go-top>
  </div>
</template>

<script>
import GoTop from "@inotom/vue-go-top"
export default {
  components: {
    GoTop
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  background-color: $color-primary;
  color: white;
}
</style>