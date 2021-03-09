<template>
  <div :class="$style.comment">

    <!-- Setting button -->
    <div v-if="commentUserId == userConnected" :class="$style.comment__settings" class="dropright">
      <button class="btn-primary-whiteTxt " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-h"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a @click="editComment" class="dropdown-item" :class="$style.comment__settings__edit">Modifier</a>
        <a @click="deleteComment" class="dropdown-item" :class="$style.comment__settings__delete">Supprimer</a>
      </div>
    </div>

    <!-- User profile picture, fullname -->
    <div :class="$style.comment__user">
      <div :class="$style.comment__user__picture" class="img-container-rounded">
        <img :src="user.profile_picture" class="img-cover" />
      </div>
      <p :class="$style.comment__user__name">
        {{ user.first_name }} {{ user.last_name }}
      </p>
    </div>

    <!-- Content when the comment is not editing -->
    <p v-show="isEdit == false" :class="$style.comment__content">{{ content }}</p>

    <!-- Content when the post is editing -->
    <input v-show="isEdit" :id="'editContent' + [[ commentId ]]" :class="$style.comment__content__editInput" :value="content"/>
    <button v-show="isEdit" class="btn-secondary-whiteTxt" @click="updateComment">Valider</button>

  </div>
</template>

<script>
import axios from "axios"

export default {
  name: "Comment",
  props: ["commentId", "commentUserId", "content", "getAllCommentsOfAPost", "userConnected"],
  data() {
    return {
      user: "",
      isEdit: false
    }
  },
  methods: {

    /********************* EDIT COMMENT ********************* /
     * 
     */
    editComment() {
      this.isEdit = true
    },

    /******************** UPDATE COMMENT ******************** /
     * 
     */
    updateComment() {
      this.isEdit = false // Si on edit le post ou que l'on ferme la partie comment, il faut faire this.isEdit = false
    },
    /******************** DELETE COMMENT ******************** /
     * 
     */
    deleteComment() {
      console.log("Delete comment")
    }
  },

  /************** WHEN THE COMPONENT IS CREATED (BEFORE MOUNTED) ************** /
   * It calls the API to get the user information who created the comment,
   * to get his profile picture and full name, and stock them to user data
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
      this.user = response.data
    })
    
    .catch((error) => { if (error.response) { console.log(error.response.data.error) }});
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
    font-size: 1.2rem;
    &__editInput {
      width: 80%;
      margin: 5px;
    }
  }
}
</style>