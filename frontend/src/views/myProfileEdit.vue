<template>
  <div :class="$style.profile">
    <Navigation/>
    <div :class="$style.profile__form">
      <h1>Modifier le profil</h1>
      <p class="info" v-if="info !== ''">{{ info }}</p>
      <form>
        <div class="mb-3">
          <label for="firstName" class="form-label">Prénom</label>
          <input type="text" class="form-control" id="firstName" :value="userConnected.firstName">
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Nom</label>
          <input type="text" class="form-control" id="lastName" :value="userConnected.lastName">
        </div>
        <div class="mb-3">
          <label for="about" class="form-label">À propos</label>
          <input type="text" class="form-control" id="about" :value="userConnected.about">
        </div>
        <div class="mb-3" :class="$style.profile__form__upload">
          <label for="profilePicture" class="form-label">Choisir une nouvelle photo de profil</label><br>
          <input type="file" id="profilePicture" name="profilePicture" accept="image/png, image/jpeg">
        </div>
        <button type="button" :class="$style.profile__form__button" class="btn-secondary" @click="updateProfile">Valider</button>
        <button type="button" :class="$style.profile__form__button" class="btn-tertiary" @click="deleteProfile">Supprimer le profil</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Navigation from "../components/Navigation"
import { mapState, mapActions } from "vuex"

export default {
  name: "MyProfileEdit",
  components: {
    Navigation
  },
  data() {
    return {
      info: ""
    }
  },
  computed: {
    ...mapState(["userConnected"])
  },
  methods: {
    ...mapActions(["getUserInfos", "resetInfo"]),

    /*************** UPDATE PROFILE *************** /
     * It gets the information of the differents input, then it puts them in a formData object
     * It also checks if the user set a new profile picture and if so, it adds the file in the formData
     * Then it calls the API to update the user profile, displays fail or success message,
     * and redirect the user to the profile page
     */
    updateProfile() {
      const formData = new FormData()
      let userInfos = {
        first_name: document.getElementById("firstName").value,
        last_name: document.getElementById("lastName").value,
        about: document.getElementById("about").value
      }
      formData.set("user", JSON.stringify(userInfos))
      if (document.getElementById("profilePicture").value !== "") {
        formData.set("image", document.getElementById("profilePicture").files[0])
      }
      axios({
        method: "put",
        url: `http://localhost:3000/api/users/${localStorage.getItem("userId")}`,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        data: formData
      })
      .then(response => { 
        this.info = `${response.data.message}`
        setTimeout(() => this.$router.push({ path: "/profile?page=1" }), 1000)
      })
      .catch(error => { if(error.response) { this.info = error.response.data.error }});
    },

    /*************** DELETE PROFILE *************** /
     * The function calls the API to delete the user and his profile,
     * return fail or success response, then redirect user to the login page
     */
    deleteProfile() {
      axios({
        method: "delete",
        url: `http://localhost:3000/api/users/${localStorage.getItem("userId")}`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => { 
        this.info = `${response.data.message}`
        setTimeout(() => this.$router.push({ name: "Login" }), 1000)
      })
      .catch(error => { if(error.response) { this.info = error.response.data.error }});
    }
  },

  /*************** WHEN THE PAGE IS CREATED (BEFORE MOUNTED) *************** /
   * It calls the getUserInfos function (stored in vuex actions)
   * to get the information (first name, last name, profile picture and about)
   * of the connected user and store them as vuex states
   */
  created() {
    this.getUserInfos()
  }
}
</script>

<style module lang="scss">
.profile{
  width: 100%;
  &__form{
    width: 80%;
    margin: auto;
    &__upload{
      overflow: hidden;
    }
    &__button{
      margin: 0 16px 16px 0;
    }
  }
}
</style>