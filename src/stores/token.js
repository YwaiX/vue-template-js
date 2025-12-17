import { defineStore } from "pinia"
import { ref } from "vue"

export const useToken = defineStore('token', () => {
  let token = ref('')

  function updateToken (option) {
    token.value = option
  }

  function removeToken () {
    token.value = ''
  }

  return {
    token,
    updateToken,
    removeToken
  }
}, {
  persist: {
    enabled: true,
    strategies: [{
      key: 'token',
      storage: localStorage
    }]
  }
})