import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      queue: []
    }
  },
  actions: {
    setQueue(data) {
      this.queue = data;
    }
  },
})