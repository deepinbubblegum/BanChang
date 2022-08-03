import AuthService from '../../services/auth.services';
const local_token = JSON.parse(localStorage.getItem('token'))
if(local_token === null){
  localStorage.setItem('token',JSON.stringify({value:null,expire:null}))
}

const local_token_planet = localStorage.getItem('token_planet')
if(local_token_planet === null){
  localStorage.setItem('token_planet',null)
}

export const auth = {
  namespaced: true,
  state: {
    status:{
      loggedIn:false,
    },
    token:local_token,
    token_planet:local_token_planet
  },
  getters:{
    isAuthenticate(state){
      return state.status.loggedIn
    }
  },
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then((res) => {
          var res_data;
          if(res.code !== undefined){
            if(res.code === 'ERR_NETWORK'){
              res_data = {success:false,message:'Not Connect to Server'}
            }
            commit('loginFailure')
          }else if(res.data !== undefined){
            res_data = res.data
            commit('loginSuccess');
          }
          return res_data;
        },
      )
    },
    login_planet({ commit }) {
      return AuthService.login_planet().then((response) => {
          if(response.data.token){
            commit('loginPlanetSuccess');
          }
          return Promise.resolve(response)
        },
      ).catch((error)=>{
        return Promise.reject(error)
      }
      )
    },
    logout({ commit }) {
      AuthService.logout()
      commit('logout');
    },
    // checkExpire({commit}){
    //   var check = AuthService.checkExpireToken()
    //   if(check){
    //     commit('logout')
    //   }
    //   return check

    // }
    
  },
  mutations: {
    loginSuccess(state) {
      state.status.loggedIn = true;
      state.token = JSON.parse(localStorage.getItem('token')).value
    },
    loginPlanetSuccess(state) {
        state.token_planet = localStorage.getItem('token_planet')
    },
    loginFailure(state) {
      state.status.loggedIn = false;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.token = null
    },
  }
};