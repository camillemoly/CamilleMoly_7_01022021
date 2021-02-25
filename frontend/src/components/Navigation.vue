<template>
    <nav class="nav">
        <div class="nav__left">
            <router-link to="/"><img class="nav__left__logo" src="../assets/cut-logo.png"></router-link>
            <input class="nav__left__search" placeholder="Rechercher...">
        </div>
        <div class="nav__profile">
            <router-link to="/profile">
                <div class="nav__profile__container">
                    <img class="nav__profile__container-picture" :src="$store.state.profilePicture">
                </div>
            </router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navigation',
    methods: {
        emptyLocalStorage(){
            localStorage.clear();
        }
    }
}
</script>

// <style lang="scss">
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
            &-picture{
                height: 100%;
                width: 100%;
                object-fit: contain;
            }
        }
    }
}
</style>
