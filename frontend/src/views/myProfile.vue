<template>
  <div :class="$style.profile">
    <Navigation/>
    <div :class="$style.profile__container">
      <div :class="$style.profile__picture" class="img-container-rounded">
        <img :src="userConnected.profilePicture" alt="ma photo de profil" class="img-cover">
      </div>
      <h1 :class="$style.profile__fullname">{{ fullName }}</h1>
      <div :class="$style.profile__about">
        <h2 :class="$style.profile__about__title">À propos</h2>
        <span :class="$style.profile__about__text">{{ userConnected.about }}</span>
      </div>
      <div :class="$style.profile__buttons">
        <router-link to="/profile/edit">
          <button type="button" class="btn-secondary">Modifier mon profil</button>
        </router-link>
        <button @click="signOut" class="btn-tertiary">Se déconnecter</button>
      </div>
      <h2 :class="$style.profile__posts__title">Derniers Posts</h2>
      <div :class="$style.profile__posts">
        <Post
          v-for="post in profilePosts"
          :key="post.id"
          :postId="post.id"
          :postUserId="post.user_id"
          :date="post.date"
          :content="post.content"
          :postPicture="post.post_picture"
          :getProfilePosts="getProfilePosts"
          :resetProfilePosts="resetProfilePosts"
          :profileCurrentPage="profileCurrentPage"
        />
      </div>
      <div v-if="profilePosts.length" v-observe-visibility="handleScrolledToBottom"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Navigation from "../components/Navigation"
import Post from "../components/Post"
import { mapState, mapGetters, mapActions } from "vuex"

export default {
  name: "MyProfile",
  components: {
    Navigation,
    Post
  },
  data() {
    return {
      profileCurrentPage: 0,
      profileTotalPages: 1,
      profilePosts: []
    }
  },
  computed: {
    ...mapGetters(["fullName"]),
    ...mapState(["userConnected"])
  },
  methods: {
    ...mapActions(["checkIfUserIsConnected", "getUserInfos", "signOut"]),

    /**
     * @description This function will call the API to get all posts of the user connected and of the current page
     *
     * @return  {Object}  Object with posts, total posts, total pages and current page
     */
    getProfilePosts(page) {
      axios({
        method: "get",
        url: `http://localhost:3000/api/posts/all?page=${page}&user_id=${localStorage.getItem("userId")}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      .then(response => { 
        this.profilePosts.push(...response.data.posts)
        this.profileTotalPages = response.data.totalPages
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /**
     * @description This function will increment the profileCurrentPage
     * and will call the getProfilePosts to update the posts feed
     *
     * @param   {Boolean}  isVisible  If the div is visible (when profilePosts.length)
     *
     * @return  {Function}            Can return increment of profileCurrentPage and update posts feed
     */
    handleScrolledToBottom(isVisible) {
      if (!isVisible) { return }
      if (this.profileCurrentPage >= (this.profileTotalPages - 1)) { return }
      this.profileCurrentPage++
      this.getProfilePosts(this.profileCurrentPage)
    },

    /**
     * @description This function will empty the profilePosts and set the profileCurrentPage to 0
     *
     * @return  {Function}  Empty the profilePosts and set profileCurrentPage to 0
     */
    resetProfilePosts() {
      this.profilePosts = []
      this.profileCurrentPage = 0
    }
  },

  /************** WHEN THE PAGE IS CREATED (BEFORE MOUNTED) ************** /
   * It checks if the user is connected and if not, redirects him to the login page
   * It gets the connected user's infos
   * It calls the getProfilePosts function to retrieve all the posts of the user and displays them
   */
  created() {
    this.checkIfUserIsConnected()
    this.getUserInfos()
    this.getProfilePosts(this.profileCurrentPage)
  }
}
</script>

<style module lang="scss">
.profile {
  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: auto;
    padding-bottom: 20px;
  }
  &__picture {
    height: 150px;
    width: 150px;
    margin: 10px 0;
  }
  &__fullname {
    font-size: 1.6rem;
  }
  &__about {
    width: 80%;
    max-width: 350px;
    margin: 5px 0;
    padding: 5px;
    border-radius: 4px;
    color: black;
    background-color: white;
    &__title {
      font-size: 1rem;
      font-weight: bold;
    }
  }
  &__buttons {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 80%;
    max-width: 350px;
    & button {
      margin-top: 5px;
    }
  }
  &__posts {
    width: 100%;
    &__title {
      width: 100%;
      margin-top: 20px;
      padding-left: 5px;
      text-align: left;
      font-size: 1rem;
    }
  }
}

@media (min-width: 480px) {
  .profile__container {
    width: 60%;
  }
}

@media (min-width: 1024px) {
  .profile__container {
    width: 40%;
  }
}
</style>