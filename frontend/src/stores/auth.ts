import { defineStore } from 'pinia'


export interface AuthState {
  token: string | null
  user: API.Responses.UserInfo | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    loadToken() {
      this.token = localStorage.getItem('token');
      return this.token;
    },

    setUser(user: API.Responses.UserInfo) {
      this.user = user
    },

    getName() {
      if (this.user) {
        return this.user.username;
      }
      return "NONE";
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})

