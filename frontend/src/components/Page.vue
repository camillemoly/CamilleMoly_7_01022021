<template>
  <button :class="$style.page__button" class="btn-secondary-whiteTxt" @click="getPostsOfThisPage">
    <router-link :to="'/?page='+ differentPage" :class="$style.page__link">{{ differentPage }}</router-link>
  </button>
</template>

<script>
export default {
  name: "Page",
  props: ["differentPage", "getPostsOfThisPage"]
}
</script>

<style module lang="scss">
.page {
  &__button {
    margin: 0 8px;
  }
  &__link {
    padding: 0 4px;
    color: white;
    &:hover{
      text-decoration: none;
      color: white;
    }
  }
}
</style>