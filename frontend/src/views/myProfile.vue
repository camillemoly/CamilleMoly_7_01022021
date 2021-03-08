<template>
  <div :class="$style.profile">
    <Navigation></Navigation>
    <div :class="$style.profile__container">
      <div :class="$style.profile__picture" class="img-container-rounded">
        <img :src="user.profilePicture" class="img-cover">
      </div>
      <h1 :class="$style.profile__fullname">{{ fullName }}</h1>
      <div :class="$style.profile__about">
        <h2 :class="$style.profile__about__title">À propos</h2>
        <span :class="$style.profile__about__text">{{ user.about }}</span>
      </div>
      <div :class="$style.profile__buttons">
        <router-link to="/profile/edit">
          <button type="button" class="btn-secondary-whiteTxt">Modifier mon profil</button>
        </router-link>
        <button @click="signOut" class="btn-tertiary-whiteTxt">Se déconnecter</button>
      </div>
      <h2 :class="$style.profile__posts__title">Derniers Posts</h2>
      <div :class="$style.profile__posts">
        <Post
          v-for="post in posts"
          :key="post.id"
          :postId="post.id"
          :postUserId="post.user_id"
          :date="post.date"
          :content="post.content"
          :postPicture="post.post_picture"
          :getMyAllPosts="getMyAllPosts"
        />
      </div> 
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
  data(){
    return{
      posts: ""
    }
  },
  computed: {
    ...mapGetters(["fullName"]),
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["getUserInfos","resetInfo", "signOut"]),

    /*************** GET MY ALL POSTS *************** /
     * This function calls the API to get all posts of the connected user,
     * stores them in the posts data,
     * and displays them
     */
    getMyAllPosts(){
      axios({
      method: "get",
      url: `http://localhost:3000/api/posts/all/${localStorage.getItem("userId")}`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
      })
      .then(response => { 
        this.posts = response.data
      })
      .catch(error => { 
        if(error.response) {
          console.log(error.response.data.error)
        }
      });
    }
  },

  /************** WHEN THE PAGE IS CREATED (BEFORE MOUNTED) ************** /
   * It calls the getUserInfos function (stored in vuex actions)
   * to get the information (first name, last name, profile picture and about)
   * of the connected user and store them as vuex states
   * It also calls the getMyAllPosts function to retrieve all the posts and displays them
   */
  created() {
    this.getUserInfos()
    this.getMyAllPosts()
  }
}
</script>

<style module lang="scss">
.profile{
  &__container{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: auto;
    padding-bottom: 20px;
  }
  &__picture{
    height: 150px;
    width: 150px;
    margin: 10px 0;
  }
  &__fullname{
    font-size: 1.6rem;
  }
  &__about{
    width: 80%;
    max-width: 350px;
    margin: 5px 0;
    padding: 5px;
    border-radius: 4px;
    color: black;
    background-color: white;
    &__title{
      font-size: 1rem;
      font-weight: bold;
    }
  }
  &__buttons{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 80%;
    max-width: 350px;
    & button{
      margin-top: 5px;
    }
  }
  &__posts{
    width: 100%;
    &__title{
      width: 100%;
      margin-top: 20px;
      padding-left: 5px;
      text-align: left;
      font-size: 1rem;
    }
  }
}

@media (min-width: 480px) {
  .profile__container{
    width: 60%;
  }
}

@media (min-width: 1024px) {
  .profile__container{
    width: 40%;
  }
}
</style>