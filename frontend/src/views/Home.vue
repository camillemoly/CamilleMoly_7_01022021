<template>
  <div :class="$style.home">
    <Navigation/>
    <div :class="$style.home__container">
      <div :class="$style.publication">
        <div :class="$style.publication__user">
          <div :class="$style.publication__user__picture" class="img-container-rounded">
            <img :src="profilePicture" class="img-cover">
          </div>
          <textarea :class="$style.publication__user__input" :placeholder="'Bonjour ' + [[ firstName ]] + ', que voulez-vous dire ?'"></textarea>
        </div>
        <div :class="$style.publication__buttons">
          <button class="btn-primary-blackTxt">Ajouter une image</button>
          <button class="btn-secondary-blackTxt">Publier</button>
        </div>
      </div>
      <div :class="$style.posts">
        <h1>HERE ARE THE POSTS</h1>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "../components/Navigation"
import { mapState, mapGetters, mapActions } from "vuex"

export default {
  name: "Home",
  components: {
    Navigation
  },
  computed: {
    ...mapGetters(["fullName"]),
    ...mapState(["firstName", "lastName", "profilePicture", "about"])
  },
  methods: {
    ...mapActions(["getUserInfos", "resetInfo"])
  },
  created() {
    this.getUserInfos()
    this.resetInfo()
  }
}
</script>

<style module lang="scss">
.home__container{
  width: 100%;
  margin: auto;
}
.publication{
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px 10px;
  border-radius: 4px;
  background-color: white;
  &__user{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 10px;
    &__picture{
      height: 80px;
      width: 80px;
    }
    &__input{
      min-height: 60px;
      width: 60%;
      border-radius: 5px;
    }
  }
  &__buttons{
    display: flex;
    justify-content: space-around;
  }
}
.posts{
  height: 500px;
  width: 100%;
  margin: 10px auto;
  border-radius: 4px;
  text-align: center;
  color: black;
  background-color: white;
}

@media (min-width: 480px) {
  .home__container{
    width: 80%;
  }
}

@media (min-width: 1024px) {
  .home__container{
    width: 60%;
  }
}
</style>