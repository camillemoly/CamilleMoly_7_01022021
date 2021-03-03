import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import router from "../router/index"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      firstName: "",
      lastName: "",
      profilePicture: "",
      about: ""
    },
    info: null
  },
  getters: {
    fullName: (state) => {
      return `${state.user.firstName} ${state.user.lastName}`
    }
  },
  mutations: {
    EDIT_FIRST_NAME(state, value) {
      state.user.firstName = value
    },
    EDIT_LAST_NAME(state, value) {
      state.user.lastName = value
    },
    EDIT_PROFILE_PICTURE(state, value) {
      state.user.profilePicture = value
    },
    EDIT_ABOUT(state, value) {
      state.user.about = value
    },
    RESET_INFO(state) {
      state.info = null
    }
  },
  actions: {
    signOut(context){
      context.commit("EDIT_FIRST_NAME", "")
      context.commit("EDIT_LAST_NAME", "")
      context.commit("EDIT_PROFILE_PICTURE", "")
      context.commit("EDIT_ABOUT", "")
      context.commit("RESET_INFO")
      localStorage.clear()
      router.push({ name: "Login" })
    },
    resetInfo(context){
      context.commit("RESET_INFO")
    },
    getUserInfos(context) {
      axios({
        method: "get",
        url: `http://localhost:3000/api/users/${localStorage.getItem("userId")}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(user => { 
        context.commit("EDIT_FIRST_NAME", user.data.first_name)
        context.commit("EDIT_LAST_NAME", user.data.last_name)
        context.commit("EDIT_PROFILE_PICTURE", user.data.profile_picture)
        context.commit("EDIT_ABOUT", user.data.about)
      })
      .catch(error => { 
        if(error.response) {
            console.log(error.response.data.error)
            context.dispatch("signOut")
        }
      });
    }
  },
  modules: {
  }
})