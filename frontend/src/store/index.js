import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: "",
    token: "",
    firstName: "",
    lastName: "",
    profilePicture: "https://www.pngkey.com/png/full/73-730477_first-name-profile-image-placeholder-png.png",
    about: ""
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
