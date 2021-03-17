<template>
  <div class="login">
    <Authentication :form="form" :info="info" :auth="login"/>
  </div>
</template>

<script>
import axios from "axios"
import Authentication from "../components/Authentication"
import { mapState } from "vuex"

export default {
  name: "Login",
  components: {
    Authentication
  },
  data(){
    return{
      form: {
        typeOfAuth: "Connexion",
        authBtn: "Se connecter",
        question: "Pas encore inscrit ?",
        routerLink: "/signup",
        questionBtn: "S'inscrire"
      },
      info: ""
    }
  },
  computed: {
    ...mapState(["userConnected"])
  },
  methods: {

    /********************* LOGIN ********************* /
     * This function calls the API to connect the user,
     * displays the API response (fail or success) by storing it in the vuex info state,
     * store in the localStorage his userId and the generated token,
     * and redirects him to the home page
     */
    login() {
      axios({
        method: "post",
        url: "http://localhost:3000/api/auth/login",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          email: document.getElementById("email").value,
          password: document.getElementById("password").value
        }
      })
      .then(response => { 
        this.info = `${response.data.message} Redirection vers la page d'accueil...`
        localStorage.setItem("userId", response.data.user_id)
        localStorage.setItem("token", response.data.token)
        setTimeout(() => this.$router.push({ path: "/", query: { page: 1 } } ), 1500)
      })
      .catch(error => { if(error.response) { this.info = error.response.data.error }});
    }
  }
}
</script>