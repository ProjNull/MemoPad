import { defineStore } from 'pinia'

export interface User {
  id: number
  email: string
  name: string
}

export interface AuthState {
  token: string | null
  user: User | null
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
      this.token = localStorage.getItem('token')
    },

    setUser(user: User) {
      this.user = user
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})

