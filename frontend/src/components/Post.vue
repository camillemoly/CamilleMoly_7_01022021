<template>
  <div :class="$style.post">

    <!-- Setting button -->
    <div v-if="postUserId == userConnected || adminId == userConnected" :class="$style.post__settings" class="dropright">
      <button class="btn-primary-whiteTxt" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-h"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a @click="postIsEditing = true" class="dropdown-item" :class="$style.post__settings__edit">Modifier</a>
        <a @click="deletePost" class="dropdown-item" :class="$style.post__settings__delete">Supprimer</a>
      </div>
    </div>

    <!-- User profile picture, fullname and post date -->
    <div :class="$style.post__user">
      <div :class="$style.post__user__picture" class="img-container-rounded">
        <img :src="user.profile_picture" class="img-cover" />
      </div>
      <div :class="$style.post__user__infos">
        <p :class="$style.post__user__infos__name">
          {{ user.first_name }} {{ user.last_name }}
        </p>
        <p :class="$style.post__user__infos__date">{{ date }}</p>
      </div>
    </div>

    <!-- Content, post picture and button when the post is not editing -->
    <p v-show="postIsEditing == false" :class="$style.post__content">{{ content }}</p>
    <img v-show="postIsEditing == false && postPicture !== null" :class="$style.post__picture" :src="postPicture"/>
    <div v-show="postIsEditing == false" :class="$style.post__buttons">

      <!-- Like button when the post is not liked -->
      <button v-show="postIsLiked == false" class="btn-primary-whiteTxt like" @click="likePost">
        <span v-show="likes.length > 0">{{ likes.length }} </span>
        <span v-show="likes.length == 0"> J'aime </span>
        <i class="fas fa-thumbs-up"></i>
      </button>
      <!-- Like button when the post is liked -->
      <button v-show="postIsLiked" class="btn-secondary-whiteTxt like" @click="unlikePost">
        <span v-show="likes.length > 0">{{ likes.length }} </span>
        <span v-show="likes.length == 0"> J'aime </span>
        <i class="fas fa-thumbs-up"></i>
      </button>
      <button class="btn-primary-whiteTxt" @click="showHideComments">
        <span>Commenter</span>
      </button>
      <span v-show="comments.length > 0" @click="showHideComments" :class="$style.post__comments__number">{{ comments.length }} commentaire<span v-show="comments.length > 1">s</span></span>
    </div>

    <!-- Comments area -->
    <div v-show="showComments && postIsEditing == false" :class="$style.post__comments">
      <div :class="$style.post__comments__area">
        <textarea :id="'commentInput' + [[ postId ]]" :class="$style.post__comments__input" placeholder="Commentez ici..."></textarea>
        <button @click="commentPost" :class="$style.post__comments__valid" class="btn-secondary-whiteTxt">
          <i class="fab fa-telegram-plane"></i>
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
        :userConnected="userConnected"
      />
    </div>

    <!-- Content, post picture and button when the post is editing -->
    <input v-show="postIsEditing" :id="'editPostContent' + [[ postId ]]" :class="$style.post__content" :value="content"/>
    <div v-show="postIsEditing" :class="$style.post__buttons">
      <input type="file" :id="'editPostPicture' + [[ postId ]]" name="postPicture" accept="image/png, image/jpeg">
      <button class="btn-secondary-whiteTxt" @click="updatePost">Valider</button>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Comment from "./Comment"
import { mapState } from "vuex"

export default {
  name: "Post",
  props: ["postId", "postUserId", "date", "content", "postPicture", "getAllPosts", "getMyAllPosts"],
  components: {
    Comment
  },
  data() {
    return {
      user: "",
      likes: "",
      comments: "",
      userConnected: localStorage.getItem("userId"),
      postIsEditing: false,
      postIsLiked: false,
      showComments: false
    }
  },
  computed: {
    ...mapState(["adminId"])
  },
  methods: {

/************************************************************* POSTS *************************************************************/

    /********************* UPDATE POST ********************* /
     * This function creates formData object, with new content,
     * and check if the user adds a file and if so, adds it to the formData
     * Then it calls the API to update the post,
     * and calls function to update the post visually without reloading the page
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
        if (this.$route.name == 'Home') {
          this.getAllPosts()
        } else if (this.$route.name == 'MyProfile') {
          this.getMyAllPosts()
        }
      })

      .catch((error) => { if (error.response) { console.log(error.response.data.error) }});
    },

    /********************* DELETE POST ********************* /
     * The function calls the API to delete the post
     * Then it calls function to update visually the news feed without reloading the page
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
        if (this.$route.name == 'Home') {
          this.getAllPosts()
        } else if (this.$route.name == 'MyProfile') {
          this.getMyAllPosts()
        }
      })
      
      .catch((error) => { if (error.response) { console.log(error.response.data.error) }});
    },

/************************************************************* LIKES *************************************************************/

    /********************* GET ALL LIKES OF A POST ********************* /
     * This function calls the API to get all the likes of the function,
     * then it stores them to likes data
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
          if (this.likes[like].user_id == localStorage.getItem("userId")) {
            this.postIsLiked = true
          }
        }
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /********************* LIKE POST ********************* /
     * The function calls the API to create the like of the post,
     * then it passes the postIsLiked to TRUE and calls functions to update posts (getAllPost or getMyAllPost) and likes (checkIfUserLiked)
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
          user_id: Number(localStorage.getItem("userId"))
        }
      })

      .then(() => {
        this.postIsLiked = true
        this.likes.push(`like of ${localStorage.getItem("userId")}`)
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /********************* UNLIKE POST ********************* /
     * The function calls the API to delete the like of the post,
     * then it passes the postIsLiked to FALSE and calls functions to update posts (getAllPost or getMyAllPost) and likes (checkIfUserLiked)
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
          user_id: Number(localStorage.getItem("userId"))
        }
      })

      .then(() => {
        this.postIsLiked = false
        this.likes.pop(`like of ${localStorage.getItem("userId")}`)
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

/*********************************************************** COMMENTS ************************************************************/
    /********************* GET ALL COMMENTS OF A POST ********************* /
     * 
     */
    showHideComments() {
      if (this.showComments == false) {
        this.showComments = true
      } else if (this.showComments) {
        this.showComments = false
      }
    },

    /********************* GET ALL COMMENTS OF A POST ********************* /
     * 
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
        this.comments = response.data
      })

      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    },

    /********************* COMMENT POST ********************* /
     * 
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
          user_id: Number(localStorage.getItem("userId")),
          content: document.getElementById(`commentInput` + this.postId).value
        }
      })
      .then(() => { 
        this.getAllCommentsOfAPost()
        document.getElementById(`commentInput` + this.postId).value = ""
      })
      .catch(error => { if(error.response) { console.log(error.response.data.error) }});
    }

  },

  /************** WHEN THE COMPONENT IS CREATED (BEFORE MOUNTED) ************** /
   * It calls the API to get the user information who created the post,
   * to get his profile picture and full name, and stock them to user data
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
      this.user = response.data
      this.getAllLikesOfAPost()
      this.getAllCommentsOfAPost()
    })
    
    .catch((error) => { if (error.response) { console.log(error.response.data.error) }});
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
    & button{
      margin: 5px;
    }
  }
  &__comments {
    width: 100%;
    margin-top: 30px;
    text-align: center;
    &__number{
      margin: 5px;
      font-weight: bold;
      color: $color-primary;
      cursor: pointer;
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