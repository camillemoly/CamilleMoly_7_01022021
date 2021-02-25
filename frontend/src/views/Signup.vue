<template>
    <div class="signup">
        <Authentication :form="form" :auth="signup"/>
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
                info: null,
                typeOfAuth: "Inscription",
                authBtn: "S'inscrire",
                question: "Déjà un compte ?",
                routerLink: "/login",
                questionBtn: "Se connecter"
            }
        }
    },
    methods: {
        redirectToLogin() {
            setTimeout(() => this.$router.push({ name: "Login" }), 2000)
        },
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
                this.form.info = `${response.data.message} Redirection vers la page de connexion...`
                this.redirectToLogin()
            })
            .catch(error => { if(error.response) { this.form.info = error.response.data.error }});
        }
    }
}
</script>