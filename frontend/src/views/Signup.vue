<template>
  <div class="signup">
    <Authentication :form="form" :info="info" :auth="signup"/>
  </div>
</template>

<script>
import axios from "axios"
import Authentication from "../components/Authentication"

export default {
  name: "Signup",
  components: {
    Authentication
  },
  data(){
    return{
      form: {
        typeOfAuth: "Inscription",
        authBtn: "S'inscrire",
        question: "Déjà un compte ?",
        routerLink: "/login",
        questionBtn: "Se connecter"
      },
      info: ""
    }
  },
  methods: {

    /********************* SIGNUP ********************* /
     * This function calls the API to register the user,
     * displays the API response (fail or success) by storing it in the vuex info state,
     * and redirects him to the login page
     */
    signup() {
      axios({
        method: "post",
        url: "http://localhost:3000/api/auth/signup",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          first_name: document.getElementById("firstName").value,
          last_name: document.getElementById("lastName").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value
        }
      })
      .then(response => { 
        this.info = `${response.data.message} Redirection vers la page de connexion...`
        setTimeout(() => this.$router.push({ name: "Login" }), 1500)
      })
      .catch(error => { if(error.response) { this.info = error.response.data.error }});
    }
  }
}
</script>