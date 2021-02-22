<template>
    <div class="login">
        <p>S'inscrire ici :</p>
        <p>Vous avez déjà un compte ?</p>
        <button><router-link to="/login" id="login">Se connecter</router-link></button>
    </div>
</template>

<script>
export default {
    name: 'Signup'
}
</script>

<style lang="scss">
    #login{
        text-decoration: none;
        color: black;
    }
</style>
