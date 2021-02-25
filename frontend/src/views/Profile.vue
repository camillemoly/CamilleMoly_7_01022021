<template>
    <div class="profile">
        <Navigation></Navigation>
        <h1>This is the profile page</h1>
        <button @click="signOut">Se déconnecter</button>
        <button @click="showUserInfos">Show user info</button>
    </div>
</template>

<script>
import Navigation from "../components/Navigation"

export default {
    name: "Profile",
    components: {
        Navigation
    },
    methods: {
        showUserInfos(){
            console.log(this.$store.state.token)
            console.log(this.$store.state.userId)
            console.log(this.$store.state.firstName)
            console.log(this.$store.state.lastName)
            console.log(this.$store.state.profilePicture)
            console.log(this.$store.state.about)
        },
        signOut(){
            this.$store.state.token = ""
            this.$router.push({ name: "Login" })
        }
    }
}
</script>

<style lang="scss">

</style>