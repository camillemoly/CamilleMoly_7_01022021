<template>
  <div :class="$style.auth">
    <div :class="$style.auth__logo">
      <img :class="$style.auth__logo__image" src="../assets/entire-logo.png" alt="logo groupomania">
    </div>
    <form :class="$style.auth__form">
      <h1 :class="$style.auth__form__title">{{ form.typeOfAuth }}</h1>
      <p v-if="info !== ''" class="info">{{ info }}</p>
      <div v-if="$route.name == 'Signup'" class="mb-3"> <!-- display only on signup page -->
        <label for="firstName" class="form-label">Prénom</label>
        <input id="firstName" type="text" class="form-control">
      </div>
      <div v-if="$route.name == 'Signup'" class="mb-3"> <!-- display only on signup page -->
        <label for="lastName" class="form-label">Nom</label>
        <input id="lastName" type="text" class="form-control">
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input id="email" type="email" class="form-control">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input id="password" type="password" class="form-control">
      </div>
      <div class="mb-3 form-check">
        <input @click="showPassword" id="showHide" type="checkbox" class="form-check-input">
        <label class="form-check-label" for="showHide">Afficher/masquer le mot de passe</label>
      </div>
      <button @click="auth" type="button" class="btn-secondary">{{ form.authBtn }}</button>
      <p :class="$style.auth__form__question">{{ form.question }}</p>
      <router-link :to="form.routerLink">
        <button type="button" class="btn-secondary">{{ form.questionBtn }}</button>
      </router-link>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Authentication',
  props: ["form", "auth", "info"],
  methods: {

    /**
     * @description This function will change the type of the password
     *
     * @return  {String}  Type of the password
     */
    showPassword() {
      let password = document.getElementById("password");
      if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
    }
  }
}
</script>

<style module lang="scss">
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 30px 0;
  &__logo {
    width: 60%;
    max-width: 450px;
    margin: 10px 0 50px 0;
    &__image {
      height: auto;
      width: 100%;
      object-fit: cover;
    }
  }
  &__form {
    width: 80%;
    max-width: 450px;
    &__title {
      display: inline-block;
      margin-bottom: 15px;
      border-bottom: 2px solid white;
      font-size: 2rem;
    }
    &__question {
      margin: 30px 0 5px 0;
    }
  }
}

@media (min-width: 1024px) {
  .auth {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    &__logo, &__form {
      width: 40%;
    }
  }
}
</style>