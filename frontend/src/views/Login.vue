<template>
    <div class="login">
        <Authentication :form="form" :auth="login"/>
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
                info: null,
                typeOfAuth: "Connexion",
                authBtn: "Se connecter",
                question: "Pas encore inscrit ?",
                routerLink: "/signup",
                questionBtn: "S'inscrire"
            }
        }
    },
    methods: {
        redirectToHome() {
            setTimeout(() => this.$router.push({ name: "Home" }), 1500)
        },
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
                this.form.info = `${response.data.message} Redirection vers la page d'accueil...`
                this.$store.state.token = response.data.token
                this.$store.state.userId = response.data.user_id
                this.redirectToHome()
            })
            .catch(error => { if(error.response) { this.form.info = error.response.data.error }});
        }
    }
}
</script>