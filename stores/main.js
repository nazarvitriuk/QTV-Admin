import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      queue: []
    }
  },
  actions: {
    setQueue(data) {
      console.log(data)

      this.queue = data;
    }
  },
})