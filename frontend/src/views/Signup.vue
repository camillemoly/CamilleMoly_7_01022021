<template>
    <div class="signup">
        <Authentication :form="form" :info="$store.state.info" :auth="signup"/>
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
            }
        }
    },
    methods: {
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
                this.$store.state.info = `${response.data.message} Redirection vers la page de connexion...`
                setTimeout(() => this.$router.push({ name: "Login" }), 1500)
            })
            .catch(error => { if(error.response) { this.$store.state.info = error.response.data.error }});
        }
    }
}
</script>