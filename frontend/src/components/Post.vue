<template>
  <div :class="$style.post">

    <!-- Setting button -->
    <div v-if="postUserId == loggedInUserId || userConnected.isAdmin == true" :class="$style.post__settings" class="dropright">
      <button class="btn-primary" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-h" title="ouvrir les paramètres"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a @click="postIsEditing = true" :class="$style.post__settings__edit" class="dropdown-item">Modifier</a>
        <a @click="deletePost" :class="$style.post__settings__delete" class="dropdown-item">Supprimer</a>
      </div>
    </div>

    <!-- User profile picture, fullname and post date -->
    <div :class="$style.post__user">
      <div :class="$style.post__user__picture" class="img-container-rounded">
        <img :src="postUser.profile_picture" :alt="'photo de profil de ' + [[ postUser.first_name ]] + ' ' + [[ postUser.last_name ]]" class="img-cover"/>
      </div>
      <div :class="$style.post__user__infos">
        <p :class="$style.post__user__infos__name">{{ postUser.first_name }} {{ postUser.last_name }}</p>
        <p :class="$style.post__user__infos__date">{{ date }}</p>
      </div>
    </div>

    <!-- Content, post picture and button when the post is not editing -->
    <p v-show="postIsEditing == false" :class="$style.post__content">{{ content }}</p>
    <img v-show="postIsEditing == false && postPicture !== null" :class="$style.post__picture" :src="postPicture" alt="image du post"/>
    <div v-show="postIsEditing == false" :class="$style.post__buttons">

      <!-- Like button when the post is not liked -->
      <button v-show="postIsLiked == false" @click="likePost" class="btn-primary like">
        <span v-show="likes.length > 0">{{ likes.length }} </span>
        <span v-show="likes.length == 0"> J'aime </span>
        <i class="fas fa-thumbs-up" title="pouce j'aime"></i>
      </button>
      <!-- Like button when the post is liked -->
      <button v-show="postIsLiked" @click="unlikePost" class="btn-secondary like">
        <span v-show="likes.length > 0">{{ likes.length }} </span>
        <span v-show="likes.length == 0"> J'aime </span>
        <i class="fas fa-thumbs-up" title="pouce j'aime"></i>
      </button>
      <button @click="showHideComments" class="btn-primary">
        <span>Commenter</span>
      </button>
      <button v-show="comments.length > 0" @click="showHideComments" :class="$style.post__comments__number">{{ comments.length }} commentaire<span v-show="comments.length > 1">s</span></button>
    </div>

    <!-- Comments area -->
    <div v-show="showComments && postIsEditing == false" :class="$style.post__comments">
      <div :class="$style.post__comments__area">
        <textarea :id="'commentInput' + [[ postId ]]" :class="$style.post__comments__input" placeholder="Commentez ici..." name="commentaire"></textarea>
        <button @click="commentPost" :class="$style.post__comments__valid" class="btn-secondary">
          <i class="fab fa-telegram-plane" title="envoyer"></i>
        </button>
      </div>
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :commentId="comment.id"
        :commentUserId="comment.user_id"
        :commentPostId="comment.post_id"
        :content="comment.content"
        :getAllCommentsOfAPost="getAllCommentsOfAPost"
        :loggedInUserId="loggedInUserId"
        :resetComments="resetComments"
      />
    </div>

    <!-- Content, post picture and button when the post is editing -->
    <input v-show="postIsEditing" :id="'editPostContent' + [[ postId ]]" :class="$style.post__content" :value="content"/>
    <div v-show="postIsEditing" :class="$style.post__buttons">
      <input :id="'editPostPicture' + [[ postId ]]" type="file" name="postPicture" accept="image/png, image/jpeg">
      <button @click="updatePost" class="btn-secondary">Valider</button>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Comment from "./Comment"
import { mapState } from "vuex"

export default {
  name: "Post",
  props: ["postId", "postUserId", "date", "content", "postPicture", "getHomePosts", "resetHomePosts", "getProfilePosts", "resetProfilePosts"],
  components: {
    Comment
  },
  data() {
    return {
      loggedInUserId: localStorage.getItem("userId"),
      postUser: "",
      likes: "",
      comments: [],
      postIsEditing: false,
      postIsLiked: false,
      showComments: false
    }
  },
  computed: {
    ...mapState(["userConnected"])
  },
  methods: {

/************************************************************* POSTS *************************************************************/

    /**
     * @description This function will call the API to update the post
     *
     * @return  {Function}  Passes the postIsEditing to false, resets the posts array and calls a function update the posts feed
     */
    updatePost() {
      const formData = new FormData()
      let postInfos = {
        content: document.getElementById(`editPostContent` + this.postId).value
      }
      formData.set("post", JSON.stringify(postInfos))
      if (document.getElementById(`editPostPicture` + this.postId).value !== "") {
        formData.set("image", document.getElementById(`editPostPicture` + this.postId).files[0])
      }

      axios({
        method: "put",
        url: `http://localhost:3000/api/posts/${this.postId}`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: formData
      })

      .then(() => {
        this.postIsEditing = false
        if (this.$route.name === "Home") {
          this.resetHomePosts()
          this.getHomePosts(0)
        } else if (this.$route.name === "MyProfile") {
          this.resetProfilePosts()
          this.getProfilePosts(0)
        }
      })

      .catch(error => { if (error.response) { console.log(error.response.data.error) }});
    },

    /**
     * @description This function will call the API to delete the post
     *
     * @return  {Function}  Resets the posts array and calls a function to update the posts feed
     */
    deletePost() {
      axios({
        method: "delete",
        url: `http://localhost:3000/api/posts/${this.postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      .then(() => {
        if (this.$route.name === "Home") {
          this.resetHomePosts()
          this.getHomePosts(0)
        } else if (this.$route.name === "MyProfile") {
          this.resetProfilePosts()
          this.getProfilePosts(0)
        }
      })
      
      .catch(error => { if (error.response) { console.log(error.response.data.error) }});
    },

/************************************************************* LIKES *************************************************************/

    /**
     * @description This function will call the API to get all likes of a post
     *
     * @return  {Object}   Contains all likes
     */
    getAllLikesOfAPost() {
      axios({
        method: "get",
        url: `http://localhost:3000/api/posts/${this.postId}/likes/all`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      .then(response => {
        this.likes = response.data
        for (let like in this.likes) {
          if (this.likes[like].user_id == this.loggedInUserId) {
            this.postIsLiked = true
          }
        }
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /**
     * @description This function will call the API to like the post (create a like)
     *
     * @return  {Function}  Passes postIdLiked to true and push a like in the likes array to display +1 like
     */
    likePost() {
      axios({
        method: "post",
        url: `http://localhost:3000/api/posts/${this.postId}/likes`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: {
          user_id: Number(this.loggedInUserId)
        }
      })

      .then(() => {
        this.postIsLiked = true
        this.likes.push(`like of ${this.loggedInUserId}`)
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /**
     * @description This function will call the API to unlike the post (delete the like)
     *
     * @return  {Function}  Passes postIdLiked to false and pop the like of the likes array to display -1 like
     */
    unlikePost() {
      axios({
        method: "delete",
        url: `http://localhost:3000/api/posts/${this.postId}/likes`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: {
          user_id: Number(this.loggedInUserId)
        }
      })

      .then(() => {
        this.postIsLiked = false
        this.likes.pop(`like of ${this.loggedInUserId}`)
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

/*********************************************************** COMMENTS ************************************************************/

    /**
     * @description This function will toggle the showComments to display or not comments section
     *
     * @return  {Boolean}  Return true if the showComments is false, or false if it's true
     */
    showHideComments() {
      if (this.showComments == false) {
        this.showComments = true
      } else if (this.showComments) {
        this.showComments = false
      }
    },

    /**
     * @description This function will call the API to get all comments of a post and display them
     *
     * @return  {Object}  Contain all comments
     */
    getAllCommentsOfAPost() {
      axios({
        method: "get",
        url: `http://localhost:3000/api/posts/${this.postId}/comments/all`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      .then(response => {
        for (let i in response.data) {
          this.comments.push(response.data[i])
        }
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /**
     * @description This function will reset the comments data
     *
     * @return  {String}  Empty this.comment
     */
    resetComments() {
      this.comments = []
    },

    /**
     * @description This function will call the API to comment a post (create a comment)
     *
     * @return  {Function}  Calls getAllCommentsOfAPost function to update comments feed
     */
    commentPost() {
      axios({
        method: "post",
        url: `http://localhost:3000/api/posts/${this.postId}/comments`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: {
          user_id: Number(this.loggedInUserId),
          content: document.getElementById(`commentInput` + this.postId).value
        }
      })
      .then(() => {
        this.resetComments()
        this.getAllCommentsOfAPost()
        document.getElementById(`commentInput` + this.postId).value = ""
      })
      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    }

  },

  /************** WHEN THE COMPONENT IS CREATED (BEFORE MOUNTED) ************** /
   * Calls the API to get the user information who created the post,
   * to get his profile picture and full name and stores them to postUser data
   * Then it calls function to display likes and comments
   */
  created() {
    axios({
      method: "get",
      url: `http://localhost:3000/api/users/${this.postUserId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })

    .then((response) => {
      this.postUser = response.data
      this.getAllLikesOfAPost()
      this.getAllCommentsOfAPost()
    })
    
    .catch(error => { if (error.response) { console.log(error.response.data.error) }});
  }
};
</script>

<style module lang="scss">
.post {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 4px;
  background-color: white;
  color: black;
  &__settings {
    position: absolute;
    top: 5px;
    right: 5px;
    &__edit, &__delete {
      cursor: pointer;
    }
  }
  &__user {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    &__picture {
      height: 50px;
      width: 50px;
      margin-right: 5px;
    }
    &__infos {
      & p {
        margin: 0;
      }
      &__name {
        font-size: 1rem;
        font-weight: bold;
      }
      &__date {
        font-size: 0.8rem;
      }
    }
  }
  &__content {
    width: 100%;
    margin: 5px auto;
    font-size: 1.2rem;
  }
  &__picture {
    height: auto;
    width: 60%;
    margin: 10px 0;
    border-radius: 4px;
  }
  &__buttons {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 10px;
    & button {
      margin: 5px;
    }
  }
  &__comments {
    width: 100%;
    margin-top: 30px;
    text-align: center;
    &__number {
      margin: 5px;
      border: none;
      font-weight: bold;
      color: $color-primary;
      background-color: white;
      &:focus {
        outline: none;
      }
    }
    &__area {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__input {
      width: 70%;
      margin-bottom: 10px;
    }
    &__valid {
      height: 30px;
      width: 30px;
      margin: 0 10px;
    }
  }
}
</style>