<template>
  <div :class="$style.comment">

    <!-- Setting button -->
    <div v-if="commentUserId == userConnected.id || userConnected.isAdmin == true" :class="$style.comment__settings" class="dropright">
      <button class="btn-primary " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-h"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a @click="commentIsEditing = true" :class="$style.comment__settings__edit" class="dropdown-item">Modifier</a>
        <a @click="deleteComment" :class="$style.comment__settings__delete" class="dropdown-item">Supprimer</a>
      </div>
    </div>

    <!-- User profile picture, fullname -->
    <div :class="$style.comment__user">
      <div :class="$style.comment__user__picture" class="img-container-rounded">
        <img :src="commentUser.profile_picture" class="img-cover" />
      </div>
      <p :class="$style.comment__user__name">
        {{ commentUser.first_name }} {{ commentUser.last_name }}
      </p>
    </div>

    <!-- Content when the comment is not editing -->
    <p v-show="commentIsEditing == false" :class="$style.comment__content">{{ content }}</p>

    <!-- Content when the comment is editing -->
    <input v-show="commentIsEditing" :id="'editCommentContent' + [[ commentId ]]" :class="$style.comment__content__editInput" :value="content"/>
    <button v-show="commentIsEditing"  @click="updateComment" :class="$style.comment__content__editButton" class="btn-secondary">Valider</button>

  </div>
</template>

<script>
import axios from "axios"
import { mapState } from "vuex"

export default {
  name: "Comment",
  props: ["commentId", "commentUserId", "commentPostId", "content", "getAllCommentsOfAPost"],
  data() {
    return {
      commentUser: "",
      commentIsEditing: false
    }
  },
  computed: {
    ...mapState(["userConnected"])
  },
  methods: {

    /******************** UPDATE COMMENT ******************** /
     * Calls the API to modify the comment with the new value of editCommentContent input
     * then passes commentIsEditing to false to display <p> instead of <input>
     * and calls getAllCommentsOfAPost() to update comments feed without reloading
     */
    updateComment() {
      axios({
        method: "put",
        url: `http://localhost:3000/api/posts/${this.commentPostId}/comments/${this.commentId}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: {
          content: document.getElementById(`editCommentContent` + this.commentId).value
        }
      })

      .then(() => {
        this.commentIsEditing = false
        this.getAllCommentsOfAPost()
      })

      .catch(error => { if (error.response) { console.log(error.response.data.error) }});

    },

    /******************** DELETE COMMENT ******************** /
     * Calls the API to delete the comment
     * then calls getAllCommentsOfAPost() to update comments feed without reloading
     */
    deleteComment() {
      axios({
        method: "delete",
        url: `http://localhost:3000/api/posts/${this.commentPostId}/comments/${this.commentId}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      .then(() => {
        this.getAllCommentsOfAPost()
      })

      .catch(error => { if (error.response) { console.log(error.response.data.error) }});
    }
  },

  /************** WHEN THE COMPONENT IS CREATED (BEFORE MOUNTED) ************** /
   * Calls the API to get the user information who created the comment
   * to get his profile picture and full name, and stores them to user data
   */
  created() {
    axios({
      method: "get",
      url: `http://localhost:3000/api/users/${this.commentUserId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })

    .then((response) => {
      this.commentUser = response.data
    })
    
    .catch(error => { if (error.response) { console.log(error.response.data.error) }});
  }
}
</script>

<style module lang="scss">
.comment {
  position: relative;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 4px;
  background-color: rgb(221, 221, 221);
  &__settings {
    position: absolute;
    top: 5px;
    right: 5px;
    &__edit, &__delete{
      cursor: pointer;
    }
  }
  &__user {
    display: flex;
    align-items: center;
    &__picture {
      height: 30px;
      width: 30px;
      margin-right: 5px;
    }
    &__name {
      margin: 0;
      font-size: 0.9rem;
      font-weight: bold;
    }
  }
  &__content {
    margin: 5px;
    text-align: left!important;
    &__editInput {
      width: 80%;
      margin: 5px;
    }
  }
}
</style>