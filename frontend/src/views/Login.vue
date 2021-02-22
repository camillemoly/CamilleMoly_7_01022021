<template>
    <div class="login">
        <div class="section">
            <div class="section__logo">
                <img src="../../public/images/icon-left-font-monochrome-white.png">
            </div>
            <div class="section__form">
                <h1 class="section__form__title">Connexion</h1>
                <input class="section__form__input" placeholder="Email"/><br><br>
                <input class="section__form__input" placeholder="Password"/>
                <p class="section__form__question">Pas encore inscrit ?</p>
                <button class="section__form__button">
                    <router-link to="/signup" class="login__router">S'inscrire</router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login'
}
</script>

<style lang="scss">
.login{
    background-color: #1e6d80;
    color: white;
    &__router{
        text-decoration: none;
        color: white;
    }
}

.section{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-width: 100vw;
    &__logo{
        height: 100px;
        width: 60%;
        & img{
            height: 100%;
            width: 100%;
            max-width: 250px;
            object-fit: cover;
        }
    }
    &__form{
        width: 70%;
        &__title{
            font-size: 1.2rem;
        }
        &__input, &__button{
            border-radius: 4px;
            border: none;
        }
        &__question{
            margin: 30px 0 5px 0;
            font-size: 0.8rem;
        }
        &__button{
            background-color: #c71d78;
            font-size: 0.7rem;
        }
    }
}

@media (min-width: 768px) {
    .section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        &__logo{
            width: 40%;
            margin-left: 10%;
        }
        &__form{
            width: 40%;
            margin-right: 10%;
        }
    }
}
</style>