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
    setOpenNoteTitle(title:string) {
      if (this.openNote) {
        this.openNote.title = title;
      }
    },
    clearOpenNote() {
      this.openNote = null
    },
    isCurrentOpenNote(id:number) {
      if (this.openNote) {
        return this.openNote.id == id;
      }
      return false;
    }
  }
})

