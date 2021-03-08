<template>
  <div :class="$style.profile">
    <Navigation></Navigation>
    <div :class="$style.profile__form">
      <h1>Modifier le profil</h1>
      <p class="info" v-if="$store.state.info !== null">{{ $store.state.info }}</p>
      <form>
        <div class="mb-3">
          <label for="firstName" class="form-label">Prénom</label>
          <input type="text" class="form-control" id="firstName" :value="user.firstName">
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Nom</label>
          <input type="text" class="form-control" id="lastName" :value="user.lastName">
        </div>
        <div class="mb-3">
          <label for="about" class="form-label">À propos</label>
          <input type="text" class="form-control" id="about" :value="user.about">
        </div>
        <div class="mb-3">
          <label for="profilePicture" class="form-label">Choisir une nouvelle photo de profil</label><br>
          <input type="file" id="profilePicture" name="profilePicture" accept="image/png, image/jpeg" :class="$style.profile__form__upload">
        </div>
        <button type="button" :class="$style.profile__form__button" class="btn-secondary-whiteTxt" @click="updateProfile">Valider</button>
        <button type="button" class="btn-tertiary-whiteTxt" @click="deleteProfile">Supprimer le profil</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Navigation from "../components/Navigation"
import { mapState, mapGetters, mapActions } from "vuex"

export default {
  name: "MyProfileEdit",
  components: {
    Navigation
  },
  computed: {
    ...mapGetters(["fullName"]),
    ...mapState(["user"])
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
        this.$store.state.info = `${response.data.message}`
        setTimeout(() => this.$router.push({ name: "MyProfile" }), 1000)
      })
      .catch(error => { if(error.response) { this.$store.state.info = error.response.data.error }});
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
        this.$store.state.info = `${response.data.message}`
        setTimeout(() => this.$router.push({ name: "Login" }), 1000)
      })
      .catch(error => { if(error.response) { this.$store.state.info = error.response.data.error }});
    }
  },

  /*************** WHEN THE PAGE IS CREATED (BEFORE MOUNTED) *************** /
   * It calls the getUserInfos function (stored in vuex actions)
   * to get the information (first name, last name, profile picture and about)
   * of the connected user and store them as vuex states
   * It also calls the resetInfo function (stored in vuex actions),
   * to delete the value of info state,
   * to not display the error of success message of others pages
   */
  created() {
    this.getUserInfos()
    this.resetInfo()
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
      outline: none;
    }
    &__button{
      margin-right: 10px;
    }
  }
}
</style>