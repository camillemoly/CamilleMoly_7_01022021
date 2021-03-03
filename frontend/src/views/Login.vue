<template>
  <div class="login">
    <Authentication :form="form" :info="$store.state.info" :auth="login"/>
  </div>
</template>

<script>
import axios from "axios"
import Authentication from "../components/Authentication"

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
      }
    }
  },
  methods: {
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
        this.$store.state.info = `${response.data.message} Redirection vers la page d'accueil...`
        localStorage.setItem("userId", response.data.user_id)
        localStorage.setItem("token", response.data.token)
        setTimeout(() => this.$router.push({ name: "Home" }), 1500)
      })
      .catch(error => { if(error.response) { this.$store.state.info = error.response.data.error }});
    }
  }
}
</script>