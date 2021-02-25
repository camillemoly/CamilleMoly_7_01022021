<template>
  <div class="home">
    <Navigation></Navigation>
    <div class="home__container">
      <div class="publication">
        <div class="publication__user">
          <div class="publication__user__picture">
            <img :src="$store.state.profilePicture">
          </div>
          <input class="publication__user__input" placeholder="Que voulez-vous dire ?">
        </div>
        <div class="publication__buttons">
          <button class="publication__buttons__addPicture">Ajouter une image</button>
          <button class="publication__buttons__publish">Publier</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import Navigation from "../components/Navigation"

export default {
  name: "Home",
  components: {
    Navigation
  },
  created(){
    axios({
      method: "get",
      url: `http://localhost:3000/api/users/${this.$store.state.userId}`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$store.state.token}`
      }
    })
      .then(response => {
        this.$store.state.firstName = response.data.firstName
        this.$store.state.lastName = response.data.lastName
        this.$store.state.profilePicture = response.data.profilePicture
        this.$store.state.about = response.data.about
      })
      .catch(error => { if(error.response) { console.log(error.response.data) }});
  }
}
</script>

<style lang="scss">
.home__container{
  width: 100%;
  margin: auto;
}
.publication{
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: white;
  &__user{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 10px;
    &__picture{
      height: 50px;
      width: 50px;
      & img{
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
    &__input{
      height: 30px;
      width: 180px;
      border-radius: 5px;
    }
  }
  &__buttons{
    display: flex;
    justify-content: space-around;
    &__addPicture, &__publish{
      border: none;
      border-radius: 6px;
    }
    &__addPicture{
      background-color: #1e6d80;
    }
    &__publish{
      background-color: #c71d78;
    }
  }
}

@media (min-width: 480px) {
  .home__container{
    width: 60%;
  }
}
</style>