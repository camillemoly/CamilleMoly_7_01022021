<template>
  <button @click="getHomePosts" class="btn-secondary pagination__button">
    <router-link :to="'/?page='+ differentPage" class="btn-secondary pagination__router-link">
      {{ differentPage }}
    </router-link>
  </button>
</template>

<script>
export default {
  name: "HomePagination",
  props: ["differentPage", "getHomePosts"]
}
</script>

<style lang="scss">
.pagination {
  &__button {
    margin: 0 8px;
    padding: 0;
  }
  &__router-link {
    padding: 0 8px;
    color: white;
    &:hover {
      text-decoration: none;
      color: white;
    }
  }
}
</style>