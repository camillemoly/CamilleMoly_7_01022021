<template>
    <div :class="$style.profile">
        <Navigation></Navigation>
        <div :class="$style.profile__container">
            <div :class="$style.profile__picture" class="img-container-rounded">
                <img :src="profilePicture" class="img-cover">
            </div>
            <h1 :class="$style.profile__fullname">{{ fullName }}</h1>
            <div :class="$style.profile__about">
                <h2 :class="$style.profile__about__title">À propos</h2>
                <span :class="$style.profile__about__text">{{ about }}</span>
            </div>
            <div :class="$style.profile__buttons">
                <router-link to="/profile/edit">
                    <button type="button" class="btn-secondary-whiteTxt">Modifier mon profil</button>
                </router-link>
                <button @click="signOut" class="btn-tertiary-whiteTxt">Se déconnecter</button>
            </div>
            <h2 :class="$style.profile__posts__title">Derniers Posts</h2>
            <div :class="$style.profile__posts">
                <div>HERE ARE THE LAST POSTS</div>
            </div> 
        </div>
    </div>
</template>

<script>
import Navigation from "../components/Navigation"
import { mapState, mapGetters, mapActions } from "vuex"

export default {
    name: "MyProfile",
    components: {
        Navigation
    },
    computed: {
        ...mapGetters(["fullName"]),
        ...mapState(["firstName", "lastName", "profilePicture", "about", "info"])
    },
    methods: {
        ...mapActions(["getUserInfos", "resetInfo", "signOut"]),
    },
    created() {
        this.getUserInfos()
        this.resetInfo()
    }
}
</script>

<style module lang="scss">
.profile{
    &__container{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: auto;
    }
    &__picture{
        height: 150px;
        width: 150px;
        margin: 10px 0;
    }
    &__fullname{
        font-size: 1.6rem;
    }
    &__about{
        width: 80%;
        max-width: 350px;
        margin: 5px 0;
        padding: 5px;
        border-radius: 4px;
        color: black;
        background-color: white;
        &__title{
            font-size: 1rem;
            font-weight: bold;
        }
    }
    &__buttons{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        width: 80%;
        max-width: 350px;
        & button{
            margin-top: 5px;
        }
    }
    &__posts{
        height: 500px;
        width: 100%;
        border-radius: 4px;
        text-align: center;
        font-size: 2rem;
        color: black;
        background-color: white;
        &__title{
            width: 100%;
            margin-top: 20px;
            padding-left: 5px;
            text-align: left;
            font-size: 1rem;
        }
    }
}

@media (min-width: 480px) {
    .profile__container{
        width: 80%;
    }
}

@media (min-width: 1024px) {
    .profile__container{
        width: 60%;
    }
}
</style>