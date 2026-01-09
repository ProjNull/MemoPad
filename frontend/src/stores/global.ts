import { defineStore } from 'pinia'


export interface GlobalState {
  openNote: API.NoteInfo | null
}

export const useGlobalState = defineStore('global', {
  state: (): GlobalState => ({
    openNote: null,
  }),

  getters: {
    getOpenNote: (state) => state.openNote,
    hasOpenNote: (state) => !!state.openNote
  },

  actions: {
    setOpenNote(note:API.NoteInfo) {
      this.openNote = note
    },
    clearOpenNote() {
      this.openNote = null
    },
  }
})

