<template>
  <button @click="getProfilePosts" class="btn-secondary pagination__button">
    <router-link :to="'/profile?page='+ differentPage" class="btn-secondary pagination__router-link">
      {{ differentPage }}
    </router-link>
  </button>
</template>

<script>
export default {
  name: "ProfilePagination",
  props: ["differentPage", "getProfilePosts"]
}
</script>