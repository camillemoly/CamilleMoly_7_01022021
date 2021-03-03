<template>
  <div :class="$style.post">
    <div v-if="postUserId == loginUserId" :class="$style.post__settings" class="dropright">
      <button class="btn-secondary-whiteTxt dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-cog"></i>
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a v-if="$route.name == 'Home'" @click="editPost"><router-link class="dropdown-item" :to="'/?postId=' + postId">Modifier</router-link></a>
        <a v-if="$route.name == 'MyProfile'" @click="editPost"><router-link class="dropdown-item" :to="'/profile?postId=' + postId">Modifier</router-link></a>
        <a @click="deletePost" class="dropdown-item" :class="$style.post__settings__delete">Supprimer</a>
      </div>
    </div>
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
    <p v-show="isEdit == false" :class="$style.post__content">{{ content }}</p>
    <input v-show="isEdit" :id="'editContent' + [[ postId ]]" :class="$style.post__content" :value="content"/>
    <img v-show="isEdit == false && postPicture !== null" :class="$style.post__picture" :src="postPicture"/>
    <div v-show="isEdit == false" :class="$style.post__buttons">
      <button class="btn-primary-whiteTxt like">
        <i class="far fa-thumbs-up"></i><span> J'aime</span>
      </button>
      <button class="btn-primary-whiteTxt">Commenter</button>
    </div>
    <div v-show="isEdit" :class="$style.post__buttons">
      <input type="file" :id="'editPostPicture' + [[ postId ]]" name="postPicture" accept="image/png, image/jpeg">
      <button class="btn-secondary-whiteTxt" @click="updatePost">Valider</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Post",
  props: ["postId", "postUserId", "date", "content", "postPicture", "getAllPosts", "getMyAllPosts"],
  data() {
    return {
      user: "",
      loginUserId: localStorage.getItem("userId"),
      isEdit: false
    };
  },
  methods: {
    deletePost() {
      axios({
        method: "delete",
        url: `http://localhost:3000/api/posts/${this.postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          console.log(response.data.message)
          if (this.$route.name == 'Home') {
          this.getAllPosts()
          } else if (this.$route.name == 'MyProfile') {
            this.getMyAllPosts()
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data.error);
          }
        });
    },
    editPost(){
      this.isEdit = true
    },
    updatePost(){
      this.isEdit = false
      const formData = new FormData()
      let postInfos = {
        content: document.getElementById(`editContent` + this.postId).value
      }
      formData.set("post", JSON.stringify(postInfos))
      if (document.getElementById(`editPostPicture` + this.postId).value !== "") {
        formData.set("image", document.getElementById(`editPostPicture` + this.postId).files[0])
      }
      const searchParams = new URLSearchParams(window.location.search);
      const postId = searchParams.get("postId");
      axios({
        method: "put",
        url: `http://localhost:3000/api/posts/${postId}`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: formData
      })
      .then(response => { 
        this.$store.state.info = `${response.data.message}`
        if (this.$route.name == 'Home') {
          this.$router.push({ name: "Home" })
          this.getAllPosts()
        } else if (this.$route.name == 'MyProfile') {
          this.$router.push({ name: "MyProfile" })
          this.getMyAllPosts()
        }
      })
      .catch(error => { if(error.response) { this.$store.state.info = error.response.data.error }});
    }
  },
  created() {
    axios({
      method: "get",
      url: `http://localhost:3000/api/users/${this.postUserId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        this.user = response.data;
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data.error);
        }
      });
  },
};
</script>

<style module lang="scss">
.post {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 4px;
  background-color: white;
  color: black;
  &__settings {
    position: absolute;
    top: 5px;
    right: 5px;
    &__delete{
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
  }
  &__buttons {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 10px;
  }
}
</style>