<template>
    <div class="authentication">
        <div class="logo">
            <img class="logo__image" src="../assets/entire-logo.png">
        </div>
        <form class="form">
            <h1 class="form__title">{{ form.typeOfAuth }}</h1>
            <p class="form__info" v-if="form.info !== null">{{ form.info }}</p>
            <div class="mb-3" v-show="$route.name == 'Signup'">
                <label for="firsName" class="form-label">Prénom</label>
                <input type="text" class="form-control" id="firstName">
            </div>
            <div class="mb-3" v-show="$route.name == 'Signup'">
                <label for="lastName" class="form-label">Nom</label>
                <input type="text" class="form-control" id="lastName">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" id="password">
            </div>
            <div class="mb-3 form-check">
                <input type="checkbox" @click="showPassword" class="form-check-input" id="showHide">
                <label class="form-check-label" for="showHide">Afficher/masquer</label>
            </div>
            <button type="button" class="button-confirm" @click="auth">{{ form.authBtn }}</button>
            <p class="form__question">{{ form.question }}</p>
            <router-link :to="form.routerLink">
                <button type="button" class="button-confirm">{{ form.questionBtn }}</button>
            </router-link>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Authentication',
    props: ["form", "auth"],
    methods: {
        showPassword() {
            var x = document.getElementById("password");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
        }
    }
}
</script>

<style lang="scss">
.authentication{
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 30px 0;
}
.logo{
    width: 60%;
    max-width: 450px;
    margin: 10px 0 50px 0;
    &__image{
        height: auto;
        width: 100%;
        object-fit: cover;
    }
}
.form{
    width: 80%;
    max-width: 450px;
    &__info{
        background-color: $color-secondary;
    }
    &__title{
        display: inline-block;
        margin-bottom: 15px;
        border-bottom: 2px solid white;
        font-size: 2rem;
    }
    &__question{
        margin: 30px 0 5px 0;
    }
}

@media (min-width: 1024px) {
    .authentication{
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }
    .logo, .form{
        width: 40%;
    }
}
</style>