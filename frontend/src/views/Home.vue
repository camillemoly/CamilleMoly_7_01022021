<template>
  <div :class="$style.home">
    <Navigation/>
    <div :class="$style.home__container">
      <div :class="$style.publication">
        <div :class="$style.publication__user">
          <div :class="$style.publication__user__picture" class="img-container-rounded">
            <img :src="user.profilePicture" class="img-cover">
          </div>
          <textarea id="post_content" :class="$style.publication__user__input" :placeholder="'Bonjour ' + [[ user.firstName ]] + ', que voulez-vous dire ?'"></textarea>
        </div>
        <div :class="$style.publication__buttons">
          <input type="file" id="postPicture" name="postPicture" accept="image/png, image/jpeg" :class="$style.publication__buttons__upload">
          <button class="btn-secondary-whiteTxt" @click="createPost">Publier</button>
        </div>
      </div>
      <div :class="$style.posts">
        <Post
          v-for="post in posts"
          :key="post.id"
          :postId="post.id"
          :postUserId="post.user_id"
          :date="post.date"
          :content="post.content"
          :postPicture="post.post_picture"
          :getAllPosts="getAllPosts"
        />
      </div>
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
      posts: ""
    }
  },
  computed: {
    ...mapState(["user"])
  },
  methods: {
    ...mapActions(["getUserInfos", "resetInfo"]),

    /*************** GET ALL POSTS *************** /
     * This function calls the API to get all posts,
     * stores them in the posts data,
     * and displays them
     */
    getAllPosts(){
      axios({
      method: "get",
      url: `http://localhost:3000/api/posts/all`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
      })
      .then(response => { 
        this.posts = response.data
      })
      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /**************** CREATE POST **************** /
     * This function calls the API to create a post,
     * then it calls the getAllPosts function to update the news feed without reloading the page
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
      .then(response => { 
        console.log(response.data.message)
        this.getAllPosts()
        document.getElementById("post_content").value = ""
      })
      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    }
  },

  /************** WHEN THE PAGE IS CREATED (BEFORE MOUNTED) ************** /
   * It calls the getUserInfos function (stored in vuex actions)
   * to get the information (first name, last name, profile picture and about)
   * of the connected user and store them as vuex states
   * It also calls the getAllPosts function to retrieve all the posts and displays them
   */
  created() {
    this.getUserInfos()
    this.getAllPosts()
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
      border-radius: 5px;
      outline: none;
    }
  }
  &__buttons{
    display: flex;
    justify-content: space-around;
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