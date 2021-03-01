<template>
    <nav :class="$style.nav">
        <div :class="$style.nav__left">
            <router-link to="/"><img :class="$style.nav__left__logo" src="../assets/cut-logo.png"></router-link>
            <input :class="$style.nav__left__search" placeholder="Rechercher...">
        </div>
        <div :class="$style.nav__profile">
            <router-link to="/profile">
                <div :class="$style.nav__profile__container" class="img-container-rounded">
                    <img class="img-cover" :src="profilePicture">
                </div>
            </router-link>
        </div>
    </nav>
</template>

<script>
import { mapState } from "vuex"

export default {
    name: 'Navigation',
    computed: {
        ...mapState(["profilePicture"])
    },
    methods: {
        emptyLocalStorage(){
            localStorage.clear();
        }
    }
}
</script>

<style module lang="scss">
.nav{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    width: 100%;
    padding: 0 20px;
    &__left{
        display: flex;
        align-items: center;
        width: 75%;
        &__logo{
            height: 50px;
            margin-right: 10px;
        }
        &__search{
            width: 85%;
            max-width: 250px;
            border-radius: 4px;
            border: none;
        }
    }    
    &__profile{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 15%;
        &__container{
            height: 50px;
            width: 50px;
        }
    }
}

@media (min-width: 480px) {
    .nav{
        padding: 0 40px;
        &__left{
            &__logo{
                height: 60px;
            }
        }
        &__profile{
            &__container{
                height: 60px;
                width: 60px;
            }
        }
    }
}
</style>
