import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import router from "../router/index"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userConnected: {
      firstName: "",
      lastName: "",
      profilePicture: "",
      about: "",
      isAdmin: ""
    }
  },
  getters: {
    fullName: (state) => {
      return `${state.userConnected.firstName} ${state.userConnected.lastName}`
    }
  },
  mutations: {
    EDIT_FIRST_NAME(state, value) {
      state.userConnected.firstName = value
    },
    EDIT_LAST_NAME(state, value) {
      state.userConnected.lastName = value
    },
    EDIT_PROFILE_PICTURE(state, value) {
      state.userConnected.profilePicture = value
    },
    EDIT_ABOUT(state, value) {
      state.userConnected.about = value
    },
    EDIT_IS_ADMIN(state, value) {
      state.userConnected.isAdmin = value
    }
  },
  actions: {

    /**
     * @description This function will edit user state with user connected information
     *
     * @param   {Object}  context  Exposes the same set of methods and properties as the store instance
     *
     * @return  {Object}           User object to edit user state of the store
     */
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
        context.commit("EDIT_IS_ADMIN", user.data.is_admin)
      })
      
      .catch(error => { 
        console.log(error.response.data.error)
        localStorage.clear()
        router.push({ name: "Login" })
      });
    },

    /**
     * @description This function will edit the user state of the store with empty value
     *
     * @param   {Object}  context  Exposes the same set of methods and properties as the store instance
     *
     * @return  {Function}         Edits the user state, clears the localStorage and redirects user to the login page
     */
    signOut(context) {
      context.commit("EDIT_FIRST_NAME", "")
      context.commit("EDIT_LAST_NAME", "")
      context.commit("EDIT_PROFILE_PICTURE", "")
      context.commit("EDIT_ABOUT", "")
      context.commit("EDIT_IS_ADMIN", "")
      localStorage.clear()
      router.push({ name: "Login" })
    },

    /**
     * @description This function will check if the localStorage contains a token
     *
     * @return  {Function}   Redirects the user to the login page
     */
    checkIfUserIsConnected() {
      if (!localStorage.getItem("token") || !localStorage.getItem("userId")) {
        router.push({ name: "Login" })
      }
    }
  }
})