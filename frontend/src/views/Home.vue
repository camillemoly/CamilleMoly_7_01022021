<template>
  <div :class="$style.home">
    <Navigation/>
    <div :class="$style.home__container">
      <div :class="$style.publication">
        <div :class="$style.publication__user">
          <div :class="$style.publication__user__picture" class="img-container-rounded">
            <img :src="userConnected.profilePicture" alt="ma photo de profil" class="img-cover">
          </div>
          <textarea id="post_content" :class="$style.publication__user__input" :placeholder="'Bonjour ' + [[ userConnected.firstName ]] + ', que voulez-vous dire ?'" name="publication"></textarea>
        </div>
        <div :class="$style.publication__buttons">
          <input type="file" id="postPicture" name="postPicture" accept="image/png, image/jpeg, image/jpg, image/gif" :class="$style.publication__buttons__upload">
          <button class="btn-secondary" @click="createPost">Publier</button>
        </div>
      </div>
      <div :class="$style.posts">
        <Post
          v-for="post in homePosts"
          :key="post.id"
          :postId="post.id"
          :postUserId="post.user_id"
          :date="post.date"
          :content="post.content"
          :postPicture="post.post_picture"
          :getHomePosts="getHomePosts"
          :resetHomePosts="resetHomePosts"
          :homeCurrentPage="homeCurrentPage"
        />
      </div>
      <div v-if="homePosts.length" v-observe-visibility="handleScrolledToBottom"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Navigation from "../components/Navigation"
import Post from "../components/Post"
import { mapState, mapActions } from "vuex"

export default {
  name: "Home",
  components: {
    Navigation,
    Post
  },
  data(){
    return{
      homeCurrentPage: 0,
      homeTotalPages: 1,
      homePosts: []
    }
  },
  computed: {
    ...mapState(["userConnected"])
  },
  methods: {
    ...mapActions(["getUserInfos", "checkIfUserIsConnected"]),

    /**
     * @description This function will call the API to get all posts of the current page
     *
     * @return  {Object}  Object with posts, total posts, total pages and current page
     */
    getHomePosts(page){
      axios({
      method: "get",
      url: `http://localhost:3000/api/posts/all?page=${page}`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
      })
      .then(response => { 
        this.homePosts.push(...response.data.posts)
        this.homeTotalPages = response.data.totalPages
      })
      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /**
     * @description This function will increment the homeCurrentPage
     * and will call the getHomePosts to update the posts feed
     *
     * @param   {Boolean}  isVisible  If the div is visible (when homePosts.length)
     *
     * @return  {Function}            Can return increment of homeCurrentPage and update posts feed
     */
    handleScrolledToBottom(isVisible) {
      if (!isVisible) { return }
      if (this.homeCurrentPage >= (this.homeTotalPages - 1)) { return }
      this.homeCurrentPage++
      this.getHomePosts(this.homeCurrentPage)
    },

    /**
     * @description This function will empty the homePosts and set the homeCurrentPage to 0
     *
     * @return  {Function}  Empty the homePosts and set homeCurrentPage to 0
     */
    resetHomePosts() {
      this.homePosts = []
      this.homeCurrentPage = 0
    },

    /**
     * @description This function will call the API to create a new post 
     *
     * @return  {Function}  Function to reset the homePosts then update the posts feed
     */
    createPost(){
      const formData = new FormData()
      let postInfos = {
        user_id: localStorage.getItem("userId"),
        content: document.getElementById("post_content").value
      }
      formData.set("post", JSON.stringify(postInfos))
      if (document.getElementById("postPicture").value !== "") {
        formData.set("image", document.getElementById("postPicture").files[0])
      }

      axios({
        method: "post",
        url: `http://localhost:3000/api/posts`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: formData
      })

      .then(() => { 
        this.resetHomePosts()
        this.getHomePosts(0)
        document.getElementById("post_content").value = ""
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    }
  },

  /************** WHEN THE PAGE IS CREATED (BEFORE MOUNTED) ************** /
   * It checks if the user is connected and if not, redirects him to the login page
   * It calls the getUserInfos function to get the information of the connected user and store them in vuex states
   * It also calls the getPostsOfThisPage function to retrieve all the posts and displays them
   */
  created() {
    this.checkIfUserIsConnected()
    this.getUserInfos()
    this.getHomePosts(this.homeCurrentPage)
  }
}
</script>

<style module lang="scss">
.home__container{
  width: 100%;
  margin: auto;
  padding-bottom: 20px;
}
.publication{
  width: 100%;
  max-width: 450px;
  margin: auto;
  padding: 20px 10px;
  border-radius: 4px;
  background-color: white;
  &__user{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 10px;
    &__picture{
      height: 80px;
      width: 80px;
    }
    &__input{
      min-height: 60px;
      width: 60%;
      border-radius: 4px;
      outline: none;
    }
  }
  &__buttons{
    display: flex;
    justify-content: center;
    &__upload{
      outline: none;
      color: black;
    }
  }
}
.posts{
  width: 100%;
  margin: 10px auto;
}

@media (min-width: 480px) {
  .home__container{
    width: 60%;
  }
}

@media (min-width: 1024px) {
  .home__container{
    width: 40%;
  }
}
</style>